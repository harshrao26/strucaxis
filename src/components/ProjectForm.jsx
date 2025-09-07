"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiAlertCircle, FiCheckCircle, FiHash, FiLink, FiTag, FiTrash2, FiPlus,
  FiType, FiUser, FiCalendar, FiChevronUp, FiChevronDown, FiFilm,
  FiImage, FiPlayCircle, FiGlobe, FiCode, FiInfo
} from "react-icons/fi";
import CloudinaryUploader from "./CloudinaryUploader";

export default function ProjectForm({ mode = "create", initial = undefined, onSubmit }) {
  const router = useRouter();

  // ---- safe initial ----
  const safeInitial = (initial && typeof initial === "object") ? initial : {};

  // ---- helpers ----
  const slugify = (s) =>
    (s || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

  // ---- local state ----
  const [f, setF] = useState(() => ({
    title: safeInitial.title || "",
    slug: safeInitial.slug || "",
    client: safeInitial.client || "",
    year: safeInitial.year || "",
    description: safeInitial.description || "",
    coverImage: safeInitial.coverImage || "",
    coverAlt: safeInitial.coverAlt || "",
    mediaUrl: safeInitial.mediaUrl || "",
    caseStudyUrl: safeInitial.caseStudyUrl || "",
    featured: typeof safeInitial.featured === "boolean" ? safeInitial.featured : true,
    tags: Array.isArray(safeInitial.tags) ? safeInitial.tags : [],
    gallery: Array.isArray(safeInitial.gallery) && safeInitial.gallery.length > 0
      ? safeInitial.gallery
      : (Array.isArray(safeInitial.galleryImages) ? safeInitial.galleryImages.map((src) => ({ src, alt: "" })) : []),
    stats: Array.isArray(safeInitial.stats) ? safeInitial.stats : [],
    schemaMarkup: safeInitial.schemaMarkup || "",
  }));

  // rehydrate when initial updates
  useEffect(() => {
    const si = (initial && typeof initial === "object") ? initial : null;
    if (!si) return;
    setF((prev) => ({
      ...prev,
      title: si.title ?? prev.title ?? "",
      slug: si.slug ?? prev.slug ?? "",
      client: si.client ?? prev.client ?? "",
      year: si.year ?? prev.year ?? "",
      description: si.description ?? prev.description ?? "",
      coverImage: si.coverImage ?? prev.coverImage ?? "",
      coverAlt: si.coverAlt ?? prev.coverAlt ?? "",
      mediaUrl: si.mediaUrl ?? prev.mediaUrl ?? "",
      caseStudyUrl: si.caseStudyUrl ?? prev.caseStudyUrl ?? "",
      featured: typeof si.featured === "boolean" ? si.featured : (typeof prev.featured === "boolean" ? prev.featured : true),
      tags: Array.isArray(si.tags) ? si.tags : (Array.isArray(prev.tags) ? prev.tags : []),
      gallery: Array.isArray(si.gallery) && si.gallery.length > 0
        ? si.gallery
        : (Array.isArray(si.galleryImages) ? si.galleryImages.map((src) => ({ src, alt: "" })) : (prev.gallery || [])),
      stats: Array.isArray(si.stats) ? si.stats : (prev.stats || []),
      schemaMarkup: typeof si.schemaMarkup === "string" ? si.schemaMarkup : (prev.schemaMarkup || ""),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const onChange = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const [submitting, setSubmitting] = useState(false);
  const [schemaValid, setSchemaValid] = useState(true);
  const [schemaObj, setSchemaObj] = useState(null);
  const [error, setError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);

  // autoslug on title (create nicety)
  useEffect(() => {
    if (mode === "create" && !f.slug && f.title) onChange("slug", slugify(f.title));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.title]);

  // JSON-LD check (soft)
  useEffect(() => {
    const raw = (f.schemaMarkup || "").trim();
    if (!raw) { setSchemaValid(true); setSchemaObj(null); return; }
    try { const parsed = JSON.parse(raw); setSchemaValid(true); setSchemaObj(parsed); }
    catch { setSchemaValid(false); setSchemaObj(null); }
  }, [f.schemaMarkup]);

  const validate = () => {
    if (!f.title.trim()) return "Title is required.";
    if (!f.slug.trim()) return "Slug is required.";
    if (/\s/.test(f.slug)) return "Slug cannot contain spaces.";
    return null;
  };

  // ---- tags ----
  const [tagInput, setTagInput] = useState("");
  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!f.tags.includes(t)) onChange("tags", [...f.tags, t]);
    setTagInput("");
  };
  const removeTag = (t) => onChange("tags", f.tags.filter((x) => x !== t));

  // ---- stats ----
  const addStat = () => onChange("stats", [...f.stats, { value: "", label: "" }]);
  const updateStat = (i, kv) => {
    const next = [...f.stats]; next[i] = { ...next[i], ...kv }; onChange("stats", next);
  };
  const removeStat = (i) => { const next = [...f.stats]; next.splice(i, 1); onChange("stats", next); };

  // ---- gallery ----
  const addGalleryImages = (urls) => {
    const items = Array.isArray(urls) ? urls.map((src) => ({ src, alt: "" })) : [{ src: urls, alt: "" }];
    onChange("gallery", [...f.gallery, ...items]);
  };
  const setCoverFromGallery = (src, alt = "") => {
    onChange("coverImage", src);
    if (!f.coverAlt) onChange("coverAlt", alt);
  };
  const updateGalleryAlt = (i, alt) => {
    const next = [...f.gallery]; next[i] = { ...next[i], alt }; onChange("gallery", next);
  };
  const removeGalleryAt = (i) => {
    const next = [...f.gallery]; next.splice(i, 1); onChange("gallery", next);
  };
  const moveGallery = (i, dir) => {
    const j = i + dir; if (j < 0 || j >= f.gallery.length) return;
    const next = [...f.gallery]; [next[i], next[j]] = [next[j], next[i]]; onChange("gallery", next);
  };
  const galleryValue = useMemo(() => f.gallery.map((g) => g.src), [f.gallery]);

  // ---- submit ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setOkMsg(null);

    const v = validate(); if (v) { setError(v); return; }

    setSubmitting(true);
    try {
      const payload = {
        title: f.title.trim(),
        slug: slugify(f.slug.trim()),
        client: f.client.trim(),
        year: f.year ? Number(f.year) : undefined,
        description: f.description.trim(),
        tags: f.tags,
        coverImage: f.coverImage.trim(),
        coverAlt: f.coverAlt.trim(),
        mediaUrl: f.mediaUrl.trim(),
        gallery: f.gallery.filter((x) => x?.src).map((x) => ({ src: x.src, alt: (x.alt || "").trim() })),
        galleryImages: f.gallery.filter((x) => x?.src).map((x) => x.src),
        caseStudyUrl: f.caseStudyUrl.trim(),
        featured: !!f.featured,
        stats: (f.stats || []).filter((s) => s.value || s.label).map((s) => ({
          value: (s.value || "").trim(), label: (s.label || "").trim(),
        })),
        schemaMarkup: f.schemaMarkup,
      };

      await onSubmit(payload);
      setOkMsg(mode === "create" ? "Project created 🎉" : "Project updated ✅");
      setTimeout(() => router.push("/admin/dashboard"), 650);
    } catch (e2) {
      setError(e2?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const titleCount = f.title.length;
  const descCount = f.description.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* toast banners */}
      {error && (
        <Banner tone="error" icon={<FiAlertCircle />}>{error}</Banner>
      )}
      {okMsg && (
        <Banner tone="success" icon={<FiCheckCircle />}>{okMsg}</Banner>
      )}

      {/* BASICS */}
      <Section title="Project Basics" icon={<FiType />}>
        <Grid cols={3}>
          <Field label="Title *" icon={<FiType />} hint={`${titleCount}/140`}>
            <input
              className="input w-full"
              value={f.title}
              maxLength={140}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Crackpot Café & Bistro"
            />
          </Field>

          <Field
            label="Slug *"
            icon={<FiHash />}
            hint={<span className="inline-flex items-center gap-1 text-zinc-500"><FiGlobe /> /projects/<b className="text-zinc-700">{f.slug || "slug"}</b></span>}
          >
            <div className="flex items-stretch gap-2">
              <input
                className="input w-full"
                value={f.slug}
                onChange={(e) => onChange("slug", slugify(e.target.value))}
                placeholder="crackpot-cafe-bistro"
              />
              <button type="button" onClick={() => onChange("slug", slugify(f.title || f.slug))} className="btn-subtle">Auto</button>
            </div>
          </Field>

          <Field label="Client" icon={<FiUser />}>
            <input
              className="input w-full"
              value={f.client}
              onChange={(e) => onChange("client", e.target.value)}
              placeholder="Crackpot Hospitality"
            />
          </Field>
        </Grid>

        <Grid cols={3}>
          <Field label="Year" icon={<FiCalendar />}>
            <input
              className="input w-full"
              value={f.year}
              onChange={(e) => onChange("year", e.target.value.replace(/[^\d]/g, ""))}
              placeholder="2025"
              inputMode="numeric"
            />
          </Field>

          <Field label="Featured">
            <select className="input w-full" value={String(f.featured)} onChange={(e) => onChange("featured", e.target.value === "true")}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </Field>

          <Field label="Case Study URL" icon={<FiLink />}>
            <input
              className="input w-full"
              value={f.caseStudyUrl}
              onChange={(e) => onChange("caseStudyUrl", e.target.value)}
              placeholder="https://example.com/case-study"
            />
          </Field>
        </Grid>

        <Field label="Description" hint={`${descCount} chars`}>
          <textarea
            className="input min-h-[160px] w-full"
            value={f.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Long-form description…"
          />
        </Field>
      </Section>

      {/* TAGS */}
      <Section title="Tags" icon={<FiTag />} subtitle="Improve discovery & filtering">
        <div className="flex flex-wrap items-center gap-2">
          {f.tags.map((t) => (
            <span key={t} className="chip">
              {t}
              <button type="button" onClick={() => removeTag(t)} className="chip-x"><FiTrash2 /></button>
            </span>
          ))}
          <div className="flex items-stretch gap-2">
            <input
              className="input"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag (e.g., Web)"
            />
            <button type="button" onClick={addTag} className="btn-subtle"><FiPlus /> Add</button>
          </div>
        </div>
      </Section>

      {/* MEDIA */}
      <Section title="Media" icon={<FiImage />} subtitle="Cover, preview video & gallery">
        <Grid cols={3}>
          <Field label="Cover Image" icon={<FiImage />} hint="Used on cards & hero">
            <CloudinaryUploader
              label="Upload cover image"
              multiple={false}
              value={f.coverImage}
              onChange={(url) => onChange("coverImage", url)}
            />
            {f.coverImage && (
              <div className="mt-3 overflow-hidden rounded-lg border bg-gradient-to-b from-zinc-50 to-white">
                <img src={f.coverImage} alt="" className="aspect-[16/9] w-full object-cover" />
              </div>
            )}
          </Field>

          <Field label="Cover Alt Text (SEO)">
            <input
              className="input w-full"
              value={f.coverAlt}
              onChange={(e) => onChange("coverAlt", e.target.value)}
              placeholder="e.g., Contemporary café interior with warm lighting"
            />
          </Field>

          <Field label="Hover Preview Video (mp4/webm)" icon={<FiPlayCircle />}>
            <input
              className="input w-full"
              value={f.mediaUrl}
              onChange={(e) => onChange("mediaUrl", e.target.value)}
              placeholder="https://res.cloudinary.com/.../preview.webm"
            />
          </Field>
        </Grid>

        <Field label="Gallery Images" icon={<FiFilm />} hint="Upload multiple images; set ALT text & reorder.">
          <CloudinaryUploader
            label="Upload gallery images"
            multiple
            value={galleryValue}
            onChange={(arrOrStr) => {
              const arr = Array.isArray(arrOrStr) ? arrOrStr : [arrOrStr];
              addGalleryImages(arr);
            }}
          />

          {f.gallery.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {f.gallery.map((g, i) => (
                <div key={g.src + i} className="card">
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img src={g.src} alt="" className="h-24 w-32 rounded-md border object-cover" />
                      <button
                        type="button"
                        title="Set as cover"
                        onClick={() => setCoverFromGallery(g.src, g.alt)}
                        className="absolute bottom-1 left-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] ring-1 ring-zinc-200 hover:bg-white"
                      >
                        Set cover
                      </button>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-1 text-xs text-zinc-600">
                        <FiInfo /> Alt text
                      </div>
                      <input
                        className="input w-full"
                        value={g.alt || ""}
                        onChange={(e) => updateGalleryAlt(i, e.target.value)}
                        placeholder="Describe image content (SEO & a11y)"
                      />
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => moveGallery(i, -1)} className="btn-icon" title="Move up"><FiChevronUp /></button>
                          <button type="button" onClick={() => moveGallery(i, 1)} className="btn-icon" title="Move down"><FiChevronDown /></button>
                        </div>
                        <button type="button" onClick={() => removeGalleryAt(i)} className="btn-danger text-xs"><FiTrash2 /> Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed p-6 text-center text-sm text-zinc-500">
              No gallery images yet. Upload a few to showcase the project ✨
            </div>
          )}
        </Field>
      </Section>

      {/* STATS */}
      <Section title="Impact Stats" subtitle="Quantify outcomes & results">
        {f.stats.length === 0 && (
          <div className="rounded-lg border border-dashed p-4 text-sm text-zinc-500">No stats yet.</div>
        )}
        <div className="space-y-3">
          {f.stats.map((s, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-[1fr,2fr,auto]">
              <input className="input" value={s.value} onChange={(e) => updateStat(i, { value: e.target.value })} placeholder="+120%" />
              <input className="input" value={s.label} onChange={(e) => updateStat(i, { label: e.target.value })} placeholder="Conversion lift" />
              <button type="button" onClick={() => removeStat(i)} className="btn-danger"><FiTrash2 /> Remove</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addStat} className="btn-subtle mt-3"><FiPlus /> Add stat</button>
      </Section>

      {/* SEO */}
      <Section title="SEO (JSON-LD)" icon={<FiCode />} subtitle="Paste raw JSON-LD. We’ll store it as-is.">
        <Grid cols={2}>
          <Field label="Schema Markup (JSON-LD raw)">
            <textarea
              className="input min-h-[180px] w-full font-mono text-[12px]"
              value={f.schemaMarkup}
              onChange={(e) => onChange("schemaMarkup", e.target.value)}
              placeholder='{"@context":"https://schema.org","@type":"CreativeWork","name":"Crackpot Café & Bistro"}'
            />
            {!schemaValid && f.schemaMarkup.trim() && (
              <div className="mt-1 flex items-center gap-1 text-xs text-amber-700"><FiAlertCircle /> This doesn’t look like valid JSON. You can still save it.</div>
            )}
          </Field>

          <Field label="Quick Preview" hint="Rendered from parsed JSON (read-only)">
            <div className="rounded-lg border bg-zinc-50 p-3 text-xs">
              {schemaObj ? (
                <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words">{JSON.stringify(schemaObj, null, 2)}</pre>
              ) : (
                <div className="text-zinc-500">No valid JSON detected.</div>
              )}
            </div>
          </Field>
        </Grid>
      </Section>

      {/* sticky action bar */}
      <div className="sticky bottom-3 z-10 mt-4">
        <div className="flex items-center gap-3 rounded-xl border bg-white/90 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:backdrop-blur">
          <button disabled={submitting} className="btn-primary">
            {submitting ? (mode === "create" ? "Creating…" : "Saving…") : (mode === "create" ? "Create Project" : "Save Changes")}
          </button>
          <button type="button" onClick={() => history.back()} className="btn-plain">Cancel</button>
          <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
            <FiGlobe /> Slug will be used for fetching this project.
          </div>
        </div>
      </div>
    </form>
  );
}

/* ======= local UI bits ======= */
function Banner({ tone = "info", icon, children }) {
  const tones = {
    info:    "border-sky-200 bg-sky-50 text-sky-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error:   "border-red-200 bg-red-50 text-red-800",
  }[tone] || "border-zinc-200 bg-zinc-50 text-zinc-800";
  return (
    <div className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${tones}`}>
      <span className="mt-0.5">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

function Section({ title, icon, subtitle, children }) {
  return (
    <section className="section-card">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 shadow-inner">
            {icon || <FiType />}
          </div>
          <div>
            <h2 className="text-base font-semibold tracking-tight">{title}</h2>
            {subtitle ? <p className="text-xs text-zinc-500">{subtitle}</p> : null}
          </div>
        </div>
      </div>
      {children}
    </section>
  );
}

function Grid({ cols = 3, children }) {
  const cls = cols === 2 ? "md:grid-cols-2" : cols === 1 ? "md:grid-cols-1" : "md:grid-cols-3";
  return <div className={`grid gap-3 ${cls}`}>{children}</div>;
}

function Field({ label, hint, icon, children }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-800">
          {icon ? <span className="text-zinc-500">{icon}</span> : null}
          <span>{label}</span>
        </div>
        {hint && <div className="text-xs text-zinc-500">{hint}</div>}
      </div>
      {children}
    </label>
  );
}

 