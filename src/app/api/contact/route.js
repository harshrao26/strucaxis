import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Accepts POSTed JSON and forwards to Google Apps Script (which writes to Google Sheets).
 *
 * Expected body:
 * {
 *   fullName: string,              // required
 *   email: string,                 // required
 *   phone: string,                 // required
 *   company: string,               // optional
 *   location: string,              // city & country (required)
 *   projectType: string,           // required
 *   budget: string,                // optional (e.g., "₹25–35L" / "USD 50–70k")
 *   timeline: string,              // optional
 *   message: string,               // required
 *   // optional: honeypot, utm, page info, etc.
 * }
 */

function clean(s) {
  if (typeof s !== "string") return "";
  return s.replace(/\s+/g, " ").trim();
}
function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || "");
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    console.log("contact form", body);

    // --- basic validation ---
    const payload = {
      fullName:   clean(body.fullName),
      email:      clean(body.email),
      phone:      clean(body.phone || body.whatsapp),
      company:    clean(body.company || body.brand),
      location:   clean(body.location || body.cityCountry),
      projectType:clean(body.projectType),
      budget:     clean(body.budget),
      timeline:   clean(body.timeline),
      message:    clean(body.message || body.brief),
      // optional extras (nice to have in the sheet)
      page:       clean(body.page),         // where form was submitted
      utm:        typeof body.utm === "object" ? body.utm : undefined,
      submittedAt:new Date().toISOString(),
      userAgent:  req.headers.get("user-agent") || "",
      referer:    req.headers.get("referer") || "",
      ip:         req.headers.get("x-forwarded-for") || "",
    };

    // honeypot (optional)
    if (clean(body.website)) {
      return NextResponse.json({ ok: true }, { status: 202 }); // silently accept bots
    }

    // required checks
    if (!payload.fullName || !isEmail(payload.email) || !payload.phone || !payload.location || !payload.projectType || !payload.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const GAS_URL   = process.env.GOOGLE_APPS_SCRIPT_URL;
    const GAS_TOKEN = process.env.GOOGLE_APPS_SCRIPT_TOKEN || "";

    if (!GAS_URL) {
      return NextResponse.json({ error: "Server not configured (GAS URL missing)" }, { status: 500 });
    }

    // Forward to Google Apps Script (which appends to the sheet)
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(GAS_TOKEN ? { "X-API-KEY": GAS_TOKEN } : {}),
      },
      body: JSON.stringify({
        // These keys become columns in your sheet (Apps Script auto-creates headers)
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        company: payload.company,
        location: payload.location,
        projectType: payload.projectType,
        budget: payload.budget,
        timeline: payload.timeline,
        message: payload.message,

        // Useful metadata
        page: payload.page,
        utm: payload.utm,
        submittedAt: payload.submittedAt,
        userAgent: payload.userAgent,
        referer: payload.referer,
        ip: payload.ip,
      }),
      // You can optionally set a timeout with AbortController if needed.
    });

    // We keep it simple — if GAS responded at all, treat as success
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json({ error: "Upstream error", detail: text }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}