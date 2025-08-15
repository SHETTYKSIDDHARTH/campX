import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  departure: { type: Date, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  via: [
    {
      location: { type: String, required: true },
      price: { type: Number, required: true },
    }
  ],
  status: {
    type: String,
    enum: ["listed", "booking_accepted", "cancelled"],
    default: "listed",
  }
}, { timestamps: true });

// Auto-deleting rides after 8 PM of the departure day
rideSchema.pre("save", function(next) {
  const departureDate = this.departure;
  const eightPM = new Date(departureDate);
  eightPM.setHours(20, 0, 0, 0);

  if (departureDate <= eightPM) {
    setTimeout(async () => {
      await mongoose.model("Ride").findByIdAndDelete(this._id);
    }, eightPM.getTime() - Date.now());
  }
  next();
});

export default mongoose.model("Ride", rideSchema);
