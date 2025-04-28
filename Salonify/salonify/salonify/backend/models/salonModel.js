
/* global require, module */
const mongoose = require('mongoose');

var salonSchema = new mongoose.Schema(
  {
    owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Salon name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Salon address is required']
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    opening_time: {
      type: String,
      required: [true, 'Opening time is required']
    },
    closing_time: {
      type: String,
      required: [true, 'Closing time is required']
    },
    openingHours: {
      type: Object,
      default: {}
    },
    paymentMethods: {
      type: Object,
      default: {
        cash: true,
        card: true,
        upi: false,
        wallet: false
      }
    },
    images: {
      type: [String],
      default: []
    },
    image: {
      type: String,
      default: 'default-salon.jpg'
    },
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model('Salon', salonSchema);
