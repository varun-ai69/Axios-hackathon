// src/components/Layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faRobot} className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">WOFO AI</h1>
                <p className="text-gray-400 text-xs">Document Assistant</p>
              </div>
            </motion.div>
          </Link>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center text-white font-semibold">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-400" />
                  {user.name}
                </div>
                <p className="text-gray-400 text-xs capitalize">{user.role}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
