const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true
    },
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 0
    },
    payment_method: {
      type: String,
      enum: ['CreditCard', 'PayPal', 'Cash'],
      default: 'Cash'
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed'],
      default: 'Pending'
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    // Additional fields for enhanced functionality
    transaction_id: {
      type: String,
      trim: true
    },
    payment_date: {
      type: Date
    },
    receipt_url: {
      type: String
    },
    refunded: {
      type: Boolean,
      default: false
    },
    refund_reason: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment; 