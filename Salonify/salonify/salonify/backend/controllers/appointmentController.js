const Appointment = require('../models/appointmentModel');
const Service = require('../models/serviceModel');
const Staff = require('../models/staffModel');
const Salon = require('../models/salonModel');

/**
 * @desc    Create a new appointment
 * @route   POST /api/appointments
 * @access  Private
 */
const createAppointment = async (req, res) => {
  const {
    salon_id,
    staff_id,
    service_id,
    appointment_date,
    start_time,
    notes
  } = req.body;

  // Validate salon, staff, and service exist
  const salon = await Salon.findById(salon_id);
  if (!salon) {
    res.status(404);
    throw new Error('Salon not found');
  }

  const staff = await Staff.findById(staff_id);
  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }

  const service = await Service.findById(service_id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Calculate end time based on service duration
  const durationInMinutes = service.duration;
  const [startHour, startMinute] = start_time.split(':').map(Number);
  
  let endHour = startHour + Math.floor((startMinute + durationInMinutes) / 60);
  let endMinute = (startMinute + durationInMinutes) % 60;
  
  const end_time = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

  // Create the appointment
  const appointment = await Appointment.create({
    client_id: req.user._id,
    salon_id,
    staff_id,
    service_id,
    appointment_date,
    start_time,
    end_time,
    notes,
    status: 'Pending'
  });

  if (appointment) {
    res.status(201).json(appointment);
  } else {
    res.status(400);
    throw new Error('Invalid appointment data');
  }
};

/**
 * @desc    Get all client appointments
 * @route   GET /api/appointments/myappointments
 * @access  Private
 */
const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ client_id: req.user._id })
    .populate('salon_id', 'name address')
    .populate('staff_id', 'name')
    .populate('service_id', 'name price duration')
    .sort({ appointment_date: -1 });

  res.json(appointments);
};

/**
 * @desc    Get salon appointments
 * @route   GET /api/appointments/salon/:salonId
 * @access  Private/SalonOwner
 */
const getSalonAppointments = async (req, res) => {
  const { salonId } = req.params;
  
  // Check if salon exists and user is owner
  const salon = await Salon.findById(salonId);
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
    throw new Error('Not authorized to view salon appointments');
  }
  
  const appointments = await Appointment.find({ salon_id: salonId })
    .populate('client_id', 'name email phone')
    .populate('staff_id', 'name')
    .populate('service_id', 'name price duration')
    .sort({ appointment_date: -1, start_time: 1 });

  res.json(appointments);
};

/**
 * @desc    Get staff appointments
 * @route   GET /api/appointments/staff/:staffId
 * @access  Private/SalonOwner
 */
const getStaffAppointments = async (req, res) => {
  const { staffId } = req.params;
  
  // Check if staff exists
  const staff = await Staff.findById(staffId);
  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }
  
  // Check if user is the salon owner or admin
  const salon = await Salon.findById(staff.salon_id);
  if (
    salon.owner_id.toString() !== req.user._id.toString() && 
    req.user.role !== 'Admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to view staff appointments');
  }
  
  const appointments = await Appointment.find({ staff_id: staffId })
    .populate('client_id', 'name email phone')
    .populate('service_id', 'name price duration')
    .populate('salon_id', 'name')
    .sort({ appointment_date: 1, start_time: 1 });

  res.json(appointments);
};

/**
 * @desc    Get appointment by ID
 * @route   GET /api/appointments/:id
 * @access  Private
 */
const getAppointmentById = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('salon_id', 'name address phone')
    .populate('staff_id', 'name')
    .populate('service_id', 'name price duration')
    .populate('client_id', 'name email phone');

  if (appointment) {
    // Check if user is the client, salon owner, or admin
    if (
      appointment.client_id._id.toString() !== req.user._id.toString() &&
      appointment.salon_id.owner_id?.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to view this appointment');
    }
    
    res.json(appointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
};

/**
 * @desc    Update appointment status
 * @route   PUT /api/appointments/:id/status
 * @access  Private/SalonOwner/Admin
 */
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    // Check if user is salon owner or admin
    const salon = await Salon.findById(appointment.salon_id);
    
    if (
      salon.owner_id.toString() !== req.user._id.toString() && 
      req.user.role !== 'Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to update this appointment');
    }

    appointment.status = status || appointment.status;

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
};

/**
 * @desc    Cancel appointment
 * @route   PUT /api/appointments/:id/cancel
 * @access  Private
 */
const cancelAppointment = async (req, res) => {
  const { cancellation_reason } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    // Check if appointment can be canceled (not completed)
    if (appointment.status === 'Completed') {
      res.status(400);
      throw new Error('Cannot cancel a completed appointment');
    }

    // Check if user is the client, salon owner, or admin
    if (
      appointment.client_id.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to cancel this appointment');
    }

    appointment.status = 'Canceled';
    appointment.cancellation_reason = cancellation_reason || 'Canceled by client';

    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
};

/**
 * @desc    Delete appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private/Admin
 */
const deleteAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    await appointment.deleteOne();
    res.json({ message: 'Appointment removed' });
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getSalonAppointments,
  getStaffAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment
}; 