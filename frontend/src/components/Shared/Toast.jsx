// src/components/Shared/Toast.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const icons = {
    success: faCheckCircle,
    error: faExclamationCircle,
    info: faInfoCircle,
  };

  const colors = {
    success: 'bg-green-500/20 border-green-500/50 text-green-200',
    error: 'bg-red-500/20 border-red-500/50 text-red-200',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-200',
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg border flex items-center space-x-3 ${colors[type]} backdrop-blur-lg shadow-2xl max-w-md`}
    >
      <FontAwesomeIcon icon={icons[type]} className="text-xl" />
      <p className="flex-1">{message}</p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="text-current hover:opacity-70 transition-opacity"
      >
        <FontAwesomeIcon icon={faTimes} />
      </motion.button>
    </motion.div>
  );
};

export default Toast;
