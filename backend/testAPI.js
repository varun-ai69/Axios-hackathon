const axios = require('axios');

async function testAPIs() {
  const baseURL = 'http://localhost:3000/api';
  
  try {
    // Test login
    console.log('🔐 Testing login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    // Test users endpoint
    console.log('👥 Testing /api/users...');
    try {
      const usersResponse = await axios.get(`${baseURL}/users`, config);
      console.log(`✅ Users endpoint working: ${usersResponse.data.length} users found`);
    } catch (error) {
      console.log('❌ Users endpoint failed:', error.response?.data || error.message);
    }
    
    // Test files endpoint
    console.log('📁 Testing /api/files/...');
    try {
      const filesResponse = await axios.get(`${baseURL}/files/`, config);
      console.log(`✅ Files endpoint working: ${filesResponse.data.length} files found`);
    } catch (error) {
      console.log('❌ Files endpoint failed:', error.response?.data || error.message);
    }
    
    // Test file stats endpoint
    console.log('📊 Testing /api/files/stats/overview...');
    try {
      const statsResponse = await axios.get(`${baseURL}/files/stats/overview`, config);
      console.log('✅ File stats endpoint working:', statsResponse.data);
    } catch (error) {
      console.log('❌ File stats endpoint failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

console.log('🧪 Testing API endpoints...');
testAPIs();
