const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    salon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true
    },
    staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    appointment_date: {
      type: Date,
      required: true
    },
    start_time: {
      type: String,
      required: true
    },
    end_time: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Canceled'],
      default: 'Pending'
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    // Additional fields for enhanced functionality
    notes: {
      type: String,
      trim: true
    },
    reminder_sent: {
      type: Boolean,
      default: false
    },
    cancellation_reason: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for payment related to this appointment
appointmentSchema.virtual('payment', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'appointment_id',
  justOne: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; 