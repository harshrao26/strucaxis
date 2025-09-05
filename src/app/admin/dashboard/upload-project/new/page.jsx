"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiImage, FiUploadCloud, FiTrash2, FiAlertCircle } from "react-icons/fi";

// Cloudinary unsigned upload config (set in .env.local)
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "trygve-studio";

function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(new Error("Cloudinary env missing"));
      return;
    }
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && typeof onProgress === "function") {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        try {
          const ok = xhr.status >= 200 && xhr.status < 300;
          const json = JSON.parse(xhr.responseText || "{}");
          if (!ok) return reject(new Error(json?.error?.message || "Upload failed"));
          resolve(json.secure_url);
        } catch (e) {
          reject(new Error("Upload parse error"));
        }
      }
    };
    xhr.send(fd);
  });
}

function CloudinaryUploader({ label = "Upload image", multiple = false, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setProgress(0);
    try {
      if (multiple) {
        const urls = [];
        for (let i = 0; i < files.length; i++) {
          const f = files[i];
          if (!f.type.startsWith("image/")) continue;
          const url = await uploadToCloudinary(f, setProgress);
          urls.push(url);
        }
        const next = Array.isArray(value) ? [...value, ...urls] : urls;
        onChange?.(next);
      } else {
        const file = files[0];
        if (file && file.type.startsWith("image/")) {
          const url = await uploadToCloudinary(file, setProgress);
          onChange?.(url);
        }
      }
    } catch (e) {
      alert(e.message || "Upload failed");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  return (
    <div>
      <div
        onClick={openPicker}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-xl border border-dashed border-black/20 bg-[#F4F1EC] px-4 py-8 text-center cursor-pointer hover:bg-[#EEE9E1] transition"
      >
        <div className="flex items-center justify-center gap-2 text-neutral-700">
          <FiImage />
          <span className="text-sm">Drag & drop or click to {label.toLowerCase()}</span>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {busy && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded bg-black/10">
          <div className="h-full bg-black" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Previews */}
      {!multiple && typeof value === "string" && value && (
        <div className="mt-3 rounded-xl overflow-hidden border border-black/10 bg-white">
          <img src={value} alt="preview" className="h-40 w-full object-cover" />
        </div>
      )}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {value.map((src, i) => (
            <div key={src + i} className="relative rounded-lg overflow-hidden border">
              <img src={src} alt={`img-${i}`} className="h-24 w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 inline-flex items-center justify-center rounded bg-white/90 p-1 text-xs shadow"
                aria-label="Remove image"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);
  const [schemaValid, setSchemaValid] = useState(true);

  const [f, setF] = useState({
    title: "", slug: "", client: "", year: "",
    tags: "",
    blurb: "", description: "",
    coverImage: "", coverAlt: "",                  // NEW
    mediaType: "image", mediaUrl: "",
    galleryImages: [],                             // legacy urls (still used for preview)
    galleryAlts: [],                               // NEW: alt text per gallery item (parallel to galleryImages)
    caseStudyUrl: "", liveUrl: "", dribbbleUrl: "", awwwardsUrl: "",
    accentColor: "#7C5CFF",
    order: 100, featured: true,
    stats: "",
    schemaMarkup: "",                              // NEW
  });

  const onChange = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const validate = () => {
    if (!f.title.trim() || !f.slug.trim()) return "Title and Slug are required";
    if (f.slug.includes(" ")) return "Slug cannot contain spaces";
    return null;
  };

  const submit = async (e) => {
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
        blurb: f.blurb,
        description: f.description,

        // Media
        coverImage: f.coverImage.trim(),
        coverAlt: f.coverAlt.trim(),          // NEW
        mediaType: f.mediaType,
        mediaUrl: f.mediaUrl.trim(),

        // NEW + legacy for compatibility
        gallery,                              // [{src, alt}]
        galleryImages: Array.isArray(f.galleryImages) ? f.galleryImages : [],

        // Links
        caseStudyUrl: f.caseStudyUrl.trim(),
        liveUrl: f.liveUrl.trim(),
        dribbbleUrl: f.dribbbleUrl.trim(),
        awwwardsUrl: f.awwwardsUrl.trim(),

        // Presentation
        accentColor: f.accentColor,
        order: Number(f.order) || 100,
        featured: !!f.featured,

        // Stats
        stats: f.stats
          ? f.stats.split("\n").map((line) => {
              const [value, ...rest] = line.split(" - ");
              return { value: (value || "").trim(), label: (rest.join(" - ") || "").trim() };
            }).filter((s) => s.value || s.label)
          : [],

        // SEO
        schemaMarkup: f.schemaMarkup,         // raw JSON-LD string
      };

      const res = await fetch("/api/feature-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to create project");
      }
      setOkMsg("Project created!");
      setTimeout(() => router.push("/admin/dashboard/featured-projects"), 700);
    } catch (e) {
      setError(e.message || "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-0 pt-32 py-4">
      <h2 className="text-2xl font-semibold">New Project</h2>
      <form onSubmit={submit} className="mt-6 space-y-5">
        {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {okMsg && <p className="rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{okMsg}</p>}

        <Row>
          <Field label="Title *"><input className="input border-2 rounded w-full p-2" value={f.title} onChange={(e)=>onChange("title", e.target.value)} /></Field>
          <Field label="Slug *"><input className="input border-2 rounded w-full p-2" value={f.slug} onChange={(e)=>onChange("slug", e.target.value)} placeholder="kilo-app-redesign" /></Field>
        </Row>

        <Row>
          <Field label="Client"><input className="input border-2 rounded w-full p-2" value={f.client} onChange={(e)=>onChange("client", e.target.value)} /></Field>
          <Field label="Year"><input className="input border-2 rounded w-full p-2" value={f.year} onChange={(e)=>onChange("year", e.target.value)} placeholder="2025" /></Field>
          <Field label="Order"><input className="input border-2 rounded w-full p-2" value={f.order} onChange={(e)=>onChange("order", e.target.value)} /></Field>
        </Row>

        <Field label="Tags (comma separated)">
          <input className="input border-2 rounded w-full p-2" value={f.tags} onChange={(e)=>onChange("tags", e.target.value)} placeholder="Brand, Web, SaaS" />
        </Field>

        <Field label="Blurb (short)">
          <textarea className="input min-h-[80px] border-2 rounded w-full p-2" value={f.blurb} onChange={(e)=>onChange("blurb", e.target.value)} />
        </Field>

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
          <div />
        </Row>

        <Row>
          <Field label="Media Type">
            <select className="input border-2 rounded w-full p-2" value={f.mediaType} onChange={(e)=>onChange("mediaType", e.target.value)}>
              <option value="image">image</option>
              <option value="video">video</option>
            </select>
          </Field>
          <Field label="Media URL (mp4/webm)">
            <input className="input border-2 rounded w-full p-2" value={f.mediaUrl} onChange={(e)=>onChange("mediaUrl", e.target.value)} />
          </Field>
          <div />
        </Row>

        <Field label="Gallery Images">
          <CloudinaryUploader
            label="Upload gallery images"
            multiple
            value={f.galleryImages}
            onChange={(arr) => {
              // keep galleryAlts array in sync length
              const nextAlts = [...(f.galleryAlts || [])];
              if (arr.length > nextAlts.length) {
                nextAlts.push(...Array(arr.length - nextAlts.length).fill(""));
              } else if (arr.length < nextAlts.length) {
                nextAlts.length = arr.length;
              }
              onChange("galleryImages", arr);
              onChange("galleryAlts", nextAlts);
            }}
          />
        </Field>

        {/* Per-image alt editors */}
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
          <Field label="Live URL"><input className="input border-2 rounded w-full p-2" value={f.liveUrl} onChange={(e)=>onChange("liveUrl", e.target.value)} /></Field>
          <div />
        </Row>

        <Row>
          <Field label="Dribbble URL"><input className="input border-2 rounded w-full p-2" value={f.dribbbleUrl} onChange={(e)=>onChange("dribbbleUrl", e.target.value)} /></Field>
          <Field label="Awwwards URL"><input className="input border-2 rounded w-full p-2" value={f.awwwardsUrl} onChange={(e)=>onChange("awwwardsUrl", e.target.value)} /></Field>
          <Field label="Accent Color"><input className="input border-2 rounded w-full p-2" value={f.accentColor} onChange={(e)=>onChange("accentColor", e.target.value)} /></Field>
        </Row>

        <Field label="Stats (one per line, format: VALUE - LABEL)">
          <textarea className="input min-h-[90px] border-2 rounded w-full p-2" placeholder="+120% - Conversion lift"
                    value={f.stats} onChange={(e)=>onChange("stats", e.target.value)} />
        </Field>

        {/* Schema Markup */}
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

        <Row>
          <Field label="Featured">
            <select className="input border-2 rounded w-full p-2" value={String(f.featured)} onChange={(e)=>onChange("featured", e.target.value === "true")}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </Field>
        </Row>

        <div className="flex items-center gap-3">
          <button disabled={submitting} className="rounded bg-zinc-900 text-white px-4 py-2 text-sm disabled:opacity-50">
            {submitting ? "Saving…" : "Create Project"}
          </button>
          <button type="button" onClick={()=>history.back()} className="rounded border px-4 py-2 text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function Row({ children }) {
  return <div className="grid gap-5 md:grid-cols-3">{children}</div>;
}
function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium">{label}</div>
      {children}
      <style jsx>{`
        .input {
          all: unset;
          display: block;
          width: 100%;
          background: white;
          padding: 0.5rem 0.75rem;
          border: 1px solid rgb(212 212 216);
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        .input:focus { outline: 2px solid rgb(24 24 27 / 0.1); }
      `}</style>
    </label>
  );
}