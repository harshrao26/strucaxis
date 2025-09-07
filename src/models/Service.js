// src/models/Service.js
import mongoose, { Schema, models } from "mongoose";

const ImageSchema = new Schema(
  {
    src: { type: String, required: true, trim: true }, // Cloudinary URL
    alt: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 }, // heading
    slug:  { type: String, required: true, unique: true, trim: true, lowercase: true },
    image: { type: ImageSchema, required: true },                         // { src, alt }

    // exactly three bullet points for the card
    points: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 3 && arr.every(Boolean),
        message: "points must be an array of exactly three non-empty strings.",
      },
    },

    // optional extras
    summary: { type: String, default: "", trim: true, maxlength: 240 },   // short copy under heading (optional)
    order:   { type: Number, default: 0 },                                 // for manual sorting
    active:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Service || mongoose.model("Service", ServiceSchema);