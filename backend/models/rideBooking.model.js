import mongoose from 'mongoose';

const rideBookingSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destn: {
    type: String,
    required: true,
    trim: true
  },
  seatsBooked: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 4
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500,
    trim: true
  }
}, {
  timestamps: true
});

rideBookingSchema.index(
  { ride: 1, passenger: 1 }, 
  { 
    unique: true,
    partialFilterExpression: { 
      status: { $in: ['pending', 'accepted'] } 
    }
  }
);

rideBookingSchema.index({ ride: 1, status: 1 });
rideBookingSchema.index({ passenger: 1, status: 1 });
rideBookingSchema.index({ bookingDate: 1 });


rideBookingSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('totalPrice')) {
    if (!this.totalPrice || this.totalPrice <= 0) {
      const error = new Error('Total price must be greater than 0');
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

// Virtual to check if booking is active
rideBookingSchema.virtual('isActive').get(function() {
  return ['pending', 'accepted'].includes(this.status);
});

const RideBooking = mongoose.model('RideBooking', rideBookingSchema);

export default RideBooking;