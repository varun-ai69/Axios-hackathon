const axios = require('axios');

async function testSearchRetrieval() {
  try {
    console.log('🔍 Testing /api/search/retrieval...');
    
    // Login first
    const login = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'employee@example.com',
      password: 'emp123'
    });
    
    const token = login.data.token;
    console.log('✅ Logged in');
    
    // Test search/retrieval
    const searchResponse = await axios.post('http://localhost:3000/api/search/retrieval', 
      { question: 'What is the remote work policy?' },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    console.log('✅ Search/Retrieval Response:', searchResponse.data.answer.substring(0, 200) + '...');
    console.log('📚 Sources:', searchResponse.data.sources.length);
    console.log('🎯 Context Used:', searchResponse.data.context_used);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testSearchRetrieval();
