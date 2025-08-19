import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  driver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  departure: { 
    type: Date, 
    required: true 
  },
  from: { 
    type: String, 
    required: true,
    trim: true
  },
  to: { 
    type: String, 
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  via: [
    {
      location: { 
        type: String, 
        required: true,
        trim: true
      },
      price: { 
        type: Number, 
        required: true,
        min: 0
      },
    }
  ],
  status: {
    type: String,
    enum: ["listed", "booking_accepted", "cancelled"],
    default: "listed",
  },
  seatsAvailable: {
    type: Number,
    default: 4,
    min: 1,
    max: 8
  }
}, { 
  timestamps: true 
});


rideSchema.index({ driver: 1, status: 1 });
rideSchema.index({ from: 1, to: 1, departure: 1 });
rideSchema.index({ status: 1, departure: 1 });

// Auto-deleting rides after 8 PM of the departure day
rideSchema.pre("save", function(next) {
  if (this.isNew || this.isModified('departure')) {
    const departureDate = this.departure;
    const eightPM = new Date(departureDate);
    eightPM.setHours(20, 0, 0, 0);

    
    if (eightPM.getTime() > Date.now()) {
      setTimeout(async () => {
        try {
          await mongoose.model("Ride").findByIdAndDelete(this._id);
          console.log(`Auto-deleted ride ${this._id} after departure time`);
        } catch (error) {
          console.error(`Error auto-deleting ride ${this._id}:`, error);
        }
      }, eightPM.getTime() - Date.now());
    }
  }
  next();
});


rideSchema.virtual('isExpired').get(function() {
  const eightPM = new Date(this.departure);
  eightPM.setHours(20, 0, 0, 0);
  return Date.now() > eightPM.getTime();
});

export default mongoose.model("Ride", rideSchema);