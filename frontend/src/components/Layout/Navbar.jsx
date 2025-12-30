// src/components/Layout/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faSignOutAlt, 
  faUser, 
  faCog,
  faBell,
  faSearch,
  faBars,
  faTimes,
  faHome,
  faChartBar,
  faFolderOpen
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    addToast('Logged out successfully', 'success');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Navigate to search with query
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard', { 
        state: { searchQuery: searchQuery.trim() } 
      });
      setSearchQuery('');
    }
  };

  const notifications = [
    { id: 1, title: 'New document uploaded', message: 'Company Policy.pdf has been added', time: '5 min ago', read: false },
    { id: 2, title: 'System update', message: 'Search index updated successfully', time: '1 hour ago', read: false },
    { id: 3, title: 'Maintenance scheduled', message: 'System maintenance on Sunday 2AM', time: '2 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigationItems = [
    { icon: faHome, label: 'Dashboard', href: user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard' },
    { icon: faSearch, label: 'Search', href: '#' },
    { icon: faFolderOpen, label: 'Files', href: '#' },
    { icon: faChartBar, label: 'Analytics', href: '#' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-slate-900/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 min-w-0">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faRobot} className="text-white text-xl" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-white font-bold text-xl">WOFO AI</h1>
                  <p className="text-gray-400 text-xs">Intelligent Document Assistant</p>
                </div>
              </motion.div>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8 min-w-0">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                placeholder="Search documents..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden xl:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link key={item.label} to={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  <FontAwesomeIcon icon={item.icon} className="text-sm" />
                  <span className="text-sm">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-gray-300 hover:text-white transition-colors p-2"
              >
                <FontAwesomeIcon icon={faBell} className="text-xl" />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  />
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-slate-800 border border-white/10 rounded-lg shadow-xl z-50"
                >
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer ${
                          !notification.read ? 'bg-purple-500/10' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{notification.title}</h4>
                            <p className="text-gray-400 text-xs mt-1 truncate">{notification.message}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1 flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* User Info & Settings */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="hidden sm:block text-right min-w-0">
                <div className="flex items-center text-white font-medium">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-400" />
                  <span className="truncate">{user?.name || 'User'}</span>
                </div>
                <p className="text-gray-400 text-xs capitalize">{user?.role || 'Guest'}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-300 hover:text-white transition-colors p-2"
                >
                  <FontAwesomeIcon icon={faCog} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-3 py-2 rounded-lg font-medium transition-colors flex items-center whitespace-nowrap"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden text-gray-300 hover:text-white p-2"
            >
              <FontAwesomeIcon icon={showMobileMenu ? faTimes : faBars} className="text-xl" />
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 py-4"
          >
            <div className="space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearch}
                  placeholder="Search documents..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link key={item.label} to={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-3 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5"
                    >
                      <FontAwesomeIcon icon={item.icon} />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
