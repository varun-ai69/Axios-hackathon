const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const StoredFiles = require('./models/storedFiles');
const DocumentMetadata = require('./models/documentMetadata');
const UserAnalytics = require('./models/userAnalytics');
const QueryLogs = require('./models/queryLogs');
require('dotenv').config();

async function populateTestData() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/rag_system');
    console.log('📊 Connected to MongoDB - Populating test data...\n');

    // Add more users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const additionalUsers = [
      {
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        password: hashedPassword,
        role: 'EMPLOYEE',
        department: 'Marketing',
        isActive: true
      },
      {
        name: 'Mike Chen',
        email: 'mike@company.com',
        password: hashedPassword,
        role: 'EMPLOYEE',
        department: 'Engineering',
        isActive: true
      },
      {
        name: 'Emily Davis',
        email: 'emily@company.com',
        password: hashedPassword,
        role: 'ADMIN',
        department: 'HR',
        isActive: true
      }
    ];

    for (const userData of additionalUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Created user: ${userData.name}`);
      }
    }

    // Add more files
    const additionalFiles = [
      {
        fileId: `file_${Date.now()}_marketing_guide`,
        originalFilename: 'Marketing Strategy Guide.pdf',
        storedFilename: `stored_${Date.now()}_marketing.pdf`,
        filePath: '/uploads/marketing_strategy.pdf',
        fileSize: 2048576, // 2MB
        mimeType: 'application/pdf',
        documentId: `doc_${Date.now()}_marketing`,
        uploadedBy: 'admin@example.com',
        uploadedByRole: 'ADMIN',
        status: 'ACTIVE',
        ingestionStatus: 'COMPLETED',
        chunksGenerated: 15,
        embeddingGenerated: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        processedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        fileId: `file_${Date.now()}_tech_specs`,
        originalFilename: 'Technical Specifications.docx',
        storedFilename: `stored_${Date.now()}_tech.docx`,
        filePath: '/uploads/tech_specs.docx',
        fileSize: 1536000, // 1.5MB
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        documentId: `doc_${Date.now()}_tech`,
        uploadedBy: 'admin@example.com',
        uploadedByRole: 'ADMIN',
        status: 'ACTIVE',
        ingestionStatus: 'COMPLETED',
        chunksGenerated: 12,
        embeddingGenerated: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        processedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        fileId: `file_${Date.now()}_hr_policy`,
        originalFilename: 'HR Policy Manual.pdf',
        storedFilename: `stored_${Date.now()}_hr.pdf`,
        filePath: '/uploads/hr_policy.pdf',
        fileSize: 3072000, // 3MB
        mimeType: 'application/pdf',
        documentId: `doc_${Date.now()}_hr`,
        uploadedBy: 'emily@company.com',
        uploadedByRole: 'ADMIN',
        status: 'ACTIVE',
        ingestionStatus: 'PROCESSING',
        chunksGenerated: 8,
        embeddingGenerated: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        fileId: `file_${Date.now()}_financial_report`,
        originalFilename: 'Q4 Financial Report.xlsx',
        storedFilename: `stored_${Date.now()}_financial.xlsx`,
        filePath: '/uploads/financial_report.xlsx',
        fileSize: 1024000, // 1MB
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        documentId: `doc_${Date.now()}_financial`,
        uploadedBy: 'admin@example.com',
        uploadedByRole: 'ADMIN',
        status: 'ACTIVE',
        ingestionStatus: 'COMPLETED',
        chunksGenerated: 10,
        embeddingGenerated: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        processedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];

    for (const fileData of additionalFiles) {
      const existingFile = await StoredFiles.findOne({ fileId: fileData.fileId });
      if (!existingFile) {
        await StoredFiles.create(fileData);
        console.log(`✅ Created file: ${fileData.originalFilename}`);
      }
    }

    // Add document metadata
    const documents = await StoredFiles.find({});
    for (const file of documents) {
      const existingDoc = await DocumentMetadata.findOne({ documentId: file.documentId });
      if (!existingDoc) {
        const docData = {
          documentId: file.documentId,
          filename: file.originalFilename,
          fileType: file.mimeType.includes('pdf') ? 'PDF' : 
                   file.mimeType.includes('docx') ? 'DOCX' : 
                   file.mimeType.includes('xlsx') ? 'XLSX' : 'TXT',
          documentType: file.originalFilename.includes('Policy') ? 'POLICY' :
                        file.originalFilename.includes('Manual') ? 'MANUAL' :
                        file.originalFilename.includes('Report') ? 'REPORT' :
                        file.originalFilename.includes('Guide') ? 'GUIDELINE' : 'PROCEDURE',
          department: file.originalFilename.includes('Marketing') ? 'MARKETING' :
                     file.originalFilename.includes('Technical') ? 'IT' :
                     file.originalFilename.includes('HR') ? 'HR' :
                     file.originalFilename.includes('Financial') ? 'FINANCE' : 'OPERATIONS',
          version: '1.0',
          uploadedByRole: file.uploadedByRole,
          allowedRoles: ['ADMIN', 'EMPLOYEE'],
          createdAt: file.createdAt
        };
        await DocumentMetadata.create(docData);
        console.log(`✅ Created metadata for: ${file.originalFilename}`);
      }
    }

    // Add user analytics
    const users = await User.find({});
    for (const user of users) {
      const existingAnalytics = await UserAnalytics.findOne({ userId: user._id.toString() });
      if (!existingAnalytics) {
        const analyticsData = {
          userId: user._id.toString(),
          role: user.role,
          department: user.department || 'IT',
          queriesCount: Math.floor(Math.random() * 50) + 10,
          lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        };
        await UserAnalytics.create(analyticsData);
        console.log(`✅ Created analytics for: ${user.name}`);
      }
    }

    // Add query logs
    const sampleQueries = [
      'What is the company policy on remote work?',
      'Show me the marketing strategy for Q1',
      'Technical specifications for the new product',
      'HR guidelines for employee benefits',
      'Financial report for last quarter',
      'How to request vacation days?',
      'Company organizational structure',
      'Project management best practices',
      'IT security policies',
      'Employee onboarding process'
    ];

    for (let i = 0; i < 25; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const queryData = {
        queryText: sampleQueries[Math.floor(Math.random() * sampleQueries.length)],
        userRole: randomUser.role,
        retrievedChunksCount: Math.floor(Math.random() * 10) + 5,
        filteredChunksCount: Math.floor(Math.random() * 5) + 1,
        confidenceScore: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
        responseTimeMs: Math.floor(Math.random() * 2000) + 500, // 500ms to 2500ms
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      };
      await QueryLogs.create(queryData);
    }
    console.log(`✅ Created 25 sample query logs`);

    // Summary
    const finalUsers = await User.countDocuments();
    const finalFiles = await StoredFiles.countDocuments();
    const finalDocs = await DocumentMetadata.countDocuments();
    const finalAnalytics = await UserAnalytics.countDocuments();
    const finalQueries = await QueryLogs.countDocuments();

    console.log('\n🎉 Test Data Population Complete!');
    console.log(`👥 Users: ${finalUsers}`);
    console.log(`📁 Files: ${finalFiles}`);
    console.log(`📄 Documents: ${finalDocs}`);
    console.log(`📈 Analytics: ${finalAnalytics}`);
    console.log(`🔍 Query Logs: ${finalQueries}`);

  } catch (error) {
    console.error('❌ Error populating data:', error);
  } finally {
    await mongoose.disconnect();
  }
}

populateTestData();
