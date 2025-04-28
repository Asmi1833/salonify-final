const Service = require('../models/serviceModel');
const Salon = require('../models/salonModel');

/**
 * @desc    Create a new service
 * @route   POST /api/services
 * @access  Private/SalonOwner
 */
const createService = async (req, res) => {
  const { salon_id, name, description, price, duration, category } = req.body;

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
    throw new Error('Not authorized to add services to this salon');
  }

  // Create service
  const service = await Service.create({
    salon_id,
    name,
    description,
    price,
    duration,
    category
  });

  if (service) {
    res.status(201).json(service);
  } else {
    res.status(400);
    throw new Error('Invalid service data');
  }
};

/**
 * @desc    Get all services for a salon
 * @route   GET /api/services/salon/:salonId
 * @access  Public
 */
const getSalonServices = async (req, res) => {
  const { salonId } = req.params;
  
  // Check if salon exists
  const salon = await Salon.findById(salonId);
  if (!salon) {
    res.status(404);
    throw new Error('Salon not found');
  }
  
  // Get services for the salon
  const services = await Service.find({ salon_id: salonId });
  res.json(services);
};

/**
 * @desc    Get service by ID
 * @route   GET /api/services/:id
 * @access  Public
 */
const getServiceById = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (service) {
    res.json(service);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
};

/**
 * @desc    Update service
 * @route   PUT /api/services/:id
 * @access  Private/SalonOwner/Admin
 */
const updateService = async (req, res) => {
  const {
    name,
    description,
    price,
    duration,
    category,
    image,
    isPopular,
    isActive
  } = req.body;

  const service = await Service.findById(req.params.id);

  if (service) {
    // Check if user is the salon owner or admin
    const salon = await Salon.findById(service.salon_id);
    
    if (
      salon.owner_id.toString() !== req.user._id.toString() && 
      req.user.role !== 'Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this service');
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price !== undefined ? price : service.price;
    service.duration = duration !== undefined ? duration : service.duration;
    service.category = category || service.category;
    service.image = image || service.image;
    service.isPopular = isPopular !== undefined ? isPopular : service.isPopular;
    service.isActive = isActive !== undefined ? isActive : service.isActive;

    const updatedService = await service.save();
    res.json(updatedService);
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
};

/**
 * @desc    Delete service
 * @route   DELETE /api/services/:id
 * @access  Private/SalonOwner/Admin
 */
const deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (service) {
    // Check if user is the salon owner or admin
    const salon = await Salon.findById(service.salon_id);
    
    if (
      salon.owner_id.toString() !== req.user._id.toString() && 
      req.user.role !== 'Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to delete this service');
    }

    await service.deleteOne();
    res.json({ message: 'Service removed' });
  } else {
    res.status(404);
    throw new Error('Service not found');
  }
};

/**
 * @desc    Get popular services
 * @route   GET /api/services/popular
 * @access  Public
 */
const getPopularServices = async (req, res) => {
  const services = await Service.find({ isPopular: true, isActive: true })
    .limit(10)
    .populate({
      path: 'salon_id',
      select: 'name address image rating'
    });
  
  res.json(services);
};

module.exports = {
  createService,
  getSalonServices,
  getServiceById,
  updateService,
  deleteService,
  getPopularServices
}; 