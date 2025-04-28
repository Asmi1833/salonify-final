const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getMyAppointments,
  getSalonAppointments,
  getStaffAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protected client routes
router.route('/').post(protect, createAppointment);
router.route('/myappointments').get(protect, getMyAppointments);
router.route('/:id').get(protect, getAppointmentById);
router.route('/:id/cancel').put(protect, cancelAppointment);

// Salon owner routes
router.route('/salon/:salonId').get(protect, authorize('SalonOwner', 'Admin'), getSalonAppointments);
router.route('/staff/:staffId').get(protect, authorize('SalonOwner', 'Admin'), getStaffAppointments);
router.route('/:id/status').put(protect, authorize('SalonOwner', 'Admin'), updateAppointmentStatus);

// Admin routes
router.route('/:id').delete(protect, authorize('Admin'), deleteAppointment);

module.exports = router; 