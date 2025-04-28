const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    salon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Staff name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['Hairdresser', 'Beautician', 'Other'],
      default: 'Other'
    },
    availability: {
      type: String,
      get: function(data) {
        try {
          return JSON.parse(data);
        } catch (err) {
          return data;
        }
      },
      set: function(data) {
        return JSON.stringify(data);
      }
    },
    // Additional fields for enhanced functionality
    image: {
      type: String,
      default: 'default-staff.jpg'
    },
    bio: {
      type: String,
      trim: true
    },
    specialties: [String],
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
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

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff; 