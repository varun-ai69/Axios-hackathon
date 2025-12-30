const axios = require('axios');

async function testChatbot() {
  try {
    const login = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'employee@example.com',
      password: 'emp123'
    });
    const token = login.data.token;
    
    const chatbotResponse = await axios.post('http://localhost:3000/api/chatbot/query', 
      { query: 'What is the remote work policy?' },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    console.log('✅ Chatbot works:', chatbotResponse.data.answer.substring(0, 100) + '...');
    console.log('📚 Sources:', chatbotResponse.data.sources.length);
    
  } catch (error) {
    console.error('❌ Chatbot error:', error.response?.data || error.message);
  }
}

testChatbot();
