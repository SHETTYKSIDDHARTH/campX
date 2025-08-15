import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  usn: { type: String, required: true }, // Student/Chairman unique ID
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["student", "club_chairman", "admin"], 
    default: "student" 
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  }
}, { timestamps: true });

// Hash password before saving

const User = mongoose.model("User", userSchema);
export default User;
