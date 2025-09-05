import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";

/**
 * GET /api/jobs
 * Query params:
 *   search: string (title/team/location/tags)
 *   team: string
 *   type: string
 *   location: string
 *   active: "true" | "false"
 *   page: number (default 1)
 *   limit: number (default 10, max 50)
 *   sort: "-createdAt" | "createdAt" | "title"
 */
export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);

  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50);
  const skip = (page - 1) * limit;

  const filters = {};
  const team = searchParams.get("team");
  const type = searchParams.get("type");
  const location = searchParams.get("location");
  const active = searchParams.get("active");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "-createdAt";

  if (team) filters.team = team;
  if (type) filters.type = type;
  if (location) filters.location = location;
  if (active === "true" || active === "false") filters.active = active === "true";

  if (search) {
    const rx = new RegExp(search, "i");
    filters.$or = [
      { title: rx },
      { team: rx },
      { type: rx },
      { location: rx },
      { tags: rx },
      { blurb: rx },
      { description: rx },
    ];
  }

  const [items, total] = await Promise.all([
    Job.find(filters).sort(sort).skip(skip).limit(limit).lean(),
    Job.countDocuments(filters),
  ]);

  return NextResponse.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items,
  });
}

/**
 * POST /api/jobs
 * Body JSON:
 * {
 *   title, team, type, location, tags?, blurb, description?, active?, applyEmail?, applyLink?
 * }
 */
export async function POST(request) {
  await connectDB();
  const body = await request.json();

  // Minimal validation (keep simple; you can swap to zod/yup later)
  const required = ["title", "team", "type", "location", "blurb"];
  const missing = required.filter((k) => !body?.[k] || String(body[k]).trim() === "");
  if (missing.length) {
    return NextResponse.json(
      { error: `Missing required field(s): ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const job = await Job.create({
      title: String(body.title).trim(),
      team: String(body.team).trim(),
      type: String(body.type).trim(),
      location: String(body.location).trim(),
      blurb: String(body.blurb).trim(),
      tags: Array.isArray(body.tags) ? body.tags : [],
      description: body.description || "",
      active: typeof body.active === "boolean" ? body.active : true,
      applyEmail: body.applyEmail || "careers@trygvestudio.com",
      applyLink: body.applyLink || "",
    });

    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}