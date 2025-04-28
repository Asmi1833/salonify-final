const express = require('express');
const router = express.Router();
const {
  createReview,
  getSalonReviews,
  getStaffReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getMyReviews
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.route('/salon/:salonId').get(getSalonReviews);
router.route('/staff/:staffId').get(getStaffReviews);
router.route('/:id').get(getReviewById);

// Protected routes
router.route('/').post(protect, createReview);
router.route('/myreviews').get(protect, getMyReviews);
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router; 