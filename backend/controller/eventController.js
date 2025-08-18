import Event from "../models/event.model.js";
import cloudinary from "cloudinary";
import fs from "fs";
import XLSX from "xlsx";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createEvent = async (req, res) => {
  try {
    let posterUrl = "";
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "event_posters"
      });
      posterUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const event = await Event.create({
      title: req.body.title,
      date: req.body.date,
      description: req.body.description,
      poster: posterUrl,
      createdBy: req.user._id
    });

    res.status(201).json(event);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.participants.includes(req.user._id)) {
      return res.status(400).json({ error: "Already registered" });
    }

    event.participants.push(req.user._id);
    await event.save();

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const exportParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("participants", "name email usn");
    if (!event) return res.status(404).json({ error: "Event not found" });

    const data = event.participants.map(p => ({
      Name: p.name,
      Email: p.email,
      USN: p.usn
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");

    const filePath = `./${event.title}_participants.xlsx`;
    XLSX.writeFile(wb, filePath);

    res.download(filePath, () => fs.unlinkSync(filePath));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Ensure only the creator (chairman) can update
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can only update your own events" });
    }

    let posterUrl = event.poster; 
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "event_posters"
      });
      posterUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    // Update only provided fields
    if (req.body.title) event.title = req.body.title;
    if (req.body.date) event.date = req.body.date;
    if (req.body.description) event.description = req.body.description;
    event.poster = posterUrl;

    await event.save();

    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Ensure only the creator (chairman) can delete
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can only delete your own events" });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get club events
export const getmyevents = async (req, res) => {
  try {
    const id = req.user._id.toString();
    const data = await Event.find({ createdBy: id });

    return res.status(200).json({ message: data });
  } catch (error) {
    console.error("Error while loading your event:", error);
    return res.status(400).json({ message: error.message });
  }
};
