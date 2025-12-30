const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function quickTest() {
  try {
    console.log('🧪 Quick Upload Test...');
    
    // Login
    const login = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = login.data.token;
    console.log('✅ Logged in');
    
    // Create test file
    const testContent = 'WOFO Company Policy Document\n\nThis is a test document about company policies and procedures.\n\nRemote Work Policy:\nEmployees may work remotely up to 3 days per week with manager approval.\n\nBenefits:\n- Health insurance\n- 401k matching\n- 20 days PTO\n\nSecurity:\n- Use strong passwords\n- Report incidents immediately';
    
    fs.writeFileSync('./test_policy.txt', testContent);
    console.log('✅ Created test file');
    
    // Upload file
    const formData = new FormData();
    formData.append('file', fs.createReadStream('./test_policy.txt'));
    
    const upload = await axios.post('http://localhost:3000/api/upload/ingestion', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Upload successful:', upload.data);
    
    // Test RAG query
    const ragResponse = await axios.post('http://localhost:3000/api/chatbot/query', {
      query: 'What is the remote work policy?'
    });
    
    console.log('🤖 RAG Response:', ragResponse.data.answer.substring(0, 200) + '...');
    console.log('📚 Sources:', ragResponse.data.sources.length);
    
    // Cleanup
    fs.unlinkSync('./test_policy.txt');
    console.log('✅ Test complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

quickTest();
