// src/components/Admin/AdminChatbot.jsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRobot, faUser, faSpinner, faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { queryChatbot } from '../../services/api';
import FileUpload from './FileUpload';

const AdminChatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I can help you with information from your uploaded documents. Ask me anything!', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await queryChatbot(input);
      const botMessage = {
        id: Date.now() + 1,
        text: response.answer || 'I found some information for you.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-purple-600/20 border-b border-white/10 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faRobot} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">WOFO AI Assistant</h3>
              <p className="text-gray-300 text-xs">Document-based chatbot</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUpload(!showUpload)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center"
          >
            <FontAwesomeIcon icon={faFileUpload} className="mr-2" />
            {showUpload ? 'Hide Upload' : 'Upload Files'}
          </motion.button>
        </div>

        {/* File Upload Section */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-white/10"
            >
              <div className="p-6">
                <FileUpload />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' ? 'bg-purple-600' : 'bg-slate-700'
                  }`}>
                    <FontAwesomeIcon 
                      icon={message.sender === 'user' ? faUser : faRobot} 
                      className="text-white text-sm"
                    />
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-2xl p-4 ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : message.error
                        ? 'bg-red-500/20 text-red-200 border border-red-500/50'
                        : 'bg-white/10 text-gray-200 border border-white/10'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRobot} className="text-white text-sm" />
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                  <FontAwesomeIcon icon={faSpinner} className="text-purple-400 animate-spin" />
                  <span className="text-gray-300 text-sm ml-2">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="border-t border-white/10 p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your documents..."
              disabled={loading}
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={loading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminChatbot;
