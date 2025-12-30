// src/pages/EmployeeDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch,
  faFolderOpen,
  faDownload,
  faEye,
  faChartBar,
  faClock,
  faHistory,
  faStar,
  faFileAlt,
  faComments,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Layout/Navbar';
import EmployeeChatbot from '../components/Employee/EmployeeChatbot';
import { apiEndpoints } from '../services/api';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { addToast } = useToast();
  const { user } = useAuth();

  const tabs = [
    { id: 'search', label: 'Search', icon: faSearch },
    { id: 'files', label: 'My Files', icon: faFolderOpen },
    { id: 'analytics', label: 'Analytics', icon: faChartBar },
    { id: 'chatbot', label: 'Assistant', icon: faComments },
  ];

  const loadRecentFiles = useCallback(async () => {
    setLoading(true);
    try {
      // Mock data for recent files accessible to employee
      const mockFiles = [
        { id: 1, name: 'Company Policy.pdf', size: '2.4 MB', type: 'PDF', uploadedAt: '2024-01-15', accessedAt: '2024-01-20' },
        { id: 2, name: 'Employee Handbook.docx', size: '1.8 MB', type: 'DOCX', uploadedAt: '2024-01-10', accessedAt: '2024-01-19' },
        { id: 3, name: 'Training Materials.pdf', size: '5.2 MB', type: 'PDF', uploadedAt: '2024-01-08', accessedAt: '2024-01-18' },
        { id: 4, name: 'Project Guidelines.pdf', size: '3.1 MB', type: 'PDF', uploadedAt: '2024-01-05', accessedAt: '2024-01-17' },
      ];
      setRecentFiles(mockFiles);
    } catch (error) {
      addToast('Failed to load files', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const loadUserAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      // Mock user analytics data
      const mockAnalytics = {
        totalSearches: 45,
        documentsAccessed: 12,
        favoriteDocuments: 3,
        averageResponseTime: '1.2s',
        lastActive: '2024-01-20',
        topSearchTerms: ['policy', 'handbook', 'training', 'guidelines'],
        weeklyActivity: [5, 8, 12, 6, 9, 15, 10],
      };
      setUserAnalytics(mockAnalytics);
    } catch (error) {
      addToast('Failed to load analytics', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const loadSearchHistory = useCallback(async () => {
    setLoading(true);
    try {
      // Mock search history
      const mockHistory = [
        { query: 'company policy', timestamp: '2024-01-20 10:30', results: 5 },
        { query: 'employee benefits', timestamp: '2024-01-20 09:15', results: 8 },
        { query: 'training schedule', timestamp: '2024-01-19 14:20', results: 3 },
        { query: 'vacation policy', timestamp: '2024-01-19 11:45', results: 6 },
      ];
      setSearchHistory(mockHistory);
    } catch (error) {
      addToast('Failed to load search history', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    if (activeTab === 'files') {
      loadRecentFiles();
    } else if (activeTab === 'analytics') {
      loadUserAnalytics();
    } else if (activeTab === 'search') {
      loadSearchHistory();
    }
  }, [activeTab, loadRecentFiles, loadUserAnalytics, loadSearchHistory]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiEndpoints.search.searchDocuments({
        query: searchQuery,
        filters: { role: 'employee' },
      });
      setSearchResults(response.data.results);
      
      // Add to search history
      const newHistoryItem = {
        query: searchQuery,
        timestamp: new Date().toLocaleString(),
        results: response.data.results.length,
      };
      setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      
      addToast(`Found ${response.data.results.length} results`, 'success');
    } catch (error) {
      addToast('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileDownload = async (fileId) => {
    setLoading(true);
    try {
      const response = await apiEndpoints.file.downloadFile(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `file-${fileId}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast('File downloaded successfully', 'success');
    } catch (error) {
      addToast('File download failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (fileId) => {
    setFavorites(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const renderSearch = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Document Search</h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-sm">
            {searchHistory.length} recent searches
          </span>
        </div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="flex space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search documents, policies, guidelines..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faSearch} />
            <span>Search</span>
          </motion.button>
        </div>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <FontAwesomeIcon icon={faHistory} className="text-purple-400" />
            <span>Recent Searches</span>
          </h3>
          <div className="space-y-2">
            {searchHistory.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex justify-between items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer"
                onClick={() => setSearchQuery(item.query)}
              >
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon icon={faClock} className="text-gray-400 text-sm" />
                  <span className="text-white">{item.query}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm">{item.results} results</span>
                  <span className="text-gray-500 text-xs">{item.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Search Results</h3>
          {searchResults.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2">{result.title}</h4>
                  <p className="text-gray-300 mb-2">{result.excerpt}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Score: {result.score}</span>
                    <span>Type: {result.type}</span>
                    <span>Modified: {result.modified}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleFavorite(result.id)}
                  className={`ml-4 ${favorites.includes(result.id) ? 'text-yellow-400' : 'text-gray-400'}`}
                >
                  <FontAwesomeIcon icon={faStar} />
                </motion.button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-purple-400 hover:text-purple-300 flex items-center space-x-1"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    <span>View</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFileDownload(result.id)}
                    className="text-green-400 hover:text-green-300 flex items-center space-x-1"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    <span>Download</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFiles = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Files</h2>
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadRecentFiles}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faRefresh} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentFiles.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faFileAlt} className="text-purple-400 text-2xl" />
                <div>
                  <h3 className="text-white font-semibold">{file.name}</h3>
                  <p className="text-gray-400 text-sm">{file.type} • {file.size}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleFavorite(file.id)}
                className={`text-gray-400 hover:text-yellow-400 ${favorites.includes(file.id) ? 'text-yellow-400' : ''}`}
              >
                <FontAwesomeIcon icon={faStar} />
              </motion.button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last accessed</span>
                <span className="text-white">{file.accessedAt}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Uploaded</span>
                <span className="text-white">{file.uploadedAt}</span>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 py-2 rounded-lg flex items-center justify-center space-x-2"
              >
                <FontAwesomeIcon icon={faEye} />
                <span>View</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFileDownload(file.id)}
                className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 py-2 rounded-lg flex items-center justify-center space-x-2"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span>Download</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">My Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <FontAwesomeIcon icon={faSearch} className="text-blue-400 text-2xl" />
            <span className="text-blue-300 text-sm">Total Searches</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {userAnalytics?.totalSearches || 0}
          </div>
          <div className="text-gray-400 text-sm">This month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <FontAwesomeIcon icon={faFileAlt} className="text-green-400 text-2xl" />
            <span className="text-green-300 text-sm">Documents</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {userAnalytics?.documentsAccessed || 0}
          </div>
          <div className="text-gray-400 text-sm">Accessed</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <FontAwesomeIcon icon={faStar} className="text-purple-400 text-2xl" />
            <span className="text-purple-300 text-sm">Favorites</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {userAnalytics?.favoriteDocuments || 0}
          </div>
          <div className="text-gray-400 text-sm">Documents</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <FontAwesomeIcon icon={faClock} className="text-orange-400 text-2xl" />
            <span className="text-orange-300 text-sm">Avg Response</span>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {userAnalytics?.averageResponseTime || '0s'}
          </div>
          <div className="text-gray-400 text-sm">Search time</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top Search Terms</h3>
          <div className="space-y-3">
            {userAnalytics?.topSearchTerms.map((term, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300">{term}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(index + 1) * 20}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-400 text-sm">{(index + 1) * 5}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Activity Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Last Active</span>
              <span className="text-white">{userAnalytics?.lastActive || 'Today'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Search Success Rate</span>
              <span className="text-white">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Documents per Search</span>
              <span className="text-white">3.2</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return renderSearch();
      case 'files':
        return renderFiles();
      case 'analytics':
        return renderAnalytics();
      case 'chatbot':
        return <EmployeeChatbot />;
      default:
        return renderSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Employee Dashboard</h1>
          <p className="text-gray-300">Welcome back, {user?.name || 'Employee'}</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-2 border border-white/10 mb-8 flex space-x-2"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <FontAwesomeIcon icon={tab.icon} />
              <span className="hidden sm:inline">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              renderContent()
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
