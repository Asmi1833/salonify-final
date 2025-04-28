const express = require('express');
const router = express.Router();
const Booking = require('../models/bookings');
const auth = require('../middleware/auth');

// Get all bookings for a user
router.get('/user', auth, async (req, res) => {
  try {
    console.log('Routes: Getting bookings for user:', req.user.userId);
    const bookings = await Booking.find({ user: req.user.userId })
      .populate('salon', 'name address')
      .sort({ date: 1 });
    console.log('Routes: Found bookings:', bookings.length);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('salon', 'name address')
      .populate('user', 'name email');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user owns this booking
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { salon, service, date, time, price, notes } = req.body;

    const booking = new Booking({
      user: req.user.userId,
      salon,
      service,
      date,
      time,
      price,
      notes
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user owns this booking
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only pending bookings can be cancelled
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user owns this booking
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { service, date, time, price, notes, status } = req.body;

    booking.service = service || booking.service;
    booking.date = date || booking.date;
    booking.time = time || booking.time;
    booking.price = price || booking.price;
    booking.notes = notes || booking.notes;
    if (status) booking.status = status;

    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user owns this booking
    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Booking.deleteOne({ _id: req.params.id });
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 