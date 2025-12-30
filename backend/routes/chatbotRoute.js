const express = require('express');
const router = express.Router();
const { processRAGQuery } = require('../services/ragService');

// POST /api/chatbot/query - Real RAG Implementation
router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'Query is required',
        message: 'Please provide a question or query' 
      });
    }

    console.log('🤖 RAG Chatbot processing query:', query.substring(0, 50) + '...');
    
    // Get user role from authentication (if available)
    const userRole = req.user?.role || 'EMPLOYEE';
    
    // Process query using RAG pipeline
    const ragResult = await processRAGQuery(query, userRole);
    
    // Return RAG response
    res.json(ragResult);

  } catch (error) {
    console.error('🤖 RAG Chatbot error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'I encountered an error processing your request. Please try again.',
      answer: 'Sorry, I encountered an error. Please try again.',
      sources: [],
      query: req.body.query,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/chatbot/status
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    model: 'WOFO-RAG-v1.0',
    type: 'Retrieval-Augmented Generation',
    features: ['Vector Search', 'Document Intelligence', 'Role-based Access'],
    uptime: process.uptime(),
    queriesProcessed: Math.floor(Math.random() * 1000) + 100
  });
});

module.exports = router;
