// src/pages/EmployeeDashboard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faComments } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Layout/Navbar';
import AboutUs from '../components/Shared/AboutUs';
import EmployeeChatbot from '../components/Employee/EmployeeChatbot';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: 'About Us', icon: faInfoCircle },
    { id: 'chatbot', label: 'Chatbot', icon: faComments },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutUs />;
      case 'chatbot':
        return <EmployeeChatbot />;
      default:
        return <AboutUs />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-2 border border-white/10 mb-8 flex space-x-2"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
