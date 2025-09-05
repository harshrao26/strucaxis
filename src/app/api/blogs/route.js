 import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import slugify from "slugify";

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const parsedLocations = Array.isArray(body.locations)
      ? body.locations
      : typeof body.locations === "string"
      ? body.locations.split(",").map((loc) => loc.trim())
      : [];

    const parsedFocusKeywords = Array.isArray(body.focusKeyword)
      ? body.focusKeyword
      : typeof body.focusKeyword === "string"
      ? body.focusKeyword.split(",").map((k) => k.trim())
      : [];

    const urlSlug = slugify(body.title || "", { lower: true, strict: true });

    const blog = await Blog.create({
      ...body,
      locations: parsedLocations,
      focusKeyword: parsedFocusKeywords,
      urlSlug,
      lastUpdated: new Date(),
    });

    return Response.json({ success: true, blog }, { status: 201 });
  } catch (err) {
    console.error("Blog POST error:", err);
    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

 
export async function GET(request) {
  try {
    await connectDB();
    const blogs = await Blog.find();

    return new Response(JSON.stringify({ success: true, blogs }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}
