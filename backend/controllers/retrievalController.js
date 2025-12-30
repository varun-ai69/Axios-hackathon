/**
 * Retrieval & Generation Controller (RAG System – Query Pipeline)
 *
 * This controller represents the second stage of the RAG architecture.
 * It is responsible for handling user queries and generating intelligent,
 * context-aware responses using previously ingested knowledge.
 *
 * Core responsibilities:
 * - Accepts a user query (question or prompt)
 * - Converts the query into a vector embedding
 * - Performs similarity search on the vector database
 * - Retrieves the most relevant document chunks
 * - Constructs a contextual prompt using retrieved knowledge
 * - Sends the context + query to an LLM for answer generation
 * - Returns a final, grounded response to the user
 *
 * This module does NOT store or modify documents.
 * It strictly operates on already indexed vector data.
 *
 * In short:
 * Query → Embed → Retrieve → Generate → Respond
 */

const { processRAGQuery } = require("../services/ragService");

exports.askQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        console.log('🔍 Search/Retrieval query:', question);
        
        // Use our existing RAG service
        const userRole = req.user?.role || 'EMPLOYEE';
        const ragResult = await processRAGQuery(question, userRole);
        
        // Format response to match expected structure
        res.json({
            question,
            answer: ragResult.answer,
            sources: ragResult.sources.map((source, index) => ({
                chunk_id: `chunk_${index}`,
                source: source.title,
                relevance: source.relevance,
                snippet: source.snippet
            })),
            context_used: ragResult.context_used,
            model: ragResult.model,
            timestamp: ragResult.timestamp
        });
        
    } catch (err) {
        console.error("🔍 Search/Retrieval ERROR:", err);
        res.status(500).json({ 
            error: "Failed to generate answer",
            details: err.message 
        });
    }
};
