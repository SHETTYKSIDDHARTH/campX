import mongoose from "mongoose";

const otpRequestSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true, index: { expires: 0 } },
  data: {
    type: Object, // temporarily stores signup info: name, usn, password, role
    required: true
  }
}, { timestamps: true });

const OtpRequest = mongoose.model("OtpRequest", otpRequestSchema);
export default OtpRequest;
