// src/components/Shared/LoadingSpinner.jsx
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <FontAwesomeIcon 
        icon={faSpinner} 
        className="text-purple-500 text-5xl mb-4 animate-spin" 
      />
      <p className="text-gray-300 text-lg">{message}</p>
    </motion.div>
  );
};

export default LoadingSpinner;
