// models/FeatureProject.js
import mongoose, { Schema, models } from "mongoose";

const GalleryItemSchema = new Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false }
);

const FeatureProjectSchema = new Schema(
  {
    title:        { type: String, required: true, trim: true, maxlength: 140 },
    slug:         { type: String, required: true, trim: true, unique: true },
    client:       { type: String, default: "", trim: true },
    year:         { type: Number },
    tags:         { type: [String], default: [] },

    // Media
    coverImage:   { type: String, default: "" },             // hero/thumbnail
    coverAlt:     { type: String, default: "" },             // NEW
     mediaUrl:     { type: String, default: "" },             // mp4/webm for hover-preview, optional

    // Prefer structured gallery; keep legacy as fallback if present elsewhere
    gallery:      { type: [GalleryItemSchema], default: [] }, // NEW preferred
    galleryImages:{ type: [String], default: [] },            // legacy (still here so old writes don’t break)

    // Copy & links
     description:  { type: String, default: "" },
    caseStudyUrl: { type: String, default: "" },
 
    // Presentation
     featured:     { type: Boolean, default: false },

    // Stats
    stats: [{
      label: { type: String, trim: true },
      value: { type: String, trim: true },
    }],

    // SEO
    schemaMarkup: { type: String, default: "" },              // NEW (raw JSON-LD string)
  },
  { timestamps: true }
);

export default models.FeatureProject || mongoose.model("FeatureProject", FeatureProjectSchema);