import User from "../models/user.model.js";
import OtpRequest from "../models/otpRequest.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

// Step 1: Send OTP to user
export const sendPasswordOtp = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

    await OtpRequest.deleteMany({ email });
    await OtpRequest.create({ email, otp, otpExpiry, data: {} });

    await transporter.sendMail({
      from: `"CampX Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It will expire in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Step 2: Verify OTP and set new password
export const resetPasswordWithOtp = async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "All fields are required" });

    email = email.toLowerCase();
    const otpReq = await OtpRequest.findOne({ email });
    if (!otpReq) return res.status(400).json({ message: "No OTP request found" });
    if (otpReq.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (otpReq.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ email }, { password: hashedPassword });
    await OtpRequest.deleteOne({ email });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Step 1: Send OTP to confirm account deletion
export const sendDeleteOtp = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

    await OtpRequest.deleteMany({ email });
    await OtpRequest.create({ email, otp, otpExpiry, data: {} });

    await transporter.sendMail({
      from: `"CampX Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Account Deletion OTP",
      text: `Your OTP to delete your account is ${otp}. It expires in 5 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending delete OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Step 2: Verify OTP and delete account
export const deleteAccount = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    email = email.toLowerCase();
    const otpReq = await OtpRequest.findOne({ email });
    if (!otpReq) return res.status(400).json({ message: "No OTP request found" });
    if (otpReq.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (otpReq.otpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });

    await User.deleteOne({ email });
    await OtpRequest.deleteOne({ email });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//View profile


export const viewProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
