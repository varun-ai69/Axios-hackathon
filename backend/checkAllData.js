const mongoose = require('mongoose');
const User = require('./models/user');
const DocumentMetadata = require('./models/documentMetadata');
const StoredFiles = require('./models/storedFiles');
const UserAnalytics = require('./models/userAnalytics');
const QueryLogs = require('./models/queryLogs');
require('dotenv').config();

async function checkAllData() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/rag_system');
    console.log('📊 Connected to MongoDB\n');

    // Check Users
    const users = await User.find({});
    console.log(`👥 Users: ${users.length}`);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });

    // Check Stored Files
    const files = await StoredFiles.find({});
    console.log(`\n📁 Stored Files: ${files.length}`);
    files.forEach(file => {
      console.log(`  - ${file.originalFilename} - ${file.fileId} - ${file.ingestionStatus}`);
    });

    // Check Document Metadata
    const docs = await DocumentMetadata.find({});
    console.log(`\n📄 Document Metadata: ${docs.length}`);
    docs.forEach(doc => {
      const chunkCount = doc.chunks ? doc.chunks.length : 0;
      console.log(`  - ${doc.title || doc.documentId} - ${doc.documentType} - ${chunkCount} chunks`);
    });

    // Check User Analytics
    const analytics = await UserAnalytics.find({});
    console.log(`\n📈 User Analytics: ${analytics.length}`);
    analytics.forEach(analytic => {
      console.log(`  - ${analytic.userId} - ${analytic.queryCount} queries`);
    });

    // Check Query Logs
    const queries = await QueryLogs.find({}).sort({ timestamp: -1 }).limit(5);
    console.log(`\n🔍 Recent Queries: ${queries.length}`);
    queries.forEach(query => {
      console.log(`  - ${query.userId}: ${query.query.substring(0, 50)}...`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkAllData();
