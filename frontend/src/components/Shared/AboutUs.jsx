// src/components/Shared/AboutUs.jsx
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faShieldAlt, faLightbulb, faUsers } from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  const features = [
    {
      icon: faRobot,
      title: 'AI-Powered Intelligence',
      description: 'Advanced natural language processing to understand and respond to your queries with precision.',
    },
    {
      icon: faShieldAlt,
      title: 'Secure & Private',
      description: 'Your documents and conversations are encrypted and secure. We prioritize your data privacy.',
    },
    {
      icon: faLightbulb,
      title: 'Smart Document Analysis',
      description: 'Automatically extracts insights from PDFs, Word docs, Excel files, and text documents.',
    },
    {
      icon: faUsers,
      title: 'Team Collaboration',
      description: 'Seamless collaboration between admins and employees with role-based access control.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          className="text-5xl font-bold text-white mb-4"
        >
          Welcome to WOFO AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-lg max-w-2xl mx-auto"
        >
          Your intelligent document assistant that transforms how you interact with workplace information.
        </motion.p>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
        <p className="text-gray-300 leading-relaxed">
          WOFO AI revolutionizes workplace efficiency by providing instant, accurate answers from your organization's 
          documents. We leverage cutting-edge artificial intelligence to help teams find information faster, 
          make better decisions, and focus on what matters most.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
          >
            <div className="w-14 h-14 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <FontAwesomeIcon icon={feature.icon} className="text-purple-400 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Upload Documents', desc: 'Admins upload company documents, policies, and resources' },
            { step: '2', title: 'AI Processing', desc: 'Our AI analyzes and indexes all content for instant retrieval' },
            { step: '3', title: 'Ask Questions', desc: 'Employees get instant, accurate answers from the knowledge base' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h4 className="text-white font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-300 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutUs;
