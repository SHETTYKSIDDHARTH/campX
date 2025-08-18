import express from "express";
import multer from "multer";
import { createEvent, exportParticipants,deleteEvent,updateEvent, getEvents,getmyevents } from "../controller/eventController.js";
import { authMiddleware,chairmanMiddleware} from "../middleware/auth.middleware.js";

const chairmanroutes = express.Router();
const upload = multer({ dest: "uploads/" });

chairmanroutes.post("/postevent", authMiddleware, chairmanMiddleware, upload.single("poster"), createEvent);
chairmanroutes.get("/:id/export", authMiddleware, chairmanMiddleware, exportParticipants);

chairmanroutes.get("/getAll-events",authMiddleware,getEvents);
// Update event
chairmanroutes.put(
  "/:id", 
  authMiddleware, 
  chairmanMiddleware, 
  upload.single("poster"), 
  updateEvent);

// Delete event
chairmanroutes.delete(
  "/:id", 
  authMiddleware, 
  chairmanMiddleware, 
  deleteEvent
);

chairmanroutes.get("/getMyevents/:id",authMiddleware,chairmanMiddleware,getmyevents);
export default chairmanroutes;
