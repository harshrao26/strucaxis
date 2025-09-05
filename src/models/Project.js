// models/Project.js
import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["Interior", "Architecture"], default: "Interior" },
    location: String,
    timeline: String,
    tags: [String],
    cover: { type: String, required: true },
    coverAlt: { type: String, default: "" },     // NEW
    gallery: { type: [GalleryItemSchema], default: [] }, // NEW structured gallery
    description: String,
    schemaMarkup: { type: String, default: "" }, // NEW: raw JSON-LD string
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);