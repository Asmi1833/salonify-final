import axios from 'axios';

// API configuration - setting this to exactly match our backend URL
const API_URL = 'http://localhost:5001';

// Fallback mode - set to true when backend is not available
const FALLBACK_MODE = false;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Increase timeout for development
  timeout: 30000
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login function
export const login = async (email, password, role) => {
  try {
    // Try actual API call first
    console.log('Sending login request to:', `${API_URL}/api/users/login`);
    const response = await api.post('/api/users/login', { email, password, role });
    
    // Store token and user info in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const userData = {
        ...response.data.user,
        role: response.data.user.role || role
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific error cases
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

// Register function
export const register = async (userData) => {
  try {
    // Try actual API call first
    console.log('Sending registration data to:', `${API_URL}/api/users/register`);
    console.log('Registration data:', userData);
    const response = await api.post('/api/users/register', userData);
    
    // Store token and user info in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'Registration failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request');
    }
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user function
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/users/me');
    return response.data;
  } catch (error) {
    if (FALLBACK_MODE) {
      // Just return the stored user data in fallback mode
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
    }
    throw new Error('Failed to get user data');
  }
};

export default {
  login,
  register,
  logout,
  getCurrentUser
}; 