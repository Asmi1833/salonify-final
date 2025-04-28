const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Protect routes - Verify user is authenticated
 */
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

/**
 * Check if user has specific role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, no user');
    }
    
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role ${req.user.role} is not authorized to access this resource`);
    }
    
    next();
  };
};

module.exports = { protect, authorize }; 