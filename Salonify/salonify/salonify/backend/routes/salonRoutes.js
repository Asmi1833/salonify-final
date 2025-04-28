
/* global require, module */
const express = require('express');
const router = express.Router();
const {
  createSalon,
  getSalons,
  getSalonById,
  updateSalon,
  deleteSalon,
  getMySalons,
  updateSalonSettings
} = require('../controllers/salonController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getSalons);
router.route('/:id').get(getSalonById);

// Protected routes
router.route('/').post(protect, authorize('SalonOwner', 'Admin'), createSalon);
router.route('/mysalons').get(protect, authorize('SalonOwner'), getMySalons);
router
  .route('/:id')
  .put(protect, authorize('SalonOwner', 'Admin'), updateSalon)
  .delete(protect, authorize('SalonOwner', 'Admin'), deleteSalon);
  router.put('/update-settings',updateSalonSettings)

module.exports = router; 