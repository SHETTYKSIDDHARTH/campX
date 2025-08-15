import express from "express";
import multer from "multer";
import {
  createLostFound,
  listLostFound,
  listMyLostFound,
  getLostFound,
  updateLostFound,
  deleteLostFound,
  createClaim,
  listClaimsForItem,
  decideClaim,
} from "../controller/lostfound.controller.js"; // corrected file name casing
import { authMiddleware } from "../middleware/auth.middleware.js";

const lostFoundRoutes = express.Router();
const upload = multer({ dest: "uploads/" });

// -------- Public Routes --------
lostFoundRoutes.get("/", listLostFound); // list all with filters & pagination
lostFoundRoutes.get("/:id", getLostFound); // get single item details

// -------- Authenticated User Routes --------
lostFoundRoutes.get("/mine/list", authMiddleware, listMyLostFound); // user’s own posts
lostFoundRoutes.post("/", authMiddleware, upload.single("image"), createLostFound);
lostFoundRoutes.put("/:id", authMiddleware, upload.single("image"), updateLostFound);
lostFoundRoutes.delete("/:id", authMiddleware, deleteLostFound);

// -------- Claims --------
lostFoundRoutes.post("/:id/claims", authMiddleware, createClaim); // create a claim
lostFoundRoutes.get("/:id/claims", authMiddleware, listClaimsForItem); // list claims (owner/admin only)
lostFoundRoutes.post("/:id/claims/:claimId/decision", authMiddleware, decideClaim); // accept/reject claim

export default lostFoundRoutes;
