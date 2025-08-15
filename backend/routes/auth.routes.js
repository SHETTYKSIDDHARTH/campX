import express from 'express'
import { sendOtp,verifyOtp } from '../controller/auth.controller.js'
import userLogin from '../controller/login.controller.js'
const authRoutes = express.Router();

authRoutes.post('/send-otp',sendOtp); //signup initial step
authRoutes.post('/verify-otp',verifyOtp); //signup final step
authRoutes.post('/login',userLogin)
export default authRoutes;