const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function debugTest() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');
    
    // Test User model directly
    const User = require('./models/User');
    const users = await User.find({}).select('-password').lean();
    console.log('✅ Users query successful:', users.length, 'users');
    
    // Test StoredFiles model directly
    const StoredFiles = require('./models/storedFiles');
    const files = await StoredFiles.find({}).lean();
    console.log('✅ Files query successful:', files.length, 'files');
    
    // Test a sample user
    if (users.length > 0) {
      console.log('Sample user:', users[0]);
    }
    
    // Test a sample file
    if (files.length > 0) {
      console.log('Sample file:', files[0]);
    }
    
  } catch (error) {
    console.error('❌ Debug test failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

debugTest();
