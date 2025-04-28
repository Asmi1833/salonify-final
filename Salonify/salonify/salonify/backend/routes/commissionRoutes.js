const express = require('express');
const router = express.Router();
const { getCommissionData } = require('../controllers/commissionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protected salon owner routes
router.route('/tracking').get(protect, authorize('SalonOwner'), getCommissionData);

module.exports = router; 