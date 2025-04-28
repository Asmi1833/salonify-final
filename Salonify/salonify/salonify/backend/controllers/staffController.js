const Staff = require('../models/staffModel');
const Salon = require('../models/salonModel');

/**
 * @desc    Add staff to salon
 * @route   POST /api/staff
 * @access  Private/SalonOwner
 */
const addStaff = async (req, res) => {
  const {
    salon_id,
    name,
    phone,
    email,
    role,
    availability,
    bio,
    specialties
  } = req.body;

  // Check if the salon exists and the user is the owner
  const salon = await Salon.findById(salon_id);
  
  if (!salon) {
    res.status(404);
    throw new Error('Salon not found');
  }
  
  // Check if user is the salon owner or admin
  if (
    salon.owner_id.toString() !== req.user._id.toString() && 
    req.user.role !== 'Admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to add staff to this salon');
  }

  // Create staff member
  const staff = await Staff.create({
    salon_id,
    name,
    phone,
    email,
    role,
    availability,
    bio,
    specialties
  });

  if (staff) {
    res.status(201).json(staff);
  } else {
    res.status(400);
    throw new Error('Invalid staff data');
  }
};

/**
 * @desc    Get all staff for a salon
 * @route   GET /api/staff/salon/:salonId
 * @access  Public
 */
const getSalonStaff = async (req, res) => {
  const { salonId } = req.params;
  
  // Check if salon exists
  const salon = await Salon.findById(salonId);
  if (!salon) {
    res.status(404);
    throw new Error('Salon not found');
  }
  
  // Get staff for the salon
  const staff = await Staff.find({ salon_id: salonId, isActive: true });
  res.json(staff);
};

/**
 * @desc    Get staff by ID
 * @route   GET /api/staff/:id
 * @access  Public
 */
const getStaffById = async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (staff) {
    res.json(staff);
  } else {
    res.status(404);
    throw new Error('Staff not found');
  }
};

/**
 * @desc    Update staff
 * @route   PUT /api/staff/:id
 * @access  Private/SalonOwner/Admin
 */
const updateStaff = async (req, res) => {
  const {
    name,
    phone,
    email,
    role,
    availability,
    bio,
    specialties,
    image,
    isActive
  } = req.body;

  const staff = await Staff.findById(req.params.id);

  if (staff) {
    // Check if user is the salon owner or admin
    const salon = await Salon.findById(staff.salon_id);
    
    if (
      salon.owner_id.toString() !== req.user._id.toString() && 
      req.user.role !== 'Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this staff');
    }

    staff.name = name || staff.name;
    staff.phone = phone || staff.phone;
    staff.email = email || staff.email;
    staff.role = role || staff.role;
    staff.availability = availability || staff.availability;
    staff.bio = bio || staff.bio;
    staff.specialties = specialties || staff.specialties;
    staff.image = image || staff.image;
    staff.isActive = isActive !== undefined ? isActive : staff.isActive;

    const updatedStaff = await staff.save();
    res.json(updatedStaff);
  } else {
    res.status(404);
    throw new Error('Staff not found');
  }
};

/**
 * @desc    Delete staff
 * @route   DELETE /api/staff/:id
 * @access  Private/SalonOwner/Admin
 */
const deleteStaff = async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (staff) {
    // Check if user is the salon owner or admin
    const salon = await Salon.findById(staff.salon_id);
    
    if (
      salon.owner_id.toString() !== req.user._id.toString() && 
      req.user.role !== 'Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this staff');
    }

    await staff.deleteOne();
    res.json({ message: 'Staff removed' });
  } else {
    res.status(404);
    throw new Error('Staff not found');
  }
};

/**
 * @desc    Get staff availability
 * @route   GET /api/staff/:id/availability
 * @access  Public
 */
const getStaffAvailability = async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (staff) {
    res.json({
      _id: staff._id,
      name: staff.name,
      availability: staff.availability
    });
  } else {
    res.status(404);
    throw new Error('Staff not found');
  }
};

module.exports = {
  addStaff,
  getSalonStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getStaffAvailability
}; 