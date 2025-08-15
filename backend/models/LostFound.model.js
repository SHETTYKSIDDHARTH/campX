import mongoose from "mongoose";

const lostFoundSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    status: { type: String, enum: ["lost", "found"], required: true },
    contact: { type: String, required: true }, // phone/email to reach the lister
    imageUrl: { type: String },
    imagePublicId: { type: String }, // for Cloudinary deletes
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    isResolved: { type: Boolean, default: false },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

// TTL: auto-delete after 7 days
lostFoundSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

export default mongoose.model("LostFound", lostFoundSchema);
