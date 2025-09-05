import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const connectedServiceSchema = new mongoose.Schema(
  {
    name: String,
    link: String,
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    video: String,
    oldslug: String,
    category: String,
    subCategory: String,
    subSubCategory: String,
    metaTitle: String, //Limit 50--60
    metaDescription: String, //Limit 140--160
    canonicalUrl: String,
    connectedServices: [connectedServiceSchema],
    serviceSpecificPage: String,
    relatedBlog: [String],
    content: String, // Rich text HTML
    schemaMarkup: String,
    faqs: [faqSchema],
    locations: [String],
    businessName: String,
    address: String,
    urlSlug: String,
    focusKeyword: [String],
    phone: String,
    websiteName: String,
    author: String, 
    status: { type: String, default: "visible" },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
