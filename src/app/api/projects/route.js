// // app/api/projects/route.js
// import { NextResponse } from "next/server";

// // Dummy data for now (swap with DB later)
// const PROJECTS = [
//   {
//     id: "p1",
//     title: "Nairobi Residence",
//     type: "Interior", // Interior | Architecture
//     location: "Nairobi, Kenya",
//     timeline: "Jan 2024 – Jun 2024",
//     tags: ["Residence", "Contemporary", "Warm Wood"],
//     cover: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
//     gallery: [
//       "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1400&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1400&auto=format&fit=crop",
//     ],
//     description:
//       "A warm, light-filled interior with custom millwork and local materials to balance modern living with regional climate.",
//   },
//   {
//     id: "p2",
//     title: "Kyoto Courtyard House",
//     type: "Architecture",
//     location: "Kyoto, Japan",
//     timeline: "Aug 2023 – May 2024",
//     tags: ["Residential", "Courtyard", "Minimal"],
//     cover: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1400&auto=format&fit=crop",
//     gallery: [
//       "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1400&auto=format&fit=crop",
//     ],
//     description:
//       "A minimalist single-family home organized around a serene internal garden to amplify daylight and privacy.",
//   },
//   {
//     id: "p3",
//     title: "Mumbai Retail Flagship",
//     type: "Interior",
//     location: "Mumbai, India",
//     timeline: "Nov 2023 – Feb 2024",
//     tags: ["Retail", "Flagship", "Brand"],
//     cover: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1400&auto=format&fit=crop",
//     gallery: [
//       "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1422190441165-ec2956dc9ecc?q=80&w=1400&auto=format&fit=crop",
//     ],
//     description:
//       "A brand-forward retail environment with flexible merchandising, layered lighting and tactile finishes.",
//   },
//   {
//     id: "p4",
//     title: "Barcelona Boutique Hotel",
//     type: "Architecture",
//     location: "Barcelona, Spain",
//     timeline: "Mar 2022 – Dec 2023",
//     tags: ["Hospitality", "Adaptive Reuse", "Stone"],
//     cover: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
//     gallery: [
//       "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1400&auto=format&fit=crop",
//       "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400&auto=format&fit=crop",
//     ],
//     description:
//       "Adaptive reuse of a historic structure into a boutique hospitality experience celebrating stone and daylight.",
//   },
// ];

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const type = searchParams.get("type"); // Interior | Architecture
//   const q = (searchParams.get("q") || "").toLowerCase();
//   const tag = searchParams.get("tag") || "";
//   const page = Number(searchParams.get("page") || 1);
//   const pageSize = Number(searchParams.get("pageSize") || 9);

//   let list = [...PROJECTS];

//   if (type && type !== "All") {
//     list = list.filter((p) => p.type === type);
//   }
//   if (q) {
//     list = list.filter(
//       (p) =>
//         p.title.toLowerCase().includes(q) ||
//         p.location.toLowerCase().includes(q) ||
//         p.tags.join(" ").toLowerCase().includes(q)
//     );
//   }
//   if (tag) {
//     list = list.filter((p) => p.tags.includes(tag));
//   }

//   const total = list.length;
//   const start = (page - 1) * pageSize;
//   const end = start + pageSize;
//   const data = list.slice(start, end);

//   return NextResponse.json({
//     data,
//     total,
//     page,
//     pageSize,
//     hasMore: end < total,
//     tags: Array.from(new Set(PROJECTS.flatMap((p) => p.tags))),
//   });
// }


import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Project from "@/models/Project"; // <-- your schema file

// connect to MongoDB (basic helper)
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// GET /api/projects → list all projects
export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST /api/projects → create a new projectexport async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.cover) {
      return NextResponse.json(
        { error: "Missing required fields: title or cover" },
        { status: 400 }
      );
    }

    // normalize tags
    let tags = body.tags;
    if (Array.isArray(tags) === false && typeof tags === "string") {
      tags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    if (!Array.isArray(tags)) tags = [];

    // normalize gallery: allow array of strings or [{src, alt}]
    let gallery = Array.isArray(body.gallery) ? body.gallery : [];
    gallery = gallery
      .map((g) => {
        if (typeof g === "string") return { src: g, alt: "" };
        if (g && typeof g === "object") {
          return { src: g.src, alt: g.alt || "" };
        }
        return null;
      })
      .filter((x) => x && x.src);

    const doc = {
      title: body.title,
      type: body.type || "Interior",
      location: body.location || "",
      timeline: body.timeline || "",
      tags,
      cover: body.cover,
      coverAlt: body.coverAlt || "",
      gallery,                       // [{src, alt}]
      description: body.description || "",
      schemaMarkup: body.schemaMarkup || "", // raw string (JSON-LD)
    };

    const project = await Project.create(doc);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
