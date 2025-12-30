const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
require('dotenv').config();

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/rag_system');
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'System Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        department: 'IT',
        isActive: true
      });
      await admin.save();
      console.log('✅ Admin user created: admin@example.com / admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // Create employee user
    const employeeExists = await User.findOne({ email: 'employee@example.com' });
    if (!employeeExists) {
      const hashedPassword = await bcrypt.hash('emp123', 10);
      const employee = new User({
        name: 'Test Employee',
        email: 'employee@example.com',
        password: hashedPassword,
        role: 'EMPLOYEE',
        department: 'HR',
        isActive: true
      });
      await employee.save();
      console.log('✅ Employee user created: employee@example.com / emp123');
    } else {
      console.log('ℹ️ Employee user already exists');
    }

    console.log('\n🎯 Test Users Ready:');
    console.log('Admin: admin@example.com / admin123');
    console.log('Employee: employee@example.com / emp123');

  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUsers();
