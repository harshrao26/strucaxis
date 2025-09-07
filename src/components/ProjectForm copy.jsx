"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiAlertCircle, FiCheckCircle, FiHash, FiLink, FiTag, FiTrash2, FiPlus,
  FiType, FiUser, FiCalendar, FiMove, FiChevronUp, FiChevronDown, FiFilm,
  FiImage, FiPlayCircle, FiGlobe, FiCode
} from "react-icons/fi";
import CloudinaryUploader from "./CloudinaryUploader";
import './global.css'

/**
 * Beautiful, admin-friendly Project Form
 * - JS/JSX only, Tailwind + React Icons
 * - Works with your /api/feature-projects endpoints
 * - Slug helper, tag chips, stats builder
 * - Gallery upload with ALT fields + reorder
 * - Soft JSON-LD validation with preview
 *
 * Props:
 *  - mode: "create" | "edit"
 *  - initial: object (optional)
 *  - onSubmit: async (payload) => result
 */
export default function ProjectForm({ mode = "create", initial = {}, onSubmit }) {
  const router = useRouter();

  // ---------- form state ----------
  const [f, setF] = useState(() => ({
    title: initial.title || "",
    slug: initial.slug || "",
    client: initial.client || "",
    year: initial.year || "",
    description: initial.description || "",
    coverImage: initial.coverImage || "",
    coverAlt: initial.coverAlt || "",
    mediaUrl: initial.mediaUrl || "",
    caseStudyUrl: initial.caseStudyUrl || "",
    featured: typeof initial.featured === "boolean" ? initial.featured : true,

    // tags (chips)
    tags: Array.isArray(initial.tags) ? initial.tags : [],

    // gallery: prefer structured; if only legacy exists, hydrate from that
    gallery: Array.isArray(initial.gallery) && initial.gallery.length > 0
      ? initial.gallery
      : (Array.isArray(initial.galleryImages) ? initial.galleryImages.map((src) => ({ src, alt: "" })) : []),

    // stats array of { value, label }
    stats: Array.isArray(initial.stats) ? initial.stats : [],

    // raw JSON string
    schemaMarkup: initial.schemaMarkup || "",
  }));

  const [submitting, setSubmitting] = useState(false);
  const [schemaValid, setSchemaValid] = useState(true);
  const [schemaObj, setSchemaObj] = useState(null);
  const [error, setError] = useState(null);
  const [okMsg, setOkMsg] = useState(null);

  // ---------- helpers ----------
  const onChange = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const slugify = (s) =>
    s
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+|-+$/g, "");

  useEffect(() => {
    // keep slug neat on title changes if slug is empty (create mode nicety)
    if (mode === "create" && !f.slug && f.title) {
      onChange("slug", slugify(f.title));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.title]);

  // live JSON-LD check (soft)
  useEffect(() => {
    const raw = f.schemaMarkup?.trim();
    if (!raw) { setSchemaValid(true); setSchemaObj(null); return; }
    try {
      const parsed = JSON.parse(raw);
      setSchemaValid(true);
      setSchemaObj(parsed);
    } catch {
      setSchemaValid(false);
      setSchemaObj(null);
    }
  }, [f.schemaMarkup]);

  const validate = () => {
    if (!f.title.trim()) return "Title is required.";
    if (!f.slug.trim()) return "Slug is required.";
    if (/\s/.test(f.slug)) return "Slug cannot contain spaces.";
    return null;
  };

  // ---------- tags (chips) ----------
  const [tagInput, setTagInput] = useState("");
  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!f.tags.includes(t)) onChange("tags", [...f.tags, t]);
    setTagInput("");
  };
  const removeTag = (t) => onChange("tags", f.tags.filter((x) => x !== t));

  // ---------- stats ----------
  const addStat = () => onChange("stats", [...f.stats, { value: "", label: "" }]);
  const updateStat = (i, kv) => {
    const next = [...f.stats];
    next[i] = { ...next[i], ...kv };
    onChange("stats", next);
  };
  const removeStat = (i) => {
    const next = [...f.stats];
    next.splice(i, 1);
    onChange("stats", next);
  };

  // ---------- gallery ----------
  const addGalleryImages = (urls) => {
    const items = Array.isArray(urls) ? urls.map((src) => ({ src, alt: "" })) : [{ src: urls, alt: "" }];
    onChange("gallery", [...f.gallery, ...items]);
  };
  const setCoverFromGallery = (src, alt = "") => {
    onChange("coverImage", src);
    if (!f.coverAlt) onChange("coverAlt", alt);
  };
  const updateGalleryAlt = (i, alt) => {
    const next = [...f.gallery];
    next[i] = { ...next[i], alt };
    onChange("gallery", next);
  };
  const removeGalleryAt = (i) => {
    const next = [...f.gallery];
    next.splice(i, 1);
    onChange("gallery", next);
  };
  const moveGallery = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= f.gallery.length) return;
    const next = [...f.gallery];
    [next[i], next[j]] = [next[j], next[i]];
    onChange("gallery", next);
  };

  // uploader adapters to our gallery state
  const galleryValue = useMemo(() => f.gallery.map((g) => g.src), [f.gallery]);

  // ---------- submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setOkMsg(null);

    const v = validate();
    if (v) { setError(v); return; }

    setSubmitting(true);
    try {
      const payload = {
        // basics
        title: f.title.trim(),
        slug: slugify(f.slug.trim()),
        client: f.client.trim(),
        year: f.year ? Number(f.year) : undefined,
        description: f.description.trim(),

        // taxonomy
        tags: f.tags,

        // media
        coverImage: f.coverImage.trim(),
        coverAlt: f.coverAlt.trim(),
        mediaUrl: f.mediaUrl.trim(),

        // gallery structured + legacy for backward-compat
        gallery: f.gallery.filter((x) => x?.src).map((x) => ({ src: x.src, alt: (x.alt || "").trim() })),
        galleryImages: f.gallery.filter((x) => x?.src).map((x) => x.src),

        // links & presentation
        caseStudyUrl: f.caseStudyUrl.trim(),
        featured: !!f.featured,

        // stats
        stats: (f.stats || []).filter((s) => s.value || s.label).map((s) => ({
          value: (s.value || "").trim(),
          label: (s.label || "").trim(),
        })),

        // SEO
        schemaMarkup: f.schemaMarkup, // store raw string (even if invalid)
      };

      await onSubmit(payload);
      setOkMsg(mode === "create" ? "Project created 🎉" : "Project updated ✅");
      setTimeout(() => router.push("/admin/feature-projects"), 700);
    } catch (e2) {
      setError(e2?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      {/* alerts */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <FiAlertCircle className="mt-0.5" /> <span>{error}</span>
        </div>
      )}
      {okMsg && (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <FiCheckCircle className="mt-0.5" /> <span>{okMsg}</span>
        </div>
      )}

      {/* basics */}
      <Section title="Basics" icon={<FiType />}>
        <Grid cols={3}>
          <Field label="Title *" icon={<FiType />}>
            <input
              className="input w-full"
              value={f.title}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Crackpot Café & Bistro"
            />
          </Field>
          <Field label="Slug *" icon={<FiHash />} hint="lowercase, hyphen separated">
            <div className="flex items-stretch gap-2">
              <input
                className="input w-full"
                value={f.slug}
                onChange={(e) => onChange("slug", slugify(e.target.value))}
                placeholder="crackpot-cafe-bistro"
              />
              <button
                type="button"
                onClick={() => onChange("slug", slugify(f.title || f.slug))}
                className="btn-subtle"
              >
                Auto
              </button>
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
            <select
              className="input w-full"
              value={String(f.featured)}
              onChange={(e) => onChange("featured", e.target.value === "true")}
            >
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

        <Field label="Description">
          <textarea
            className="input min-h-[140px] w-full"
            value={f.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Long-form description…"
          />
        </Field>
      </Section>

      {/* tags */}
      <Section title="Tags" icon={<FiTag />}>
        <div className="flex flex-wrap items-center gap-2">
          {f.tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
              {t}
              <button type="button" onClick={() => removeTag(t)} className="rounded-full p-0.5 hover:bg-zinc-200">
                <FiTrash2 />
              </button>
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

      {/* media */}
      <Section title="Media" icon={<FiImage />}>
        <Grid cols={3}>
          <Field label="Cover Image" icon={<FiImage />} hint="Used on cards & hero">
            <CloudinaryUploader
              label="Upload cover image"
              multiple={false}
              value={f.coverImage}
              onChange={(url) => onChange("coverImage", url)}
            />
            {f.coverImage && (
              <div className="mt-3 overflow-hidden rounded-lg border">
                <img src={f.coverImage} alt="" className="h-36 w-full object-cover" />
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

        {/* gallery */}
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
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {f.gallery.map((g, i) => (
                <div key={g.src + i} className="rounded-lg border bg-white p-3">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img src={g.src} alt="" className="h-24 w-32 rounded border object-cover" />
                      <button
                        type="button"
                        title="Set as cover"
                        onClick={() => setCoverFromGallery(g.src, g.alt)}
                        className="absolute bottom-1 left-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] ring-1 ring-zinc-200 hover:bg-white"
                      >
                        Set cover
                      </button>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs mb-1 text-zinc-600">Alt text</div>
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
                        <button type="button" onClick={() => removeGalleryAt(i)} className="btn-danger text-xs">
                          <FiTrash2 /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded border border-dashed p-6 text-center text-sm text-zinc-500">
              No gallery images yet. Upload a few to showcase the project ✨
            </div>
          )}
        </Field>
      </Section>

      {/* stats */}
      <Section title="Impact Stats" icon={<FiMove />}>
        {f.stats.length === 0 && (
          <div className="rounded border border-dashed p-4 text-sm text-zinc-500">No stats yet.</div>
        )}
        <div className="space-y-3">
          {f.stats.map((s, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-[1fr,2fr,auto]">
              <input
                className="input"
                value={s.value}
                onChange={(e) => updateStat(i, { value: e.target.value })}
                placeholder="+120%"
              />
              <input
                className="input"
                value={s.label}
                onChange={(e) => updateStat(i, { label: e.target.value })}
                placeholder="Conversion lift"
              />
              <button type="button" onClick={() => removeStat(i)} className="btn-danger"><FiTrash2 /> Remove</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addStat} className="btn-subtle mt-3"><FiPlus /> Add stat</button>
      </Section>

      {/* SEO */}
      <Section title="SEO (JSON-LD)" icon={<FiCode />}>
        <Grid cols={2}>
          <Field label="Schema Markup (JSON-LD raw)">
            <textarea
              className="input min-h-[160px] w-full font-mono text-[12px]"
              value={f.schemaMarkup}
              onChange={(e) => onChange("schemaMarkup", e.target.value)}
              placeholder='{"@context":"https://schema.org","@type":"CreativeWork","name":"Crackpot Café & Bistro"}'
            />
            {!schemaValid && f.schemaMarkup.trim() && (
              <div className="mt-1 text-xs text-amber-700 flex items-center gap-1">
                <FiAlertCircle /> This doesn’t look like valid JSON. You can still save it.
              </div>
            )}
          </Field>

          <Field label="Quick Preview" hint="Rendered from parsed JSON (read-only)">
            <div className="rounded-lg border bg-zinc-50 p-3 text-xs">
              {schemaObj ? (
                <pre className="whitespace-pre-wrap break-words">{JSON.stringify(schemaObj, null, 2)}</pre>
              ) : (
                <div className="text-zinc-500">No valid JSON detected.</div>
              )}
            </div>
          </Field>
        </Grid>
      </Section>

      {/* actions */}
      <div className="flex items-center gap-3 pt-2">
        <button disabled={submitting} className="btn-primary">
          {submitting ? (mode === "create" ? "Creating…" : "Saving…") : (mode === "create" ? "Create Project" : "Save Changes")}
        </button>
        <button type="button" onClick={() => history.back()} className="btn-plain">Cancel</button>
        <div className="ml-auto text-xs text-zinc-500 flex items-center gap-2">
          <FiGlobe /> Slug will be used for fetching this project.
        </div>
      </div>
    </form>
  );
}

/* ---------- tiny UI helpers (local to this file) ---------- */

function Section({ title, icon, children }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 md:p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">{icon || <FiType />}</div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
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
      <div className="mb-1 flex items-center gap-2 text-sm font-medium text-zinc-800">
        {icon ? <span className="text-zinc-500">{icon}</span> : null}
        <span>{label}</span>
      </div>
      {children}
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </label>
  );
}

/* ---------- minimal Tailwind utility classes used in this file ----------

  .input      => rounded border-2 px-3 py-2 outline-none focus:border-zinc-300 border-zinc-200 bg-white
  .btn-primary=> rounded bg-zinc-900 text-white px-4 py-2 text-sm hover:bg-black disabled:opacity-50
  .btn-plain  => rounded border px-4 py-2 text-sm
  .btn-subtle => inline-flex items-center gap-2 rounded border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50
  .btn-icon   => inline-flex items-center justify-center rounded border border-zinc-200 bg-white p-1.5 hover:bg-zinc-50
  .btn-danger => inline-flex items-center gap-2 rounded border border-red-200 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50

Add these to your global CSS if you prefer semantic utilities:

@layer components {
  .input { @apply rounded border-2 px-3 py-2 outline-none focus:border-zinc-300 border-zinc-200 bg-white; }
  .btn-primary { @apply rounded bg-zinc-900 text-white px-4 py-2 text-sm hover:bg-black disabled:opacity-50; }
  .btn-plain { @apply rounded border px-4 py-2 text-sm; }
  .btn-subtle { @apply inline-flex items-center gap-2 rounded border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50; }
  .btn-icon { @apply inline-flex items-center justify-center rounded border border-zinc-200 bg-white p-1.5 hover:bg-zinc-50; }
  .btn-danger { @apply inline-flex items-center gap-2 rounded border border-red-200 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50; }
}

-------------------------------------------------------------------------- */