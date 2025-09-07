import { NextResponse } from "next/server";
import Team from "@/models/Team";
import { connectDB } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET /api/teams
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const q = {};
    const search = searchParams.get("search");
    if (search) {
      q.$or = [
        { name: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sort = searchParams.get("sort") || "order -createdAt";

    const items = await Team.find(q).sort(sort).lean();
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /teams error:", err);
    return NextResponse.json({ error: "Failed to fetch teams" }, { status: 500 });
  }
}

// POST /api/teams
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body?.name || !body?.slug || !body?.position) {
      return NextResponse.json({ error: "name, slug, and position are required" }, { status: 400 });
    }

    body.slug = body.slug.trim().toLowerCase().replace(/\s+/g, "-");

    const created = await Team.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /teams error:", err);
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Duplicate slug" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create team member" }, { status: 500 });
  }
}