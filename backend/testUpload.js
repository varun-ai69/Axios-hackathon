const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

// Create a simple test file
const testFilePath = path.join(__dirname, 'test-document.txt');
const testContent = `
This is a test document for file upload functionality.

Company Policy Document
=======================

1. Remote Work Policy
Employees can work remotely up to 3 days per week with manager approval.

2. Benefits Package
- Health insurance
- Dental coverage
- 401(k) matching
- Paid time off

3. IT Support
Contact helpdesk at ext. 5555 for technical issues.

This document contains enough text to test the ingestion pipeline.
`;

// Write test file
fs.writeFileSync(testFilePath, testContent);
console.log('✅ Test file created:', testFilePath);

// Test upload function
async function testFileUpload() {
  try {
    // First login to get token
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Create form data for file upload
    const form = new FormData();
    form.append('file', fs.createReadStream(testFilePath));
    
    console.log('📁 Uploading file...');
    const uploadResponse = await axios.post(
      'http://localhost:3000/api/upload/ingestion',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('✅ Upload successful:', uploadResponse.data);
    
  } catch (error) {
    console.error('❌ Upload failed:', error.response?.data || error.message);
  } finally {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
      console.log('🧹 Test file cleaned up');
    }
  }
}

// Run test if server is running
console.log('🚀 Testing file upload functionality...');
testFileUpload();
