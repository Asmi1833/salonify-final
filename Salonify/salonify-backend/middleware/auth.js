const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('Auth middleware: No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    console.log('Auth middleware: Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Handle different token structures
    const userId = decoded.userId || decoded.id || decoded._id;
    
    if (!userId) {
      console.error('Auth middleware: Token verified but no user ID found in token');
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
    console.log('Auth middleware: Token verified, user ID:', userId);
    
    req.user = { 
      userId: userId
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 