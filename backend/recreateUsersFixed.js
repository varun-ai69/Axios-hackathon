const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

async function recreateUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/rag_system');
    console.log('Connected to MongoDB');

    // Delete existing test users
    await User.deleteMany({ 
      email: { $in: ['admin@example.com', 'employee@example.com'] }
    });
    console.log('🗑️ Deleted existing test users');

    // Create admin user (password will be hashed by pre-save hook)
    const admin = new User({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'admin123', // Plain text - will be hashed by model
      role: 'ADMIN',
      department: 'IT',
      isActive: true
    });
    await admin.save();
    console.log('✅ Admin user created: admin@example.com / admin123');

    // Create employee user (password will be hashed by pre-save hook)
    const employee = new User({
      name: 'Test Employee',
      email: 'employee@example.com',
      password: 'emp123', // Plain text - will be hashed by model
      role: 'EMPLOYEE',
      department: 'HR',
      isActive: true
    });
    await employee.save();
    console.log('✅ Employee user created: employee@example.com / emp123');

    // Test login
    console.log('\n🧪 Testing login...');
    const testUser = await User.findOne({ email: 'admin@example.com' }).select('+password');
    const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare('admin123', testUser.password);
    console.log(`🔐 Password match test: ${isMatch ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`📋 Stored hash: ${testUser.password.substring(0, 30)}...`);

    console.log('\n🎯 Test Users Ready:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Employee: employee@example.com / emp123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

recreateUsers();
