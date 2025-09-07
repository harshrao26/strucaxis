// src/models/Capability.js
import mongoose, { Schema, models } from "mongoose";

const ImgSchema = new Schema(
  {
    src: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const CapabilitySchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug:  { type: String, required: true, unique: true, trim: true, lowercase: true },
    subheading: { type: String, default: "", trim: true, maxlength: 400 },

    // one-liner services (left list)
    services: {
      type: [String],
      validate: { validator: (a) => Array.isArray(a) && a.length > 0, message: "services must have at least 1 item" },
      default: [],
    },

    // exactly 4 images for the right grid (2×2)
    images: {
      type: [ImgSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 4 && arr.every((i) => i?.src),
        message: "images must contain exactly four entries with src.",
      },
      default: undefined,
    },

    order:  { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Capability || mongoose.model("Capability", CapabilitySchema);