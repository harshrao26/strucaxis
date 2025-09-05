"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle } from "react-icons/fi";
import CloudinaryUploader from "./CloudinaryUploader";
import { Row, Field } from "./UI";

export default function ProjectForm({ mode = "create", initial = {}, onSubmit }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);
  const [schemaValid, setSchemaValid] = useState(true);

  const [f, setF] = useState({
    title: initial.title || "",
    slug: initial.slug || "",
    client: initial.client || "",
    year: initial.year || "",
    tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : "",
    description: initial.description || "",
    coverImage: initial.coverImage || "",
    coverAlt: initial.coverAlt || "",
    mediaUrl: initial.mediaUrl || "",
    galleryImages: Array.isArray(initial.gallery)
      ? initial.gallery.map(g => g.src)
      : (initial.galleryImages || []),
    galleryAlts: Array.isArray(initial.gallery)
      ? initial.gallery.map(g => g.alt || "")
      : [],
    caseStudyUrl: initial.caseStudyUrl || "",
    featured: typeof initial.featured === "boolean" ? initial.featured : true,
    stats: (initial.stats || [])
      .map(s => `${s.value || ""} - ${s.label || ""}`.trim())
      .filter(Boolean)
      .join("\n"),
    schemaMarkup: initial.schemaMarkup || "",
  });

  const onChange = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const validate = () => {
    if (!f.title.trim() || !f.slug.trim()) return "Title and Slug are required";
    if (f.slug.includes(" ")) return "Slug cannot contain spaces";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setOkMsg(null);

    const v = validate();
    if (v) { setError(v); return; }

    // build gallery objects with alt
    const gallery = (f.galleryImages || []).map((src, i) => ({
      src,
      alt: (f.galleryAlts?.[i] || "").trim(),
    }));

    // soft-validate schema JSON (store raw string regardless)
    if (f.schemaMarkup?.trim()) {
      try { JSON.parse(f.schemaMarkup); setSchemaValid(true); }
      catch { setSchemaValid(false); /* allow submit anyway */ }
    } else {
      setSchemaValid(true);
    }

    setSubmitting(true);
    try {
      const payload = {
        title: f.title.trim(),
        slug: f.slug.trim().toLowerCase(),
        client: f.client.trim(),
        year: f.year ? Number(f.year) : undefined,
        tags: f.tags.split(",").map((s) => s.trim()).filter(Boolean),

        // Media
        coverImage: f.coverImage.trim(),
        coverAlt: f.coverAlt.trim(),
        mediaUrl: f.mediaUrl.trim(),

        // structured + legacy
        gallery,
        galleryImages: Array.isArray(f.galleryImages) ? f.galleryImages : [],

        // Links
        caseStudyUrl: f.caseStudyUrl.trim(),

        // Presentation
        featured: !!f.featured,

        // Stats
        stats: f.stats
          ? f.stats.split("\n").map((line) => {
              const [value, ...rest] = line.split(" - ");
              return { value: (value || "").trim(), label: (rest.join(" - ") || "").trim() };
            }).filter((s) => s.value || s.label)
          : [],

        // SEO
        schemaMarkup: f.schemaMarkup,
      };

      await onSubmit(payload);
      setOkMsg(mode === "create" ? "Project created!" : "Project updated!");
      setTimeout(() => router.push("/admin/feature-projects"), 650);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {okMsg && <p className="rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{okMsg}</p>}

      <Row>
        <Field label="Title *"><input className="input border-2 rounded w-full p-2" value={f.title} onChange={(e)=>onChange("title", e.target.value)} /></Field>
        <Field label="Slug *"><input className="input border-2 rounded w-full p-2" value={f.slug} onChange={(e)=>onChange("slug", e.target.value)} placeholder="kilo-app-redesign" /></Field>
        <Field label="Client"><input className="input border-2 rounded w-full p-2" value={f.client} onChange={(e)=>onChange("client", e.target.value)} /></Field>
      </Row>

      <Row>
        <Field label="Year"><input className="input border-2 rounded w-full p-2" value={f.year} onChange={(e)=>onChange("year", e.target.value)} placeholder="2025" /></Field>
        <Field label="Tags (comma separated)"><input className="input border-2 rounded w-full p-2" value={f.tags} onChange={(e)=>onChange("tags", e.target.value)} placeholder="Brand, Web, SaaS" /></Field>
        <Field label="Featured">
          <select className="input border-2 rounded w-full p-2" value={String(f.featured)} onChange={(e)=>onChange("featured", e.target.value === "true")}>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </Field>
      </Row>

      <Field label="Description (long)">
        <textarea className="input min-h-[160px] border-2 rounded w-full p-2" value={f.description} onChange={(e)=>onChange("description", e.target.value)} />
      </Field>

      <Row>
        <Field label="Cover Image">
          <CloudinaryUploader
            label="Upload cover image"
            multiple={false}
            value={f.coverImage}
            onChange={(url) => onChange("coverImage", url)}
          />
        </Field>
        <Field label="Cover Alt Text (SEO)">
          <input className="input border-2 rounded w-full p-2" value={f.coverAlt} onChange={(e)=>onChange("coverAlt", e.target.value)} placeholder="e.g., Contemporary café interior with warm lighting" />
        </Field>
        <Field label="Hover Preview Video (mp4/webm, optional)">
          <input className="input border-2 rounded w-full p-2" value={f.mediaUrl} onChange={(e)=>onChange("mediaUrl", e.target.value)} />
        </Field>
      </Row>

      <Field label="Gallery Images">
        <CloudinaryUploader
          label="Upload gallery images"
          multiple
          value={f.galleryImages}
          onChange={(arr) => {
            const nextAlts = [...(f.galleryAlts || [])];
            if (arr.length > nextAlts.length) nextAlts.push(...Array(arr.length - nextAlts.length).fill(""));
            else if (arr.length < nextAlts.length) nextAlts.length = arr.length;
            onChange("galleryImages", arr);
            onChange("galleryAlts", nextAlts);
          }}
        />
      </Field>

      {Array.isArray(f.galleryImages) && f.galleryImages.length > 0 && (
        <div className="grid gap-3 md:grid-cols-2">
          {f.galleryImages.map((src, i) => (
            <div key={src + i} className="rounded-lg border p-3 bg-white">
              <div className="flex items-start gap-3">
                <img src={src} alt="" className="h-20 w-28 object-cover rounded border" />
                <div className="flex-1">
                  <div className="text-xs mb-1 text-neutral-600">Alt text for image #{i + 1}</div>
                  <input
                    className="input border rounded w-full p-2"
                    value={f.galleryAlts?.[i] || ""}
                    onChange={(e) => {
                      const next = [...(f.galleryAlts || [])];
                      next[i] = e.target.value;
                      onChange("galleryAlts", next);
                    }}
                    placeholder="Describe image content (for SEO & accessibility)"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Row>
        <Field label="Case Study URL"><input className="input border-2 rounded w-full p-2" value={f.caseStudyUrl} onChange={(e)=>onChange("caseStudyUrl", e.target.value)} /></Field>
        <Field label="Stats (one per line, format: VALUE - LABEL)">
          <textarea className="input min-h-[90px] border-2 rounded w-full p-2" placeholder="+120% - Conversion lift"
                    value={f.stats} onChange={(e)=>onChange("stats", e.target.value)} />
        </Field>
        <div />
      </Row>

      <Field label="Schema Markup (JSON-LD)">
        <textarea
          className="input min-h-[140px] border-2 rounded w-full p-2 font-mono text-sm"
          placeholder='{"@context":"https://schema.org","@type":"CreativeWork","name":"Crackpot Café & Bistro"}'
          value={f.schemaMarkup}
          onChange={(e) => {
            const val = e.target.value;
            onChange("schemaMarkup", val);
            if (val.trim()) {
              try { JSON.parse(val); setSchemaValid(true); } catch { setSchemaValid(false); }
            } else {
              setSchemaValid(true);
            }
          }}
        />
        {!schemaValid && f.schemaMarkup.trim() && (
          <div className="mt-1 text-xs text-amber-700 flex items-center gap-1">
            <FiAlertCircle /> This doesn’t look like valid JSON. You can still save it.
          </div>
        )}
      </Field>

      <div className="flex items-center gap-3">
        <button disabled={submitting} className="rounded bg-zinc-900 text-white px-4 py-2 text-sm disabled:opacity-50">
          {submitting ? (mode === "create" ? "Creating…" : "Saving…") : (mode === "create" ? "Create Project" : "Save Changes")}
        </button>
        <button type="button" onClick={()=>history.back()} className="rounded border px-4 py-2 text-sm">Cancel</button>
      </div>
    </form>
  );
}