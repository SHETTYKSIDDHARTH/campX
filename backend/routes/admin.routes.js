import express from "express";
import { viewReq, handleUserApproval, deleteUser } from "../controller/admin.controller.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware.js";

const adminRoutes = express.Router();

adminRoutes.get("/pending-users", authMiddleware, adminMiddleware, viewReq);
adminRoutes.post("/approve-user/", authMiddleware, adminMiddleware, handleUserApproval);
adminRoutes.post("/delete-user",authMiddleware,adminMiddleware,deleteUser)
export default adminRoutes;
