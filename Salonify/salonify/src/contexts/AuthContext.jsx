import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout as logoutApi } from '../services/auth';

// Create context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check for stored user data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const loginUser = async (email, password, role) => {
    try {
      setError(null);
      const response = await login(email, password, role);
      console.log('AuthContext: Login successful', response);
      
      // The API returns { token, user }
      if (response && response.user) {
        const userData = {
          ...response.user,
          role: role // Ensure role is included in user data
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else {
        throw new Error('Invalid response format from login API');
      }
    } catch (err) {
      console.error('AuthContext: Login error', err);
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  // Register function
  const registerUser = async (userData) => {
    try {
      setError(null);
      const response = await register(userData);
      console.log('AuthContext: Registration successful', response);
      
      // The API returns { token, user }
      if (response && response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return response.user;
      } else {
        throw new Error('Invalid response format from registration API');
      }
    } catch (err) {
      console.error('AuthContext: Registration error', err);
      setError(err.message || 'Failed to register');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setError(null);
    logoutApi();
  };

  // Calculate isAuthenticated based on user state
  const isAuthenticated = !!user;

  // Add a helper function to check user role
  const isSalonOwner = user?.role === 'salon_owner';

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login: loginUser,
    register: registerUser,
    logout,
    isSalonOwner // Export the helper function
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 