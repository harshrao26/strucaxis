// models/ClientLogo.js
import mongoose, { Schema, models } from "mongoose";

const ClientLogoSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },        // Company name
    image: {
      src: { type: String, required: true },                   // Cloudinary URL
      alt: { type: String, default: "" },                      // SEO alt text
    },
    website: { type: String, default: "" },                    // Optional link
    order: { type: Number, default: 0 },                       // For sorting
    active: { type: Boolean, default: true },                  // Toggle show/hide
  },
  { timestamps: true }
);

export default models.ClientLogo || mongoose.model("ClientLogo", ClientLogoSchema);