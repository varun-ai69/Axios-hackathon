const axios = require('axios');

async function testFrontendAPI() {
  try {
    // First login to get token (simulate frontend)
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'employee@example.com',
      password: 'emp123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Test chatbot with authentication (like frontend would do)
    console.log('🤖 Testing chatbot with auth...');
    const chatbotResponse = await axios.post(
      'http://localhost:3000/api/chatbot/query',
      { query: 'What are the company benefits?' },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Chatbot response:', chatbotResponse.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testFrontendAPI();
