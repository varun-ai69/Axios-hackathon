/**
 * Populate Vector Database with Existing Documents
 * -----------------------------------------------
 * This script processes existing files and stores their embeddings in Qdrant
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Import services
const { extractText } = require('./services/textExtractor');
const { chunkText } = require('./services/chunkGenerator');
const { generateEmbeddings } = require('./services/embeddingService');
const { initVectorDB, insertVectors } = require('./services/vectorDB');

// Import models
const StoredFiles = require('./models/storedFiles');

async function populateVectorDB() {
  try {
    console.log('🚀 Starting Vector DB Population...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');
    
    // Initialize Vector DB
    await initVectorDB();
    console.log('✅ Vector DB initialized');
    
    // Get all completed files
    const files = await StoredFiles.find({ ingestionStatus: 'COMPLETED' });
    console.log(`📁 Found ${files.length} files to process`);
    
    let totalChunks = 0;
    
    for (const file of files) {
      try {
        console.log(`\n📄 Processing: ${file.originalFilename}`);
        
        // Check if file exists
        if (!fs.existsSync(file.filePath)) {
          console.log(`⚠️ File not found: ${file.filePath}`);
          continue;
        }
        
        // Extract text
        console.log('🔍 Extracting text...');
        const text = await extractText(file.filePath);
        
        if (!text || text.length < 50) {
          console.log('⚠️ Text too short, skipping');
          continue;
        }
        
        console.log(`📄 Extracted ${text.length} characters`);
        
        // Chunk text
        console.log('✂️ Chunking text...');
        const chunks = chunkText(text, { 
          source: file.originalFilename,
          document_id: file.documentId 
        });
        
        console.log(`📦 Created ${chunks.length} chunks`);
        
        // Generate embeddings
        console.log('🧠 Generating embeddings...');
        const embeddedChunks = await generateEmbeddings(chunks);
        
        console.log(`🎯 Generated ${embeddedChunks.length} embeddings`);
        
        // Insert into vector DB
        console.log('💾 Storing in vector DB...');
        await insertVectors(embeddedChunks);
        
        totalChunks += embeddedChunks.length;
        console.log(`✅ Successfully processed ${file.originalFilename}`);
        
      } catch (error) {
        console.error(`❌ Error processing ${file.originalFilename}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Vector DB Population Complete!`);
    console.log(`📊 Total chunks processed: ${totalChunks}`);
    console.log(`📚 Documents added to vector search`);
    
  } catch (error) {
    console.error('❌ Population error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the population
populateVectorDB();
