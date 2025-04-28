const express = require('express');
const router = express.Router();
const Salon = require('../models/salons');
const auth = require('../middleware/auth');

// Get all salons
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9; // Number of salons per page
    const keyword = req.query.keyword || '';
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { address: { $regex: keyword, $options: 'i' } }
          ]
        }
      : {};

    // Get total count for pagination
    const total = await Salon.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / limit);

    // Get salons with pagination and search
    const salons = await Salon.find(searchQuery)
      .populate('owner', 'name email')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      salons,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching salons:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific salon
router.get('/:id', async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('reviews');
    
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    res.json(salon);
  } catch (error) {
    console.error('Error fetching salon:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new salon (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      phone,
      email,
      images,
      services,
      opening_time,
      closing_time
    } = req.body;

    const salon = new Salon({
      name,
      description,
      address,
      phone,
      email,
      images,
      services,
      opening_time,
      closing_time,
      owner: req.user.userId
    });

    await salon.save();
    res.status(201).json(salon);
  } catch (error) {
    console.error('Error creating salon:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update salon settings (protected route)
router.put('/update-settings', auth, async (req, res) => {
  try {
    console.log('Received update-settings request with user ID:', req.user?.userId);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Check if user ID exists
    if (!req.user || !req.user.userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ 
        success: false,
        message: 'User not authenticated properly' 
      });
    }
    
    // Extract salonData from request body
    const { owner_id, ...salonData } = req.body;
    
    // Find salon by owner ID (or create if not exists)
    let salon = await Salon.findOne({ owner: req.user.userId });
    
    console.log('Found existing salon:', salon ? 'Yes' : 'No');
    
    if (!salon) {
      // Create new salon if not exists
      console.log('Creating new salon for owner:', req.user.userId);
      try {
        salon = new Salon({
          ...salonData,
          owner: req.user.userId
        });
      } catch (err) {
        console.error('Error creating new salon:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error creating new salon',
          error: err.message
        });
      }
    } else {
      // Update existing salon
      console.log('Updating existing salon:', salon._id);
      try {
        // Safely update fields
        ['name', 'description', 'address', 'phone', 'email', 'images', 
        'openingHours', 'paymentMethods', 'city', 'state', 'zipCode', 
        'website', 'openingTime', 'closingTime'].forEach(key => {
          if (salonData[key] !== undefined) {
            salon[key] = salonData[key];
          }
        });
      } catch (err) {
        console.error('Error updating salon fields:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error updating salon fields',
          error: err.message
        });
      }
    }
    
    try {
      console.log('Saving salon data...');
      await salon.save();
      console.log('Salon saved successfully');
      
      res.status(200).json({
        success: true,
        salon
      });
    } catch (saveError) {
      console.error('Error saving salon:', saveError);
      return res.status(500).json({ 
        success: false, 
        message: 'Error saving salon to database',
        error: saveError.message
      });
    }
  } catch (error) {
    console.error('Error updating salon settings:', error);
    // Send more detailed error information
    res.status(500).json({ 
      success: false,
      message: 'Failed to update salon settings',
      error: error.message
    });
  }
});

// Update a salon (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    // Check if the user owns this salon
    if (salon.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      name,
      description,
      address,
      phone,
      email,
      images,
      services,
      opening_time,
      closing_time
    } = req.body;

    salon.name = name || salon.name;
    salon.description = description || salon.description;
    salon.address = address || salon.address;
    salon.phone = phone || salon.phone;
    salon.email = email || salon.email;
    salon.images = images || salon.images;
    salon.services = services || salon.services;
    salon.opening_time = opening_time || salon.opening_time;
    salon.closing_time = closing_time || salon.closing_time;

    await salon.save();
    res.json(salon);
  } catch (error) {
    console.error('Error updating salon:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a salon (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const salon = await Salon.findById(req.params.id);

    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    // Check if the user owns this salon
    if (salon.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await salon.remove();
    res.json({ message: 'Salon deleted' });
  } catch (error) {
    console.error('Error deleting salon:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 