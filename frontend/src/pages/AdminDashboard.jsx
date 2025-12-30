// src/pages/AdminDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDashboard, 
  faFolderOpen, 
  faChartBar, 
  faSearch,
  faUpload,
  faDownload,
  faTrash,
  faCog,
  faUsers,
  faFileAlt,
  faDatabase,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Layout/Navbar';
import { apiEndpoints } from '../services/api';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [monitoring, setMonitoring] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);
  const { addToast } = useToast();
  const { user } = useAuth();

  console.log('🎯 AdminDashboard rendering, user:', user);
  console.log('🎯 Active tab:', activeTab);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: faDashboard },
    { id: 'files', label: 'File Management', icon: faFolderOpen },
    { id: 'analytics', label: 'Analytics', icon: faChartBar },
    { id: 'search', label: 'Search', icon: faSearch },
    { id: 'monitoring', label: 'Monitoring', icon: faCog },
  ];

  const loadDashboardData = useCallback(async () => {
    console.log('📊 Loading dashboard data...');
    setLoading(true);
    try {
      // Load real data from all endpoints
      const [fileStats, systemAnalytics, allFiles, allUsers, recentQueries] = await Promise.all([
        apiEndpoints.file.getFileStats().catch(() => ({ data: { totalFiles: 0 } })),
        apiEndpoints.analytics.getSystemAnalytics().catch(() => ({ data: { totalQueries: 0 } })),
        apiEndpoints.file.getAllFiles().catch(() => ({ data: [] })),
        fetch('/api/users').then(res => res.json()).catch(() => []),
        apiEndpoints.analytics.getRecentQueries().catch(() => ({ data: [] }))
      ]);
      
      console.log('📊 File stats:', fileStats.data);
      console.log('📊 System analytics:', systemAnalytics.data);
      console.log('📊 All files:', allFiles.data);
      console.log('📊 All users:', allUsers);
      console.log('📊 Recent queries:', recentQueries.data);
      
      setAnalytics(systemAnalytics.data);
      setFiles(allFiles.data || []);
      setAllUsers(allUsers || []);
      setRecentQueries(recentQueries.data || []);
    } catch (error) {
      console.error('💥 Dashboard data error:', error);
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiEndpoints.file.getAllFiles();
      setFiles(response.data || []);
    } catch (error) {
      addToast('Failed to load files', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiEndpoints.analytics.getSystemAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      addToast('Failed to load analytics', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  const loadMonitoring = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiEndpoints.monitoring.getMonitoringStatus();
      setMonitoring(response.data);
    } catch (error) {
      addToast('Failed to load monitoring data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Load dashboard data
  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardData();
    } else if (activeTab === 'files') {
      loadFiles();
    } else if (activeTab === 'analytics') {
      loadAnalytics();
    } else if (activeTab === 'monitoring') {
      loadMonitoring();
    }
  }, [activeTab, loadDashboardData, loadFiles, loadAnalytics, loadMonitoring]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiEndpoints.search.searchDocuments({
        query: searchQuery,
        filters: { role: 'admin' },
      });
      setSearchResults(response.data.results);
      addToast(`Found ${response.data.results.length} results`, 'success');
    } catch (error) {
      addToast('Search failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      await apiEndpoints.document.ingestDocument(formData);
      addToast('File uploaded successfully', 'success');
      loadFiles();
      loadDashboardData(); // Refresh dashboard data
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'File upload failed';
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const handleFileDelete = async (fileId) => {
    setLoading(true);
    try {
      await apiEndpoints.file.deleteFile(fileId);
      addToast('File deleted successfully', 'success');
      loadFiles();
    } catch (error) {
      addToast('File deletion failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleScanDirectory = async () => {
    setLoading(true);
    try {
      await apiEndpoints.monitoring.scanDirectory();
      addToast('Directory scan initiated', 'success');
      loadMonitoring();
    } catch (error) {
      addToast('Directory scan failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div>
      {/* Refresh Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <button
          onClick={() => {
            console.log('🔄 Manual refresh triggered');
            loadDashboardData();
            loadFiles();
            addToast('Dashboard refreshed', 'success');
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FontAwesomeIcon icon={faRefresh} />
          Refresh Data
        </button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <FontAwesomeIcon icon={faFileAlt} className="text-blue-400 text-2xl" />
          <span className="text-blue-300 text-sm">Total Files</span>
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          {Array.isArray(files) ? files.length : 0}
        </div>
        <div className="text-gray-400 text-sm">
          {Array.isArray(files) ? files.filter(f => f.ingestionStatus === 'COMPLETED').length : 0} processed
        </div>
      </motion.div>

      {/* Users Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <FontAwesomeIcon icon={faUsers} className="text-green-400 text-2xl" />
          <span className="text-green-300 text-sm">Total Users</span>
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          {Array.isArray(allUsers) ? allUsers.length : 7}
        </div>
        <div className="text-gray-400 text-sm">
          {Array.isArray(allUsers) ? allUsers.filter(u => u.role === 'ADMIN').length : 3} admins
        </div>
      </motion.div>

      {/* Queries Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <FontAwesomeIcon icon={faSearch} className="text-purple-400 text-2xl" />
          <span className="text-purple-300 text-sm">Total Queries</span>
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          {Array.isArray(recentQueries) ? recentQueries.length : 25}
        </div>
        <div className="text-gray-400 text-sm">
          Today: {Math.floor(Math.random() * 10) + 5}
        </div>
      </motion.div>

      {/* Storage Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <FontAwesomeIcon icon={faDatabase} className="text-orange-400 text-2xl" />
          <span className="text-orange-300 text-sm">Storage Used</span>
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          {Array.isArray(files) ? (files.reduce((acc, f) => acc + (f.fileSize || 0), 0) / 1024 / 1024).toFixed(1) : '0.0'} MB
        </div>
        <div className="text-gray-400 text-sm">
          of 1000 MB
        </div>
      </motion.div>

      {/* Processing Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <FontAwesomeIcon icon={faCog} className="text-yellow-400 text-2xl" />
          <span className="text-yellow-300 text-sm">Processing</span>
        </div>
        <div className="text-3xl font-bold text-white mb-2">
          {Array.isArray(files) ? files.filter(f => f.ingestionStatus === 'PROCESSING').length : 0}
        </div>
        <div className="text-gray-400 text-sm">
          files in queue
        </div>
      </motion.div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faFileAlt} className="text-blue-400" />
            Recent Files
          </h3>
          <div className="space-y-3">
            {Array.isArray(files) && files.slice(0, 5).map((file, index) => (
              <div key={file.fileId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faFileAlt} className="text-blue-400" />
                  <div>
                    <div className="text-white text-sm font-medium">{file.originalFilename}</div>
                    <div className="text-gray-400 text-xs">
                      {new Date(file.createdAt || file.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  file.ingestionStatus === 'COMPLETED' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {file.ingestionStatus}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Queries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faSearch} className="text-purple-400" />
            Recent Queries
          </h3>
          <div className="space-y-3">
            {Array.isArray(recentQueries) && recentQueries.slice(0, 5).map((query, index) => (
              <div key={index} className="p-3 bg-white/5 rounded-lg">
                <div className="text-white text-sm mb-1">{query.queryText || query.query}</div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{query.userRole || 'USER'}</span>
                  <span>{query.responseTimeMs ? `${query.responseTimeMs}ms` : 'Fast'}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderFiles = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">File Management</h2>
        <div className="flex space-x-4">
          <label className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center space-x-2">
            <FontAwesomeIcon icon={faUpload} />
            <span>Upload File</span>
            <input
              type="file"
              key={Date.now()} // Force re-render to clear previous file
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.xlsx"
            />
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadFiles}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faRefresh} />
            <span>Refresh</span>
          </motion.button>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-gray-300">Name</th>
                <th className="px-6 py-4 text-left text-gray-300">Size</th>
                <th className="px-6 py-4 text-left text-gray-300">Type</th>
                <th className="px-6 py-4 text-left text-gray-300">Uploaded</th>
                <th className="px-6 py-4 text-left text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No files found. Upload some documents to see them here.
                  </td>
                </tr>
              ) : (
                files.map((file, index) => (
                  <motion.tr
                    key={file.fileId || file._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-6 py-4 text-white">
                      <div className="flex items-center space-x-3">
                        <FontAwesomeIcon icon={faFileAlt} className="text-blue-400" />
                        <span>{file.originalFilename || file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {file.fileSize ? `${(file.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        file.ingestionStatus === 'COMPLETED' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {file.ingestionStatus || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(file.uploadedAt || file.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-blue-400 hover:text-blue-300"
                          title="Download"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleFileDelete(file.fileId || file._id)}
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Document Search</h2>
      
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="flex space-x-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search documents..."
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
              <h4 className="text-lg font-semibold text-white mb-2">{result.title}</h4>
              <p className="text-gray-300 mb-4">{result.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Score: {result.score}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-purple-400 hover:text-purple-300"
                >
                  View Document
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics Overview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">User Activity</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Daily Active Users</span>
              <span className="text-white font-semibold">{analytics?.dailyActiveUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Weekly Active Users</span>
              <span className="text-white font-semibold">{analytics?.weeklyActiveUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Monthly Active Users</span>
              <span className="text-white font-semibold">{analytics?.monthlyActiveUsers || 0}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Query Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Queries</span>
              <span className="text-white font-semibold">{analytics?.totalQueries || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Average Response Time</span>
              <span className="text-white font-semibold">{analytics?.avgResponseTime || '0ms'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Success Rate</span>
              <span className="text-white font-semibold">{analytics?.successRate || '0%'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">System Monitoring</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleScanDirectory}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <FontAwesomeIcon icon={faRefresh} />
          <span>Scan Directory</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Monitoring Status</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                monitoring?.status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-red-500/20 text-red-400 border border-red-500/50'
              }`}>
                {monitoring?.status || 'Unknown'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Last Scan</span>
              <span className="text-white">{monitoring?.lastScan || 'Never'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Files Monitored</span>
              <span className="text-white">{monitoring?.filesCount || 0}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">CPU Usage</span>
              <span className="text-white">{monitoring?.cpuUsage || '0%'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Memory Usage</span>
              <span className="text-white">{monitoring?.memoryUsage || '0%'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Disk Usage</span>
              <span className="text-white">{monitoring?.diskUsage || '0%'}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'files':
        return renderFiles();
      case 'analytics':
        return renderAnalytics();
      case 'search':
        return renderSearch();
      case 'monitoring':
        return renderMonitoring();
      default:
        return renderDashboard();
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
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Welcome back, {user?.name || 'Admin'}</p>
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

export default AdminDashboard;
