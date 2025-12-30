const axios = require('axios');

async function testChatbot() {
  try {
    console.log('🤖 Testing chatbot status...');
    const statusResponse = await axios.get('http://localhost:3000/api/chatbot/status');
    console.log('✅ Status:', statusResponse.data);
    
    console.log('\n🤖 Testing chatbot query...');
    const queryResponse = await axios.post('http://localhost:3000/api/chatbot/query', {
      query: 'What is the remote work policy?'
    });
    console.log('✅ Query Response:', queryResponse.data);
    
    console.log('\n🤖 Testing greeting...');
    const greetingResponse = await axios.post('http://localhost:3000/api/chatbot/query', {
      query: 'hello'
    });
    console.log('✅ Greeting Response:', greetingResponse.data);
    
  } catch (error) {
    console.error('❌ Chatbot test failed:', error.response?.data || error.message);
  }
}

testChatbot();
