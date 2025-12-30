const axios = require('axios');

async function simpleTest() {
  try {
    // Test login
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful');
    console.log('Token:', loginResponse.data.token);
    
    const token = loginResponse.data.token;
    
    // Test users endpoint
    try {
      const usersResponse = await axios.get('http://localhost:3000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Users working:', usersResponse.data.length, 'users');
    } catch (error) {
      console.log('❌ Users failed:', error.response?.data);
    }
    
    // Test files endpoint
    try {
      const filesResponse = await axios.get('http://localhost:3000/api/files/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Files working:', filesResponse.data.length, 'files');
    } catch (error) {
      console.log('❌ Files failed:', error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data);
  }
}

simpleTest();
