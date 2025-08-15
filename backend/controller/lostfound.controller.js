import fs from "fs";
import cloudinary from "cloudinary";
import LostFound from "../models/LostFound.model.js";
import LostFoundClaim from "../models/lostfoundClaim.model.js";
import nodemailer from "nodemailer";

// --- Cloudinary config (env must be set) ---
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Mailer setup ---
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  tls: { rejectUnauthorized: false },
});

// --- Utility: only owner or admin can modify ---
const ensureOwnerOrAdmin = (docUserId, reqUser) =>
  reqUser.role === "admin" || docUserId.toString() === reqUser._id.toString();

// CREATE lost/found post
export const createLostFound = async (req, res) => {
  try {
    const { title, description, location, status, contact } = req.body;

    if (!title || !description || !location || !status || !contact) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (req.file) {
      const upload = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "campx/lostfound",
      });
      imageUrl = upload.secure_url;
      imagePublicId = upload.public_id;
      fs.unlinkSync(req.file.path);
    }

    const item = await LostFound.create({
      title,
      description,
      location,
      status,
      contact,
      imageUrl,
      imagePublicId,
      uploadedBy: req.user._id,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("createLostFound error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LIST items (public) with filters + pagination
export const listLostFound = async (req, res) => {
  try {
    const { status, q, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && ["lost", "found"].includes(status)) filter.status = status;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      LostFound.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("uploadedBy", "name email role"),
      LostFound.countDocuments(filter),
    ]);

    res.json({
      items,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (err) {
    console.error("listLostFound error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LIST my own posts
export const listMyLostFound = async (req, res) => {
  try {
    const items = await LostFound.find({ uploadedBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch (err) {
    console.error("listMyLostFound error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single item
export const getLostFound = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id).populate(
      "uploadedBy",
      "name email"
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error("getLostFound error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE item
export const updateLostFound = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!ensureOwnerOrAdmin(item.uploadedBy, req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, location, status, contact, isResolved } =
      req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (location) item.location = location;
    if (status && ["lost", "found"].includes(status)) item.status = status;
    if (contact) item.contact = contact;

    if (typeof isResolved !== "undefined") {
      const resolvedBool = isResolved === true || isResolved === "true";
      item.isResolved = resolvedBool;
      if (resolvedBool) {
        item.resolvedBy = req.user._id;
        item.resolvedAt = new Date();
      } else {
        item.resolvedBy = undefined;
        item.resolvedAt = undefined;
      }
    }

    if (req.file) {
      if (item.imagePublicId) {
        try {
          await cloudinary.v2.uploader.destroy(item.imagePublicId);
        } catch {}
      }
      const upload = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "campx/lostfound",
      });
      item.imageUrl = upload.secure_url;
      item.imagePublicId = upload.public_id;
      fs.unlinkSync(req.file.path);
    }

    await item.save();
    res.json({ message: "Updated successfully", item });
  } catch (err) {
    console.error("updateLostFound error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE item
export const deleteLostFound = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!ensureOwnerOrAdmin(item.uploadedBy, req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (item.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(item.imagePublicId);
      } catch {}
    }

    await LostFound.findByIdAndDelete(item._id);
    await LostFoundClaim.deleteMany({ item: item._id });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteLostFound error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// CLAIM: create claim
export const createClaim = async (req, res) => {
  try {
    const { message } = req.body;
    const item = await LostFound.findById(req.params.id).populate(
      "uploadedBy",
      "email name"
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    if (item.isResolved)
      return res.status(400).json({ message: "Item already resolved" });

    if (item.uploadedBy._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot claim your own item" });
    }

    const claim = await LostFoundClaim.create({
      item: item._id,
      claimer: req.user._id,
      message: message || "",
    });

    try {
      await transporter.sendMail({
        from: `"CampX Lost & Found" <${process.env.EMAIL_USER}>`,
        to: item.uploadedBy.email,
        subject: `New claim on your "${item.title}" post`,
        text: `You have a new claim from ${req.user.name || req.user.email}.`,
      });
    } catch {}

    res.status(201).json({ message: "Claim submitted", claim });
  } catch (err) {
    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ message: "You already claimed this item" });
    }
    console.error("createClaim error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LIST claims for item
export const listClaimsForItem = async (req, res) => {
  try {
    const item = await LostFound.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!ensureOwnerOrAdmin(item.uploadedBy, req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const claims = await LostFoundClaim.find({ item: item._id }).populate(
      "claimer",
      "name email usn"
    );
    res.json(claims);
  } catch (err) {
    console.error("listClaimsForItem error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DECIDE claim
export const decideClaim = async (req, res) => {
  try {
    const { action } = req.body; // accept | reject
    const item = await LostFound.findById(req.params.id).populate(
      "uploadedBy",
      "email"
    );
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (!ensureOwnerOrAdmin(item.uploadedBy, req.user)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const claim = await LostFoundClaim.findById(req.params.claimId).populate(
      "claimer",
      "email name"
    );
    if (!claim || claim.item.toString() !== item._id.toString()) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.status !== "pending") {
      return res.status(400).json({ message: "Claim already decided" });
    }

    if (action === "accept") {
      claim.status = "accepted";
      await claim.save();

      item.isResolved = true;
      item.resolvedBy = req.user._id;
      item.resolvedAt = new Date();
      await item.save();

      try {
        await transporter.sendMail({
          from: `"CampX Lost & Found" <${process.env.EMAIL_USER}>`,
          to: claim.claimer.email,
          subject: `Your claim for "${item.title}" was accepted`,
          text: `Congrats! The owner accepted your claim.`,
        });
      } catch {}

      await LostFoundClaim.updateMany(
        { item: item._id, _id: { $ne: claim._id }, status: "pending" },
        { $set: { status: "rejected" } }
      );

      return res.json({
        message: "Claim accepted. Item marked as resolved.",
      });
    }

    if (action === "reject") {
      claim.status = "rejected";
      await claim.save();

      try {
        await transporter.sendMail({
          from: `"CampX Lost & Found" <${process.env.EMAIL_USER}>`,
          to: claim.claimer.email,
          subject: `Your claim for "${item.title}" was rejected`,
          text: `The owner rejected your claim.`,
        });
      } catch {}

      return res.json({ message: "Claim rejected." });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.error("decideClaim error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
