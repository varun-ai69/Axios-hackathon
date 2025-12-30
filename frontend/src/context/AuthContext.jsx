// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Test users for development
  const testUsers = useMemo(() => ({
    admin: {
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
      name: 'Test Admin'
    },
    employee: {
      email: 'employee@test.com', 
      password: 'emp123',
      role: 'employee',
      name: 'Test Employee'
    }
  }), []);

  const loginUser = useCallback((userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else {
      // Auto-login with admin test user for development
      // Comment out the next 2 lines to disable auto-login
      const adminUser = testUsers.admin;
      loginUser(adminUser, `test-token-admin-${Date.now()}`);
    }
    setLoading(false);
  }, [testUsers, loginUser]);

  const testLogin = useCallback((email, password) => {
    const userKey = Object.keys(testUsers).find(key => 
      testUsers[key].email === email && testUsers[key].password === password
    );
    
    if (userKey) {
      const userData = testUsers[userKey];
      const fakeToken = `test-token-${userKey}-${Date.now()}`;
      loginUser(userData, fakeToken);
      return true;
    }
    return false;
  }, [testUsers, loginUser]);

  const logoutUser = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const value = {
    user,
    token,
    loading,
    loginUser,
    testLogin,
    logoutUser,
    testUsers,
    isAuthenticated: !!token
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