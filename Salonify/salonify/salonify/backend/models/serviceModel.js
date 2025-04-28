const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    salon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: 5,
      comment: 'Duration in minutes'
    },
    // Additional fields for enhanced functionality
    image: {
      type: String,
      default: 'default-service.jpg'
    },
    category: {
      type: String,
      enum: ['Hair', 'Nail', 'Facial', 'Massage', 'Makeup', 'Other'],
      default: 'Other'
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service; 