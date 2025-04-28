/* global require, module */

const Review = require('../models/reviewModel');
const Salon = require('../models/salonModel');
const Staff = require('../models/staffModel');
const Appointment = require('../models/appointmentModel');

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = async (req, res) => {
  const {
    salon_id,
    staff_id,
    rating,
    comments,
    appointment_id,
    photos
  } = req.body;

  // Check if salon exists
  const salon = await Salon.findById(salon_id);
  if (!salon) {
    res.status(404);
    throw new Error('Salon not found');
  }

  // Check if staff exists if staff_id is provided
  if (staff_id) {
    const staff = await Staff.findById(staff_id);
    if (!staff) {
      res.status(404);
      throw new Error('Staff not found');
    }
  }

  // Check if appointment exists if appointment_id is provided
  if (appointment_id) {
    const appointment = await Appointment.findById(appointment_id);
    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    // Verify if user is the client for the appointment
    if (appointment.client_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to review this appointment');
    }

    // Check if appointment is completed
    if (appointment.status !== 'Completed') {
      res.status(400);
      throw new Error('Cannot review an incomplete appointment');
    }
  }

  // Check if user has already reviewed this salon
  const existingReview = await Review.findOne({
    salon_id,
    client_id: req.user._id,
    ...(appointment_id && { appointment_id })
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this salon');
  }

  // Create review
  const review = await Review.create({
    salon_id,
    client_id: req.user._id,
    staff_id,
    rating,
    comments,
    appointment_id,
    photos,
    is_verified: !!appointment_id // Verify review if it's tied to an appointment
  });

  if (review) {
    res.status(201).json(review);
  } else {
    res.status(400);
    throw new Error('Invalid review data');
  }
};

/**
 * @desc    Get all reviews for a salon
 * @route   GET /api/reviews/salon/:salonId
 * @access  Public
 */
const getSalonReviews = async (req, res) => {
  const { salonId } = req.params;
  
  // Check if salon exists
  const salon = await Salon.findById(salonId);
  if (!salon) {
    res.status(404);
    throw new Error('Salon not found');
  }
  
  // Get reviews for the salon
  const reviews = await Review.find({ salon_id: salonId })
    .populate('client_id', 'name')
    .populate('staff_id', 'name')
    .sort({ created_at: -1 });

  res.json(reviews);
};

/**
 * @desc    Get all reviews for a staff member
 * @route   GET /api/reviews/staff/:staffId
 * @access  Public
 */
const getStaffReviews = async (req, res) => {
  const { staffId } = req.params;
  
  // Check if staff exists
  const staff = await Staff.findById(staffId);
  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }
  
  // Get reviews for the staff
  const reviews = await Review.find({ staff_id: staffId })
    .populate('client_id', 'name')
    .sort({ created_at: -1 });

  res.json(reviews);
};

/**
 * @desc    Get review by ID
 * @route   GET /api/reviews/:id
 * @access  Public
 */
const getReviewById = async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('client_id', 'name')
    .populate('salon_id', 'name')
    .populate('staff_id', 'name');

  if (review) {
    res.json(review);
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
};

/**
 * @desc    Update review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
const updateReview = async (req, res) => {
  const { rating, comments, photos } = req.body;

  const review = await Review.findById(req.params.id);

  if (review) {
    // Check if user is the review author
    if (review.client_id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this review');
    }

    review.rating = rating || review.rating;
    review.comments = comments || review.comments;
    review.photos = photos || review.photos;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
};

/**
 * @desc    Delete review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    // Check if user is the review author or admin
    if (
      review.client_id.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
};

/**
 * @desc    Get all reviews by a user
 * @route   GET /api/reviews/myreviews
 * @access  Private
 */
const getMyReviews = async (req, res) => {
  const reviews = await Review.find({ client_id: req.user._id })
    .populate('salon_id', 'name')
    .populate('staff_id', 'name')
    .sort({ created_at: -1 });

  res.json(reviews);
};

module.exports = {
  createReview,
  getSalonReviews,
  getStaffReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getMyReviews
}; 