const jwt = require('jsonwebtoken');

/**
 * Generate a JSON Web Token
 * @param {string} id - User ID to encode in the token
 * @returns {string} JSON Web Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

module.exports = generateToken; 