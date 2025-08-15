import OtpRequest from "../models/otpRequest.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config();

// OTP Generator
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// SMTP transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendOtp = async (req, res) => {
  try {
    let { name, email, usn, password, role } = req.body;
    if(name && email && usn && password && role) {
      email = email.toLowerCase().trim();

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email already registered" });

      const otp = generateOtp();
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins expiry

      await OtpRequest.deleteMany({ email });

      await OtpRequest.create({
        email,
        otp,
        otpExpiry,
        data: { name, email, usn, password, role },
      });

      await transporter.sendMail({
        from: `"CampX Verification" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your CampX Signup OTP",
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      });

      res.status(200).json({ message: "OTP sent to email" });
    } else {
      res.status(400).json({ message: "Data missing" });
    }
  } catch (error) {
    console.error("Error in sendOtp:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    email = email.toLowerCase().trim();

    const otpReq = await OtpRequest.findOne({ email });
    if (!otpReq)
      return res.status(400).json({ message: "No OTP request found for this email" });

    if (otpReq.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (otpReq.otpExpiry < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const { name, usn, password, role } = otpReq.data;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      usn,
      password: hashedPassword,
      role,
      status: "pending", // admin approval required
    });

    await OtpRequest.deleteOne({ email });

    res.status(201).json({ message: "Signup successful, pending admin approval" });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    res.status(500).json({ message: "Server error" });
  }
};
