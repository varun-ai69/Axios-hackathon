const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
require('dotenv').config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/rag_system');
    console.log('Connected to MongoDB');

    const email = 'admin@example.com';
    const password = 'admin123';

    console.log(`Testing login for: ${email}`);
    
    // Find user
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`✅ User found: ${user.name}`);
    console.log(`📋 Stored password hash: ${user.password.substring(0, 30)}...`);

    // Test password comparison
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`🔐 Password match: ${isMatch}`);

    if (isMatch) {
      console.log('🎉 Login should work!');
    } else {
      console.log('❌ Password comparison failed');
      
      // Test creating a new hash
      const newHash = await bcrypt.hash(password, 10);
      console.log(`🔄 New hash would be: ${newHash.substring(0, 30)}...`);
      
      // Update user password
      user.password = newHash;
      await user.save();
      console.log('✅ Updated user password with new hash');
      
      // Test again
      const testAgain = await bcrypt.compare(password, user.password);
      console.log(`🔐 New password match: ${testAgain}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testLogin();
