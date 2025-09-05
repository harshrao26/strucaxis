 import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(req, context) {
  try {
    const { id } = context.params;

    if (!isValidObjectId(id)) {
      return Response.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    await connectDB();

    const blog = await Blog.findById(id);

    if (!blog) {
      return Response.json({ error: "Blog not found" }, { status: 404 });
    }

    return Response.json({ success: true, blog });
  } catch (err) {
    console.error("GET blog by ID error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
