import mongoose, { Schema, models } from "mongoose";

const JobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    team: { type: String, required: true, trim: true },               // e.g., Engineering, Product
    type: { type: String, required: true, trim: true },               // e.g., Full-time, Contract
    location: { type: String, required: true, trim: true },           // e.g., Remote / Bengaluru
    tags: { type: [String], default: [] },                            // ["React","Next.js","Tailwind"]
    blurb: { type: String, required: true, maxlength: 400 },
    description: { type: String, default: "" },                       // Full JD (Markdown/HTML/plain)
    active: { type: Boolean, default: true },                         // close roles without deleting
    applyEmail: { type: String, default: "careers@trygvestudio.com" },
    applyLink: { type: String, default: "" },                         // alt external ATS link
  },
  { timestamps: true }
);

// Avoid model overwrite in dev
export default models.Job || mongoose.model("Job", JobSchema);