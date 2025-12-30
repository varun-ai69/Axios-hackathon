/**
 * Test New File Upload and RAG Integration
 * ----------------------------------------
 * This tests if newly uploaded files are immediately available for RAG queries
 */

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testNewFileUpload() {
  try {
    console.log('🧪 Testing New File Upload + RAG Integration...');
    
    // Step 1: Login as admin
    console.log('\n🔐 Logging in as admin...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Create a test file with unique content
    const testContent = `
WOFO Company Employee Handbook - 2024 Edition

CHAPTER 1: COMPANY CULTURE
At WOFO, we believe in innovation, collaboration, and work-life balance. 
Our core values are: Integrity, Excellence, Teamwork, and Customer Focus.

CHAPTER 2: WORK HOURS AND FLEXIBILITY
Standard work hours are 9:00 AM to 6:00 PM, Monday through Friday.
Flexible working arrangements are available with manager approval.
Remote work policy: Up to 3 days per week remote work is permitted.

CHAPTER 3: BENEFITS AND COMPENSATION
Health Insurance: Comprehensive medical, dental, and vision coverage
401(k): Company matching up to 6% of salary
Paid Time Off: 20 days per year, plus 10 company holidays
Professional Development: $2000 annual budget for courses and certifications

CHAPTER 4: IT AND SECURITY POLICIES
All employees must use company-approved software and devices.
Password requirements: Minimum 12 characters with special characters
Two-factor authentication is required for all systems.
Report security incidents immediately to security@wofocompany.com

CHAPTER 5: COMMUNICATION GUIDELINES
Use Slack for daily communication and Microsoft Teams for meetings.
Email response time: Within 4 business hours
Meeting etiquette: Cameras on, mute when not speaking
Project updates: Weekly status reports due every Friday

This handbook was last updated: December 2024
For questions, contact HR at hr@wofocompany.com
    `;
    
    const testFilePath = './test_employee_handbook.txt';
    fs.writeFileSync(testFilePath, testContent);
    console.log('✅ Created test file with unique content');
    
    // Step 3: Upload the file
    console.log('\n📤 Uploading test file...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testFilePath));
    
    const uploadResponse = await axios.post('http://localhost:3000/api/upload/ingestion', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ File uploaded successfully:', uploadResponse.data);
    
    // Step 4: Wait a moment for processing
    console.log('\n⏳ Waiting for file processing...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 5: Test RAG queries about the new content
    console.log('\n🤖 Testing RAG queries about new content...');
    
    const testQueries = [
      'What are the company core values at WOFO?',
      'What is the remote work policy?',
      'Tell me about the 401k matching',
      'What are the password requirements?',
      'How much PTO do employees get?'
    ];
    
    for (const query of testQueries) {
      console.log(`\n🔍 Query: ${query}`);
      const ragResponse = await axios.post('http://localhost:3000/api/chatbot/query', { query });
      
      console.log('📝 Response:', ragResponse.data.answer.substring(0, 200) + '...');
      console.log('📚 Sources:', ragResponse.data.sources.length);
      console.log('🎯 Context Used:', ragResponse.data.context_used);
    }
    
    // Step 6: Clean up
    fs.unlinkSync(testFilePath);
    console.log('\n🧹 Cleaned up test file');
    
    console.log('\n🎉 New File Upload + RAG Integration Test Complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testNewFileUpload();
