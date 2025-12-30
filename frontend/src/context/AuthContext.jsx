// src/context/AuthContext.jsx
<<<<<<< Updated upstream
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

=======
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  role: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        role: action.payload.user.role,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
      };
    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        role: action.payload.role,
      };
    case AUTH_ACTIONS.LOAD_USER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Login action
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOGIN_START });
      
      // This would be an API call in a real app
      // For now, we'll simulate a login
      const response = await mockLoginAPI(credentials);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: response.user,
            token: response.token,
          },
        });
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Load user from token
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE });
      return;
    }

    try {
      // This would be an API call in a real app
      const user = await mockLoadUserAPI(token);
      dispatch({
        type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
        payload: user,
      });
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_FAILURE });
    }
  };

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    ...state,
    login,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
>>>>>>> Stashed changes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

<<<<<<< Updated upstream
=======
// Mock API functions (replace with real API calls)
const mockLoginAPI = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data based on email
  if (credentials.email === 'admin@gmail.com' && credentials.password === 'admin123') {
    return {
      token: 'mock-admin-token',
      user: {
        id: 1,
        name: 'Admin User',
        email: 'admin@gmail.com',
        role: 'admin',
      },
    };
  } else if (credentials.email === 'employee@gmail.com' && credentials.password === 'emp123') {
    return {
      token: 'mock-employee-token',
      user: {
        id: 2,
        name: 'Employee User',
        email: 'employee@gmail.com',
        role: 'employee',
      },
    };
  } else {
    throw new Error('Invalid credentials');
  }
};

const mockLoadUserAPI = async (token) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock user data based on token
  if (token === 'mock-admin-token') {
    return {
      id: 1,
      name: 'Admin User',
      email: 'admin@gmail.com',
      role: 'admin',
    };
  } else if (token === 'mock-employee-token') {
    return {
      id: 2,
      name: 'Employee User',
      email: 'employee@gmail.com',
      role: 'employee',
    };
  } else {
    throw new Error('Invalid token');
  }
};

>>>>>>> Stashed changes
export default AuthContext;