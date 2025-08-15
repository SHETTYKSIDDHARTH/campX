import express from "express";
import { sendPasswordOtp, resetPasswordWithOtp,sendDeleteOtp,deleteAccount,viewProfile} from "../controller/user.controller.js";
import { authMiddleware, studentMiddleware } from "../middleware/auth.middleware.js";
import { registerForEvent,getEvents } from "../controller/eventController.js";

const userRoutes = express.Router();

// Send OTP for password reset
userRoutes.post("/send-password-otp", sendPasswordOtp);

// Reset password using OTP
userRoutes.post("/reset-password", resetPasswordWithOtp);

//Update profile
// Acc delete otp req
userRoutes.post("/send-delete-otp",sendDeleteOtp)
userRoutes.post("/delete-account",deleteAccount)

//view profile
userRoutes.get("/profile",authMiddleware,viewProfile)

userRoutes.get("/events/:id/register",authMiddleware,registerForEvent)
userRoutes.get("/events", getEvents);

export default userRoutes;
