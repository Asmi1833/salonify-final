const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String,
    required: true
  },
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    required: true
  },
  salonName: {
    type: String,
    required: true
  },
  services: [{
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    serviceName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      required: true
    }
  }],
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  staffName: {
    type: String
  },
  bookingDate: {
    type: Date,
    required: true
  },
  bookingTime: {
    type: String, // format: "HH:MM" in 24-hour
    required: true
  },
  endTime: {
    type: String, // format: "HH:MM" in 24-hour
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  totalDuration: {
    type: Number, // in minutes
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  paymentInfo: {
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Other']
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partially Paid', 'Paid'],
      default: 'Unpaid'
    },
    amountPaid: {
      type: Number,
      default: 0
    },
    transactionId: {
      type: String
    },
    paymentDate: {
      type: Date
    }
  },
  specialRequests: {
    type: String
  },
  source: {
    type: String,
    enum: ['Website', 'Mobile App', 'Walk-in', 'Phone', 'Other'],
    default: 'Website'
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  cancellationReason: {
    type: String
  },
  isRescheduled: {
    type: Boolean,
    default: false
  },
  previousBookingDate: {
    type: Date
  },
  previousBookingTime: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
bookingSchema.index({ customer: 1, bookingDate: -1 });
bookingSchema.index({ salon: 1, bookingDate: -1 });
bookingSchema.index({ status: 1, bookingDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema); 