
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
// GET blog by urlSlug
export async function GET(req, context) {
  try {
    const { id } = await context.params;  
    await connectDB();

    const blog = await Blog.findOne({ urlSlug: id });
    if (!blog) {
      return Response.json({ error: "Blog not found" }, { status: 404 });
    }

    return Response.json(blog);
  } catch (err) {
    console.error("GET blog error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}


 // PUT blog by urlSlug
export async function PUT(req, context) {
  try {
    const { params } = context;
    await connectDB();
    const body = await req.json();

    const blog = await Blog.findOne({ urlSlug: params.id });
    if (!blog) {
      return Response.json({ error: "Blog not found" }, { status: 404 });
    }

    // Update all fields explicitly
    blog.set({
      ...body,
      urlSlug: body.urlSlug,
      locations: Array.isArray(body.locations)
        ? body.locations
        : typeof body.locations === "string"
        ? body.locations.split(",").map((l) => l.trim())
        : [],
      focusKeyword: Array.isArray(body.focusKeyword)
        ? body.focusKeyword
        : typeof body.focusKeyword === "string"
        ? body.focusKeyword.split(",").map((k) => k.trim())
        : [],
      relatedBlog: Array.isArray(body.relatedBlog)
        ? body.relatedBlog
        : typeof body.relatedBlog === "string"
        ? body.relatedBlog.split(",").map((r) => r.trim())
        : [],
      lastUpdated: new Date(),
    });

    await blog.save();

    return Response.json({ success: true, blog });
  } catch (err) {
    console.error("PUT error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}



// DELETE blog by urlSlug
export async function DELETE(req, context) {
  try {
    const { params } = context;
    await connectDB();

    const deleted = await Blog.findOneAndDelete({ urlSlug: params.id });

    if (!deleted) {
      return Response.json({ error: "Blog not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
