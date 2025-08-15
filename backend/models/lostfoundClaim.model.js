import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "LostFound", required: true },
    claimer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, trim: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

// prevent duplicate claims by the same user on the same item
claimSchema.index({ item: 1, claimer: 1 }, { unique: true });

export default mongoose.model("LostFoundClaim", claimSchema);
