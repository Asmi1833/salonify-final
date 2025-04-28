const express = require('express');
const router = express.Router();
const {
  createService,
  getSalonServices,
  getServiceById,
  updateService,
  deleteService,
  getPopularServices
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.route('/salon/:salonId').get(getSalonServices);
router.route('/popular').get(getPopularServices);
router.route('/:id').get(getServiceById);

// Protected routes
router.route('/').post(protect, authorize('SalonOwner', 'Admin'), createService);
router
  .route('/:id')
  .put(protect, authorize('SalonOwner', 'Admin'), updateService)
  .delete(protect, authorize('SalonOwner', 'Admin'), deleteService);

module.exports = router; 