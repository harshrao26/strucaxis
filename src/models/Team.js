// src/models/Team.js
import mongoose, { Schema, models } from "mongoose";

const ImageSchema = new Schema(
  {
    src: { type: String, required: true, trim: true }, // Cloudinary URL
    alt: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const TeamSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    position: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "", trim: true, maxlength: 600 },
    image: { type: ImageSchema, required: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Team || mongoose.model("Team", TeamSchema);