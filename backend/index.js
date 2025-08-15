import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from './routes/auth.routes.js'
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import chairmanroutes from './routes/eventRoutes.js'
import lostFoundRoutes from "./routes/lostfound.routes.js";
import RidesRouter from "./routes/rides.routes.js";
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
import connectDB from "./config/db.js";
connectDB();

// Routes placeholder
app.use("/auth", authRoutes);
app.use("/admin-auth",adminRoutes)
app.use("/user", userRoutes);
app.use("/chair",chairmanroutes)
app.use("/lostFound",lostFoundRoutes)
app.use("/ride",RidesRouter)
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
