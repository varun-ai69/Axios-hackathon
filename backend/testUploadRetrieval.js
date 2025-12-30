const axios = require('axios');

async function testUploadRetrieval() {
  try {
    const login = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'employee@example.com',
      password: 'emp123'
    });
    const token = login.data.token;
    
    const response = await axios.post('http://localhost:3000/api/upload/retrieval', 
      { question: 'What is our remote work policy?' },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    console.log('✅ /api/upload/retrieval works:', response.data.answer.substring(0, 100) + '...');
    console.log('📚 Sources:', response.data.sources.length);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testUploadRetrieval();
