// src/components/Layout/Footer.jsx
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faRobot } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-slate-900/50 backdrop-blur-lg border-t border-white/10 py-6 mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <FontAwesomeIcon icon={faRobot} className="text-purple-500 text-xl" />
            <span className="text-gray-300 text-sm">
              © {new Date().getFullYear()} WOFO AI. All rights reserved.
            </span>
          </div>
          
          <div className="text-gray-400 text-sm flex items-center">
            Made with{' '}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="mx-1"
            >
              <FontAwesomeIcon icon={faHeart} className="text-red-500" />
            </motion.span>
            {' '}for workplace efficiency
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
