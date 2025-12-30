const fs = require("fs");
const path = require("path");
const { extractText } = require("./textExtractor");
const { chunkText } = require("./chunkGenerator");
const { generateEmbeddings } = require("./embeddingService");
const { initVectorDB, insertVectors } = require("./vectorDB");
const DocumentMetadata = require("../models/documentMetadata");
const ChunkPermissions = require("../models/chunkPermissions");
const StoredFiles = require("../models/storedFiles");
const { v4: uuidv4 } = require("uuid");

/**
 * Scan uploads directory and automatically process unregistered files
 */
async function scanUploadsDirectory() {
  try {
    const uploadsDir = "uploads/";
    
    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      console.log("Uploads directory not found");
      return;
    }

    // Read all files in uploads directory
    const files = fs.readdirSync(uploadsDir);
    
    for (const filename of files) {
      await processFile(filename);
    }
    
    console.log(`Scanned ${files.length} files in uploads directory`);
  } catch (error) {
    console.error("Error scanning uploads directory:", error);
  }
}

/**
 * Process a single file from uploads directory
 */
async function processFile(filename) {
  try {
    const filePath = path.join("uploads", filename);
    const fileStats = fs.statSync(filePath);
    
    // Check if file is already in database
    const existingFile = await StoredFiles.findOne({ 
      storedFilename: filename,
      status: { $ne: "DELETED" }
    });
    
    if (existingFile) {
      console.log(`File ${filename} already exists in database`);
      return;
    }

    console.log(`Processing new file: ${filename}`);
    
    // Generate IDs
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileExt = path.extname(filename).toUpperCase().slice(1);
    
    // Determine document type based on filename or extension
    const documentType = determineDocumentType(filename, fileExt);
    const department = determineDepartment(filename);
    
    // Step 1: Store file information in database
    const storedFile = new StoredFiles({
      fileId,
      originalFilename: filename,
      storedFilename: filename,
      filePath,
      fileSize: fileStats.size,
      mimeType: getMimeType(fileExt),
      documentId,
      uploadedBy: "system_auto_scan", // System user
      uploadedByRole: "ADMIN", // Default to admin for auto-scanned files
      ingestionStatus: "PROCESSING"
    });
    await storedFile.save();

    // Step 2: Extract text from file
    const rawText = await extractText(filePath);

    if (!rawText || rawText.length < 20) {
      await StoredFiles.updateOne(
        { fileId },
        { ingestionStatus: "FAILED" }
      );
      console.log(`Failed to extract text from ${filename}`);
      return;
    }

    // Step 3: Store document metadata
    const documentMetadata = new DocumentMetadata({
      documentId,
      filename,
      fileType: fileExt,
      documentType,
      department,
      version: "v1.0",
      status: "ACTIVE",
      uploadedByRole: "ADMIN",
      allowedRoles: ["ADMIN", "EMPLOYEE"], // Default permissions
      createdAt: new Date(),
      expiresAt: null
    });
    await documentMetadata.save();

    // Step 4: Generate chunks with document ID
    const chunks = chunkText(rawText, {
      source: filename,
      documentId
    });

    // Step 5: Generate embeddings for chunks
    const embeddedChunks = await generateEmbeddings(chunks);
   
    // Step 6: Store chunk permissions in MongoDB
    const chunkPermissions = chunks.map(chunk => ({
      chunkId: chunk.chunk_id,
      documentId,
      sectionName: `Section ${chunk.chunk_index + 1}`,
      allowedRoles: ["ADMIN", "EMPLOYEE"],
      authorityWeight: 0.9,
      createdAt: new Date()
    }));
    await ChunkPermissions.insertMany(chunkPermissions);
   
    // Step 7: Store embeddings in vector database
    await initVectorDB();
    await insertVectors(embeddedChunks);

    // Step 8: Update file status to completed
    await StoredFiles.updateOne(
      { fileId },
      {
        ingestionStatus: "COMPLETED",
        processedAt: new Date(),
        chunksGenerated: chunks.length,
        embeddingGenerated: true
      }
    );

    console.log(`Successfully processed ${filename}: ${chunks.length} chunks generated`);
    
  } catch (error) {
    console.error(`Error processing file ${filename}:`, error);
  }
}

/**
 * Determine document type based on filename
 */
function determineDocumentType(filename, extension) {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes("policy") || lowerFilename.includes("rule")) {
    return "POLICY";
  } else if (lowerFilename.includes("procedure") || lowerFilename.includes("process")) {
    return "PROCEDURE";
  } else if (lowerFilename.includes("guide") || lowerFilename.includes("manual")) {
    return "GUIDELINE";
  } else if (lowerFilename.includes("report")) {
    return "REPORT";
  } else {
    return "MANUAL";
  }
}

/**
 * Determine department based on filename
 */
function determineDepartment(filename) {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes("hr") || lowerFilename.includes("employee") || lowerFilename.includes("leave")) {
    return "HR";
  } else if (lowerFilename.includes("finance") || lowerFilename.includes("budget") || lowerFilename.includes("expense")) {
    return "FINANCE";
  } else if (lowerFilename.includes("it") || lowerFilename.includes("tech") || lowerFilename.includes("software")) {
    return "IT";
  } else if (lowerFilename.includes("market") || lowerFilename.includes("sales")) {
    return "MARKETING";
  } else if (lowerFilename.includes("legal") || lowerFilename.includes("contract")) {
    return "LEGAL";
  } else {
    return "OPERATIONS";
  }
}

/**
 * Get MIME type based on file extension
 */
function getMimeType(extension) {
  const mimeTypes = {
    "PDF": "application/pdf",
    "DOCX": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "XLSX": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "TXT": "text/plain"
  };
  
  return mimeTypes[extension] || "application/octet-stream";
}

/**
 * Start monitoring uploads directory (can be called on server startup)
 */
async function startFileMonitoring() {
  console.log("Starting file monitoring service...");
  await scanUploadsDirectory();
  
  // Optional: Set up file watcher for real-time monitoring
  // This would require additional dependencies like 'chokidar'
}

module.exports = {
  scanUploadsDirectory,
  processFile,
  startFileMonitoring
};
