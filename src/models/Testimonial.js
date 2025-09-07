import mongoose, { Schema, models } from "mongoose";

const TestimonialSchema = new Schema(
  {
    name: { type: String, required: true },          // Person’s name
    role: { type: String, default: "" },             // Job title, company
    location: { type: String, default: "" },         // Optional city
    message: { type: String, required: true },       // Testimonial text
    image: {
      src: { type: String, default: "" },            // Cloudinary URL
      alt: { type: String, default: "" },
    },
    order: { type: Number, default: 0 },             // Sort order
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);