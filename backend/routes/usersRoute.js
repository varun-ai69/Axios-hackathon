const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

// Simple test endpoint
router.get('/test', (req, res) => {
  console.log('🧪 Users test endpoint called');
  res.json({ message: 'Users route is working!' });
});

// GET /api/users - Get all users (admin only)
router.get('/', authMiddleware, role(['ADMIN']), async (req, res) => {
  try {
    console.log('👥 Users endpoint called');
    console.log('👥 User from auth:', req.user);
    
    // Use mongoose.model to get existing User model
    const User = mongoose.model('User');
    console.log('👥 About to query users...');
    const users = await User.find({}).select('-password').lean(); // Exclude password field
    console.log('👥 Users query successful:', users.length);
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

module.exports = router;
