/* global require, module */

const Appointment = require('../models/appointmentModel');
const Staff = require('../models/staffModel');
const Payment = require('../models/paymentModel');
const Salon = require('../models/salonModel');

/**
 * @desc    Get commission data for salon staff
 * @route   GET /api/commission/tracking
 * @access  Private/SalonOwner
 */
const getCommissionData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Get the salon owned by the user
    const salon = await Salon.findOne({ owner_id: req.user._id });
    if (!salon) {
      res.status(404);
      throw new Error('Salon not found');
    }

    // Get all staff members for the salon
    const staffMembers = await Staff.find({ salon_id: salon._id });
    
    // Get all appointments for the salon within the date range
    const appointments = await Appointment.find({
      salon_id: salon._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('service_id', 'name price');

    // Get all payments for these appointments
    const payments = await Payment.find({
      appointment_id: { $in: appointments.map(app => app._id) }
    });

    // Process staff data with their appointments and commissions
    const staffData = await Promise.all(staffMembers.map(async (staff) => {
      // Filter appointments for this staff member
      const staffAppointments = appointments.filter(app => 
        app.staff_id.toString() === staff._id.toString()
      );

      // Calculate commissions for each appointment
      const appointmentsWithCommission = staffAppointments.map(appointment => {
        const payment = payments.find(p => 
          p.appointment_id.toString() === appointment._id.toString()
        );

        if (!payment || payment.status !== 'Paid') {
          return null;
        }

        const commission = (appointment.service_id.price * staff.commission_rate) / 100;

        return {
          id: appointment._id,
          date: appointment.date,
          service: appointment.service_id.name,
          amount: appointment.service_id.price,
          commission: commission
        };
      }).filter(Boolean); // Remove null entries

      return {
        id: staff._id,
        name: staff.name,
        role: staff.role,
        phone: staff.phone,
        image: staff.image || 'https://via.placeholder.com/150',
        baseSalary: staff.base_salary,
        commissionRate: staff.commission_rate,
        appointments: appointmentsWithCommission
      };
    }));

    res.json(staffData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommissionData
}; 