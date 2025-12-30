/**
 * Ingestion Controller (RAG System – Data Preparation Layer system-1)
 *
 * This controller is responsible for the first stage of the RAG pipeline.
 * It handles the ingestion of raw input data and prepares it for retrieval-based
 * generation by converting unstructured content into structured, searchable form.
 *
 * The controller performs the following tasks:
 * - Accepts raw text extracted from documents or files
 * - Cleans and normalizes the content
 * - Splits the text into meaningful semantic chunks
 * - Prepares each chunk for embedding and storage in the vector database
 *
 * This module represents the "training" or ingestion side of the RAG system.
 * It does NOT handle user queries or answer generation.
 * Its only responsibility is to convert raw knowledge into retrievable data.
 */



const { extractText } = require("../services/textExtractor");
const { chunkText } = require("../services/chunkGenerator")
const { generateEmbeddings } = require("../services/embeddingService");
const { initVectorDB, insertVectors } = require("../services/vectorDB");
const StoredFiles = require("../models/storedFiles");
const DocumentMetadata = require("../models/documentMetadata");
const fs = require("fs");
const path = require("path");

exports.ingestDocument = async (req, res) => {
  try {
    console.log('📁 Upload request received');
    console.log('📁 File info:', req.file);
    
    if (!req.file) {
      console.log('❌ No file uploaded');
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log('✅ File uploaded:', req.file.originalname);
    console.log('📁 File path:', req.file.path);
    console.log('📁 File size:', req.file.size);
    console.log('📁 File mimetype:', req.file.mimetype);

    // Step 1: Extract text from file
    console.log('🔍 Extracting text...');
    const rawText = await extractText(req.file.path);
    console.log('📄 Extracted text length:', rawText.length);

    if (!rawText || rawText.length < 20) {
      console.log('❌ Text extraction failed - too short');
      return res.status(400).json({ error: "Text extraction failed - file may be empty or corrupted" });
    }

    // Step 2: chunks the rawText 
    console.log('✂️ Chunking text...');
    const chunks = chunkText(rawText, {source: req.file.originalname});
    console.log('📦 Number of chunks:', chunks.length);

    // Step 3: now each chunk converted to embededChunks
    console.log('🧠 Generating embeddings...');
    const embeddedChunks = await generateEmbeddings(chunks);
    console.log('🎯 Embedded chunks:', embeddedChunks.length);
    
    // Step 4: each embededChunks is stored in vectorDatabase (currently using qdrant for vectorDB)
    console.log('💾 Storing in vector database...');
    await initVectorDB();          // run once (safe to call multiple times)
    await insertVectors(embeddedChunks);
    console.log('✅ Successfully stored in vector database');

    // Step 5: Save file info to database
    console.log('💾 Saving file to database...');
    
    // Generate unique file ID
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create document metadata
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine file type enum
    const fileExt = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const fileTypeMap = {
      'pdf': 'PDF',
      'docx': 'DOCX', 
      'xlsx': 'XLSX',
      'txt': 'TXT'
    };
    const fileType = fileTypeMap[fileExt] || 'PDF';
    
    // Determine document type based on filename
    const filename = req.file.originalname.toLowerCase();
    let documentType = 'MANUAL';
    if (filename.includes('policy')) documentType = 'POLICY';
    else if (filename.includes('procedure')) documentType = 'PROCEDURE';
    else if (filename.includes('guideline')) documentType = 'GUIDELINE';
    else if (filename.includes('report')) documentType = 'REPORT';
    
    // Determine department based on filename
    let department = 'HR';
    if (filename.includes('finance') || filename.includes('financial')) department = 'FINANCE';
    else if (filename.includes('it') || filename.includes('technical')) department = 'IT';
    else if (filename.includes('marketing')) department = 'MARKETING';
    else if (filename.includes('legal')) department = 'LEGAL';
    else if (filename.includes('operation')) department = 'OPERATIONS';
    
    const documentMetadata = new DocumentMetadata({
      documentId,
      filename: req.file.originalname,
      fileType: fileType,
      documentType: documentType,
      department: department,
      version: '1.0',
      status: 'ACTIVE',
      uploadedByRole: req.user.role,
      allowedRoles: ['ADMIN', 'EMPLOYEE'],
      chunks: embeddedChunks.length,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await documentMetadata.save();
    console.log('✅ Document metadata saved');

    // Create stored file record
    const storedFile = new StoredFiles({
      fileId,
      originalFilename: req.file.originalname,
      storedFilename: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      documentId,
      uploadedBy: req.user.id,
      uploadedByRole: req.user.role,
      status: 'ACTIVE',
      ingestionStatus: 'COMPLETED',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await storedFile.save();
    console.log('✅ File record saved to database');

    return res.status(200).json({
      success: true,
      message: "Document indexed successfully",
      totalChunks: embeddedChunks.length,
      fileName: req.file.originalname,
      fileId,
      documentId
    });

  } catch (err) {
    console.error("❌ Ingestion Error:", err);
    console.error("❌ Error stack:", err.stack);
    return res.status(500).json({
      success: false,
      error: "Failed to process document",
      details: err.message
    });
  }
};
