const express = require('express');
const router = express.Router();
const {
  addStaff,
  getSalonStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getStaffAvailability
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.route('/salon/:salonId').get(getSalonStaff);
router.route('/:id').get(getStaffById);
router.route('/:id/availability').get(getStaffAvailability);

// Protected routes
router.route('/').post(protect, authorize('SalonOwner', 'Admin'), addStaff);
router
  .route('/:id')
  .put(protect, authorize('SalonOwner', 'Admin'), updateStaff)
  .delete(protect, authorize('SalonOwner', 'Admin'), deleteStaff);

module.exports = router; 