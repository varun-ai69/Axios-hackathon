/**
 * RAG (Retrieval-Augmented Generation) Service
 * -------------------------------------------
 * Combines vector search with AI to provide intelligent responses
 */

const { embedQuery } = require('./embeddingService');
const { searchVectors } = require('./vectorDB');

/**
 * Search relevant documents using vector embeddings
 * @param {string} query - User query
 * @param {string} userRole - User role for filtering
 * @returns {Array} Relevant document chunks
 */
async function searchRelevantDocuments(query, userRole = 'EMPLOYEE') {
  try {
    console.log('🔍 Searching documents for:', query);
    
    // Generate embedding for the query
    const queryEmbedding = await embedQuery(query);
    console.log('✅ Query embedding generated');
    
    // Search vector database
    const searchResults = await searchVectors(queryEmbedding, 5);
    console.log(`📚 Found ${searchResults.length} relevant chunks`);
    
    // Format results for AI
    const relevantDocs = searchResults.map(result => ({
      text: result.payload.text,
      source: result.payload.source,
      score: result.score,
      chunk_index: result.payload.chunk_index,
      document_id: result.payload.document_id
    }));
    
    return relevantDocs;
    
  } catch (error) {
    console.error('❌ Document search error:', error);
    return [];
  }
}

/**
 * Generate intelligent response using retrieved documents
 * @param {string} query - User query
 * @param {Array} context - Retrieved document chunks
 * @param {string} userRole - User role
 * @returns {string} AI-generated response
 */
async function generateIntelligentResponse(query, context, userRole = 'EMPLOYEE') {
  try {
    console.log('🧠 Generating AI response...');
    
    const lowerQuery = query.toLowerCase().trim();
    
    // Handle common interactions first (no need for document search)
    if (lowerQuery === 'hello' || lowerQuery === 'hi' || lowerQuery === 'hey') {
      return `Hello! I'm your WOFO AI Assistant. I can help you find information from our company documents. 

I have access to ${context.length > 0 ? 'our document database' : 'company policies and procedures'} and can answer questions about:
• Company policies and procedures
• Benefits and HR information  
• IT support and technical help
• Remote work guidelines
• And much more!

What would you like to know?`;
    }
    
    // If no context found, provide helpful fallback
    if (context.length === 0) {
      return `I couldn't find specific information about "${query}" in our company documents. 

However, I can suggest:
• Check the Employee Handbook for general policies
• Contact HR at hr@company.com for specific questions
• Use the search feature to look for relevant documents
• Ask me about remote work, benefits, or IT support for common topics

Would you like me to help you with anything else?`;
    }
    
    // Build context string
    const contextText = context.map((doc, index) => 
      `Document ${index + 1} (${doc.source}):\n${doc.text}\n`
    ).join('\n');
    
    // Create intelligent prompt
    const prompt = `You are a helpful company AI assistant. Answer the user's question based ONLY on the provided document context.

USER QUESTION: ${query}
USER ROLE: ${userRole}

RELEVANT DOCUMENT CONTEXT:
${contextText}

INSTRUCTIONS:
1. Answer the question using only the provided context
2. If the context doesn't contain the answer, say "I don't have enough information"
3. Be helpful, professional, and concise
4. Mention the source documents when relevant
5. If multiple documents apply, synthesize the information

ANSWER:`;

    // For now, use a smart rule-based approach (can be replaced with OpenAI later)
    const response = generateRuleBasedResponse(query, context);
    
    console.log('✅ AI response generated');
    return response;
    
  } catch (error) {
    console.error('❌ Response generation error:', error);
    return 'I encountered an error generating a response. Please try again.';
  }
}

/**
 * Rule-based response generation (can be enhanced with AI later)
 * @param {string} query - User query
 * @param {Array} context - Retrieved documents
 * @returns {string} Generated response
 */
function generateRuleBasedResponse(query, context) {
  const lowerQuery = query.toLowerCase();
  
  // Extract relevant information from context
  const relevantText = context.map(doc => doc.text).join(' ').substring(0, 500);
  
  // Smart response patterns based on query type
  if (lowerQuery.includes('what') && lowerQuery.includes('about')) {
    return `Based on our company documents: ${relevantText.substring(0, 300)}...

This information comes from our internal documentation. The documents contain company policies, guidelines, and procedures that you should be aware of.`;
  }
  
  if (lowerQuery.includes('responsib')) {
    return `According to our company documents: ${relevantText.substring(0, 300)}...

These are your responsibilities as outlined in our company policies. Please make sure to follow these guidelines.`;
  }
  
  if (lowerQuery.includes('security') || lowerQuery.includes('virus') || lowerQuery.includes('malware')) {
    return `Based on our security documentation: ${relevantText.substring(0, 300)}...

This is part of our company's security policy to protect our systems and data. Please follow these security guidelines carefully.`;
  }
  
  if (lowerQuery.includes('content') || lowerQuery.includes('post') || lowerQuery.includes('upload')) {
    return `According to our content policies: ${relevantText.substring(0, 300)}...

These guidelines apply to any content you post or upload to our systems. Please ensure compliance with these policies.`;
  }
  
  // Generic intelligent response for other queries
  return `Based on the company documents I found: ${relevantText.substring(0, 300)}...

This information comes from our internal documentation. For more details, please refer to the specific source documents mentioned or ask me a more specific question.`;
}

/**
 * Complete RAG pipeline
 * @param {string} query - User query
 * @param {string} userRole - User role
 * @returns {Object} Complete response with sources
 */
async function processRAGQuery(query, userRole = 'EMPLOYEE') {
  try {
    console.log('🚀 Starting RAG pipeline for:', query);
    
    const lowerQuery = query.toLowerCase().trim();
    
    // Handle common interactions first (no need for document search)
    if (lowerQuery === 'hello' || lowerQuery === 'hi' || lowerQuery === 'hey') {
      const greetingResponse = `Hello! I'm your WOFO AI Assistant. I can help you find information from our company documents. 

I have access to our document database and can answer questions about:
• Company policies and procedures
• Benefits and HR information  
• IT support and technical help
• Remote work guidelines
• Security policies
• And much more!

What would you like to know?`;
      
      return {
        success: true,
        answer: greetingResponse,
        sources: [],
        query,
        timestamp: new Date().toISOString(),
        context_used: false,
        model: 'WOFO-RAG-v1.0',
        response_type: 'greeting'
      };
    }
    
    // Step 1: Search relevant documents
    const relevantDocs = await searchRelevantDocuments(query, userRole);
    
    // Step 2: Generate intelligent response
    const answer = await generateIntelligentResponse(query, relevantDocs, userRole);
    
    // Step 3: Format sources
    const sources = relevantDocs.map(doc => ({
      title: doc.source,
      relevance: Math.round(doc.score * 100),
      snippet: doc.text.substring(0, 100) + '...'
    }));
    
    const result = {
      success: true,
      answer,
      sources,
      query,
      timestamp: new Date().toISOString(),
      context_used: relevantDocs.length > 0,
      model: 'WOFO-RAG-v1.0',
      response_type: 'rag'
    };
    
    console.log('✅ RAG pipeline completed successfully');
    return result;
    
  } catch (error) {
    console.error('❌ RAG pipeline error:', error);
    return {
      success: false,
      error: 'Failed to process query',
      answer: 'I encountered an error processing your request. Please try again.',
      sources: [],
      query,
      timestamp: new Date().toISOString(),
      context_used: false,
      model: 'WOFO-RAG-v1.0'
    };
  }
}

module.exports = {
  searchRelevantDocuments,
  generateIntelligentResponse,
  processRAGQuery
};
