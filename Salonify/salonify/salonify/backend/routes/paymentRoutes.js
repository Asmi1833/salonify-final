const express = require('express');
const router = express.Router();
const {
  createPayment,
  getMyPayments,
  getPaymentById,
  getSalonPayments,
  updatePayment,
  deletePayment
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protected client routes
router.route('/').post(protect, createPayment);
router.route('/mypayments').get(protect, getMyPayments);
router.route('/:id').get(protect, getPaymentById);

// Salon owner routes
router.route('/salon/:salonId').get(protect, authorize('SalonOwner', 'Admin'), getSalonPayments);

// Admin routes
router.route('/:id')
  .put(protect, authorize('Admin'), updatePayment)
  .delete(protect, authorize('Admin'), deletePayment);

module.exports = router; 