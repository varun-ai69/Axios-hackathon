const axios = require('axios');

async function debugSearch() {
  try {
    console.log('🔍 Debug Search/Retrieval...');
    
    // Login first
    const login = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'employee@example.com',
      password: 'emp123'
    });
    
    const token = login.data.token;
    console.log('✅ Logged in');
    
    // Test search/retrieval with detailed error handling
    try {
      const searchResponse = await axios.post('http://localhost:3000/api/search/retrieval', 
        { question: 'What is the remote work policy?' },
        { 
          headers: { 'Authorization': `Bearer ${token}` },
          timeout: 10000
        }
      );
      
      console.log('✅ Search/Retrieval Response:', searchResponse.data);
      
    } catch (error) {
      console.error('❌ Search Error Details:');
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      console.error('Message:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Login Error:', error.response?.data || error.message);
  }
}

debugSearch();
