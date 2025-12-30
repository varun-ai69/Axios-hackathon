// src/context/AuthContext.jsx - Updated for RAG System Backend Integration
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Login user with backend API
  const login = useCallback(async (credentials) => {
    try {
      console.log('🔐 AuthContext: Attempting login with:', credentials);
      const response = await authAPI.login(credentials);
      console.log('📨 AuthContext: API response:', response);
      
      const { user: userData, token: userToken } = response.data;
      console.log('👤 AuthContext: User data:', userData);
      console.log('🎟️ AuthContext: Token:', userToken?.substring(0, 20) + '...');
      
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      
      return { success: true, user: userData, token: userToken };
    } catch (error) {
      console.error('💥 AuthContext: Login error:', error);
      console.error('💥 AuthContext: Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }, []);

  // Register user with backend API
  const register = useCallback(async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          logout();
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [logout]);

  // Get user role
  const getUserRole = useCallback(() => {
    return user?.role || null;
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return getUserRole() === 'ADMIN';
  }, [getUserRole]);

  // Check if user is employee
  const isEmployee = useCallback(() => {
    return getUserRole() === 'EMPLOYEE';
  }, [getUserRole]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    getUserRole,
    isAdmin,
    isEmployee,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
