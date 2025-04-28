const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
      ref: 'Staff'
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5
    },
    comments: {
      type: String,
      trim: true
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    // Additional fields for enhanced functionality
    photos: [String],
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    is_verified: {
      type: Boolean,
      default: false
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Static method to calculate average rating and update salon
reviewSchema.statics.calcAverageRating = async function(salonId) {
  const stats = await this.aggregate([
    {
      $match: { salon_id: salonId }
    },
    {
      $group: {
        _id: '$salon_id',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Salon').findByIdAndUpdate(salonId, {
      numReviews: stats[0].nRating,
      rating: stats[0].avgRating
    });
  } else {
    await mongoose.model('Salon').findByIdAndUpdate(salonId, {
      numReviews: 0,
      rating: 0
    });
  }
};

// Call calcAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.salon_id);
});

// Call calcAverageRating after update
reviewSchema.post(/^findOneAnd/, async function(doc) {
  if (doc) {
    await doc.constructor.calcAverageRating(doc.salon_id);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 