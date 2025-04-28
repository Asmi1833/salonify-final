/* global require, module */

const Salon = require('../models/salonModel');

/**
 * @desc    Create a new salon
 * @route   POST /api/salons
 * @access  Private/SalonOwner
 */
const createSalon = async (req, res) => {
  const { name, address, phone, opening_time, closing_time, description } = req.body;

  // Create salon with owner being the current user
  const salon = await Salon.create({
    owner_id: req.user._id,
    name,
    address,
    phone,
    opening_time,
    closing_time,
    description
  });

  if (salon) {
    res.status(201).json(salon);
  } else {
    res.status(400);
    throw new Error('Invalid salon data');
  }
};

/**
 * @desc    Get all salons
 * @route   GET /api/salons
 * @access  Public
 */
const getSalons = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i'
        }
      }
    : {};

  const count = await Salon.countDocuments({ ...keyword });
  const salons = await Salon.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    salons,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
};

/**
 * @desc    Get salon by ID
 * @route   GET /api/salons/:id
 * @access  Public
 */
const getSalonById = async (req, res) => {
  const salon = await Salon.findById(req.params.id)
    .populate('services')
    .populate('staff');

  if (salon) {
    res.json(salon);
  } else {
    res.status(404);
    throw new Error('Salon not found');
  }
};

/**
 * @desc    Update salon
 * @route   PUT /api/salons/:id
 * @access  Private/SalonOwner/Admin
 */
const updateSalon = async (req, res) => {
  const {
    name,
    address,
    phone,
    opening_time,
    closing_time,
    description,
    image
  } = req.body;

  const salon = await Salon.findById(req.params.id);

  if (salon) {
    // Check if user is owner or admin
    if (
      salon.owner_id.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this salon');
    }

    salon.name = name || salon.name;
    salon.address = address || salon.address;
    salon.phone = phone || salon.phone;
    salon.opening_time = opening_time || salon.opening_time;
    salon.closing_time = closing_time || salon.closing_time;
    salon.description = description || salon.description;
    salon.image = image || salon.image;

    const updatedSalon = await salon.save();
    res.json(updatedSalon);
  } else {
    res.status(404);
    throw new Error('Salon not found');
  }
};

/**
 * @desc    Delete salon
 * @route   DELETE /api/salons/:id
 * @access  Private/SalonOwner/Admin
 */
const deleteSalon = async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (salon) {
    // Check if user is owner or admin
    if (
      salon.owner_id.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this salon');
    }

    await salon.deleteOne();
    res.json({ message: 'Salon removed' });
  } else {
    res.status(404);
    throw new Error('Salon not found');
  }
};

/**
 * @desc    Get salons owned by current user
 * @route   GET /api/salons/mysalons
 * @access  Private/SalonOwner
 */
const getMySalons = async (req, res) => {
  const salons = await Salon.find({ owner_id: req.user._id });
  res.json(salons);
};


const updateSalonSettings = function (req, res) {
  var body = req.body;

  Salon.findOneAndUpdate(
    { owner_id: body.owner_id },
    { $set: body },
    { new: true, upsert: true },
    function (err, updatedSalon) {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: 'Failed to update salon settings'
        });
      }

      res.status(200).json({
        success: true,
        salon: updatedSalon
      });
    }
  );
};


module.exports = {
  createSalon,
  getSalons,
  getSalonById,
  updateSalon,
  deleteSalon,
  getMySalons,
  updateSalonSettings
}; 