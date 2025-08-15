import mongoose from "mongoose";

const rideBookingSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
  passenger: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  destination: { type: String, required: true }, // chosen "to" or one of the via locations
  price: { type: Number, required: true }, // price for that destination
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "cancelled"],
    default: "pending",
  }
}, { timestamps: true });

// Prevent same passenger from requesting the same ride twice
rideBookingSchema.index({ ride: 1, passenger: 1 }, { unique: true });

export default mongoose.model("RideBooking", rideBookingSchema);
