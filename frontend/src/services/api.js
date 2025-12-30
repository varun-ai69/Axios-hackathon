// src/services/api.js
import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 🔐 Authentication Endpoints
export const authAPI = {
  // User login
  login: async (credentials) => {
    console.log('🔐 Attempting login with:', credentials);
    console.log('🔐 API URL:', `${api.baseURL}/auth/login`);
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('🔐 Login response:', response.data);
      return response;
    } catch (error) {
      console.error('🔐 Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  // Register new user
  register: async (userData) => {
    console.log('🔐 Attempting registration with:', userData);
    try {
      const response = await api.post('/auth/register', userData);
      console.log('🔐 Registration response:', response.data);
      return response;
    } catch (error) {
      console.error('🔐 Registration error:', error.response?.data || error.message);
      throw error;
    }
  }
};

// 📄 Document Ingestion Endpoints
export const documentAPI = {
  // Upload document (admin only)
  ingestDocument: (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return api.post('/upload/ingestion', formData, config);
  },
};

// 🔍 Search & Retrieval Endpoints
export const searchAPI = {
  // Query documents with role-based filtering
  searchDocuments: (queryData) => api.post('/search/retrieval', queryData),
};

// 📁 File Management Endpoints
export const fileAPI = {
  // List all stored files (admin only)
  getAllFiles: () => api.get('/files/'),
  
  // Get file by ID
  getFileById: (fileId) => api.get(`/files/${fileId}`),
  
  // Download file
  downloadFile: (fileId) => {
    const config = {
      responseType: 'blob',
    };
    return api.get(`/files/${fileId}/download`, config);
  },
  
  // Delete file (admin only)
  deleteFile: (fileId) => api.delete(`/files/${fileId}`),
  
  // File statistics (admin only)
  getFileStats: () => api.get('/files/stats/overview'),
};

// 📊 Analytics Endpoints
export const analyticsAPI = {
  // User analytics
  getUserAnalytics: (userId) => api.get(`/analytics/user/${userId}`),
  
  // System analytics (admin only)
  getSystemAnalytics: () => api.get('/analytics/system'),
  
  // Recent query history
  getRecentQueries: () => api.get('/analytics/queries/recent'),
};

// 📂 File Monitoring Endpoints
export const monitoringAPI = {
  // Manual directory scan (admin only)
  scanDirectory: (directoryPath) => api.post('/monitor/scan', { directoryPath }),
  
  // Monitoring status (admin only)
  getMonitoringStatus: () => api.get('/monitor/status'),
};

// 🤖 Chatbot Endpoints
export const chatbotAPI = {
  // Query chatbot
  query: (queryData) => api.post('/chatbot/query', queryData),
  // Get chatbot status
  status: () => api.get('/chatbot/status'),
};

// 👥 Employee Registration Endpoints
export const employeeAPI = {
  // Request employee registration
  requestEmployeeRegistration: (userData) => api.post('/auth/employee-register', userData),
};

// Combined API object for easy import
export const apiEndpoints = {
  auth: authAPI,
  document: documentAPI,
  search: searchAPI,
  file: fileAPI,
  analytics: analyticsAPI,
  monitoring: monitoringAPI,
  chatbot: chatbotAPI,
  employee: employeeAPI,
};

// Legacy exports for backward compatibility
export const register = authAPI.register;
export const login = authAPI.login;
export const queryChatbot = chatbotAPI.queryChatbot;
export const requestEmployeeRegistration = employeeAPI.requestEmployeeRegistration;

export default api;