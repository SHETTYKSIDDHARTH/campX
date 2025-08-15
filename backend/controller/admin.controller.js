import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Nodemailer transporter
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

// View all pending user requests
export const viewReq = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: "pending" }).select("-password");
    return res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return res.status(500).json({ message: "Error fetching pending users" });
  }
};

// Approve or Reject a user
export const handleUserApproval = async (req, res) => {
  try {
    const { email, action } = req.body;
    if (!email || !action) return res.status(400).json({ message: "Email and action required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    let mailOptions;

    if (action === "approve") {
      user.status = "approved";
      await user.save();

      mailOptions = {
        from: `"CampX Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Signup Approved",
        text: "Your account has been approved by the admin. You can now log in.",
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "User approved and notified via email" });

    } else if (action === "reject") {
      await User.deleteOne({ email: email.toLowerCase() });

      mailOptions = {
        from: `"CampX Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Signup Rejected",
        text: "Your signup request has been rejected by the admin.",
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "User rejected and notified via email" });

    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error handling user approval:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: `User with email ${email} doesn't exist` });
    }

    await User.deleteOne({ email: email.toLowerCase() });
    const mailOptions = {
      from: `"CampX Admin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Account Deleted",
      text: "Your account has been deleted by the admin.",
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "User deleted successfully and notified via email" });

  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
