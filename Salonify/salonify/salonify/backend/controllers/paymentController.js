const Payment = require('../models/paymentModel');
const Appointment = require('../models/appointmentModel');
const Service = require('../models/serviceModel');
const Salon = require('../models/salonModel');

/**
 * @desc    Create a new payment
 * @route   POST /api/payments
 * @access  Private
 */
const createPayment = async (req, res) => {
  const { appointment_id, payment_method, transaction_id } = req.body;

  // Validate appointment exists
  const appointment = await Appointment.findById(appointment_id)
    .populate('service_id');
  
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Verify if user is the client for the appointment
  if (appointment.client_id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to make payment for this appointment');
  }

  // Check if payment already exists
  const existingPayment = await Payment.findOne({ appointment_id });
  if (existingPayment && existingPayment.status === 'Paid') {
    res.status(400);
    throw new Error('Payment already completed for this appointment');
  }

  // Create payment record
  const payment = await Payment.create({
    appointment_id,
    client_id: req.user._id,
    amount: appointment.service_id.price,
    payment_method,
    transaction_id,
    status: 'Paid',
    payment_date: Date.now()
  });

  if (payment) {
    // Update appointment status to Confirmed
    appointment.status = 'Confirmed';
    await appointment.save();
    
    res.status(201).json(payment);
  } else {
    res.status(400);
    throw new Error('Invalid payment data');
  }
};

/**
 * @desc    Get all payments for a client
 * @route   GET /api/payments/mypayments
 * @access  Private
 */
const getMyPayments = async (req, res) => {
  const payments = await Payment.find({ client_id: req.user._id })
    .populate({
      path: 'appointment_id',
      populate: [
        { path: 'service_id', select: 'name' },
        { path: 'salon_id', select: 'name' }
      ]
    })
    .sort({ created_at: -1 });

  res.json(payments);
};

/**
 * @desc    Get payment by ID
 * @route   GET /api/payments/:id
 * @access  Private
 */
const getPaymentById = async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate({
      path: 'appointment_id',
      populate: [
        { path: 'service_id', select: 'name price' },
        { path: 'salon_id', select: 'name address' },
        { path: 'staff_id', select: 'name' }
      ]
    })
    .populate('client_id', 'name email');

  if (payment) {
    // Verify if user is the client or salon owner or admin
    if (
      payment.client_id._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'Admin'
    ) {
      // Check if user is salon owner
      const salon = await Salon.findById(payment.appointment_id.salon_id);
      if (!salon || salon.owner_id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this payment');
      }
    }
    
    res.json(payment);
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
};

/**
 * @desc    Get all payments for a salon
 * @route   GET /api/payments/salon/:salonId
 * @access  Private/SalonOwner
 */
const getSalonPayments = async (req, res) => {
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
    throw new Error('Not authorized to view salon payments');
  }
  
  // Find all appointments for the salon
  const appointments = await Appointment.find({ salon_id: salonId }).select('_id');
  const appointmentIds = appointments.map(app => app._id);
  
  // Find payments for those appointments
  const payments = await Payment.find({ appointment_id: { $in: appointmentIds } })
    .populate('client_id', 'name email')
    .populate({
      path: 'appointment_id',
      populate: { path: 'service_id', select: 'name' }
    })
    .sort({ created_at: -1 });

  res.json(payments);
};

/**
 * @desc    Update payment
 * @route   PUT /api/payments/:id
 * @access  Private/Admin
 */
const updatePayment = async (req, res) => {
  const { status, refunded, refund_reason } = req.body;

  const payment = await Payment.findById(req.params.id);

  if (payment) {
    payment.status = status || payment.status;
    payment.refunded = refunded !== undefined ? refunded : payment.refunded;
    payment.refund_reason = refund_reason || payment.refund_reason;

    const updatedPayment = await payment.save();
    
    // If payment was refunded, update appointment status
    if (refunded === true) {
      const appointment = await Appointment.findById(payment.appointment_id);
      if (appointment) {
        appointment.status = 'Canceled';
        await appointment.save();
      }
    }
    
    res.json(updatedPayment);
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
};

/**
 * @desc    Delete payment
 * @route   DELETE /api/payments/:id
 * @access  Private/Admin
 */
const deletePayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (payment) {
    await payment.deleteOne();
    res.json({ message: 'Payment removed' });
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
};

module.exports = {
  createPayment,
  getMyPayments,
  getPaymentById,
  getSalonPayments,
  updatePayment,
  deletePayment
}; 