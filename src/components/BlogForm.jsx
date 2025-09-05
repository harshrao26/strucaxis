"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import slugify from "slugify";
import {
  FiImage,
  FiUploadCloud,
  FiTrash2,
  FiPlus,
  FiExternalLink,
  FiCheck,
  FiX,
  FiInfo,
  FiLink,
  FiTag,
  FiMapPin,
  FiPhone,
  FiGlobe,
} from "react-icons/fi";

/* Rich text stays as you had it */
const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false });

/* Cloudinary env (preset-based, unsigned) */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "trygve-studio";

/* --------------------------- Category Hierarchy --------------------------- */
// Top-level -> Sub-category -> optional Sub-sub items (array)
const CATEGORY_TREE = {
  "Residential Spaces": {
    "Luxury Villas": [],
    "Modern Villas": [],
    "Classical Villas": [],
    "Vastu-Compliant Villas": [],
    "Apartments & Penthouses": [],
    "Duplex Apartments": [],
    "High-Rise Apartments": [],
    "Serviced Apartments": [],
    "Bungalows": [],
    "Contemporary": [],
    "Heritage / Restored": [],
    "Sustainable / Eco-Homes": [],
    "Vacation Homes": [],
    "Hill Retreats": [],
    "Beach Houses": [],
    "Farm Retreats": [],
  },
  "Commercial Spaces": {
    "Hotels & Resorts": [],
    "Luxury Resorts": [],
    "Business Hotels": [],
    "Boutique Stays": [],
    "Cafes & Restaurants": [],
    "Quick-Service Cafes": [],
    "Fine Dining": [],
    "Themed Restaurants": [],
    "Salons & Spas": [],
    "Luxury Spas": [],
    "Urban Salons": [],
    "Wellness Retreats": [],
    "Showrooms & Retail": [],
    "Flagship Stores": [],
    "Pop-Up Retail": [],
    "Shopping Galleries": [],
  },
  "Workplace Design": {
    "Corporate Offices": ["Headquarters", "Branch Offices", "Training Centres"],
    "Co-working Spaces": ["Startup Hubs", "Shared Studios", "Innovation Labs"],
    "Studios & Creative Spaces": ["Design Studios", "Production Studios", "Art Studios"],
  },
  "Hospitality & Leisure": {
    "Boutique Hotels": ["Urban Boutique", "Heritage Boutique", "Lifestyle Boutique"],
    "Bars & Lounges": ["Rooftop Lounges", "Luxury Bars", "Speakeasy Concepts"],
    "Wellness Centres": ["Yoga Retreats", "Ayurvedic Centres", "Fitness Clubs"],
  },
  "Public & Institutional": {
    "Educational Buildings": ["Schools", "Colleges", "Training Institutes"],
    "Cultural Spaces": ["Museums", "Art Centres", "Auditoriums"],
    "Community Centres": [],
    "Libraries": [],
    "Clubs": [],
    "Civic Halls": [],
  },
};

/* ----------------------------- Helpers -------------------------------- */

const cx = (...c) => c.filter(Boolean).join(" ");

const Counter = ({ value = "", max = 160 }) => {
  const len = value?.length ?? 0;
  const warn = len > max;
  return (
    <span className={cx("text-xs", warn ? "text-red-600" : "text-neutral-500")}>
      {len}/{max}
    </span>
  );
};

function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

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

/* --------------------------- Reusable UI ------------------------------- */

function Card({ title, hint, right, children }) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white/95 shadow-[0_20px_70px_rgba(0,0,0,0.06)]">
      <header className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {hint && <p className="text-xs text-neutral-600 mt-0.5">{hint}</p>}
        </div>
        {right}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({ label, hint, children, after }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm text-neutral-800">{label}</span>
        {after}
      </div>
      {children}
      {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
    </label>
  );
}

function Input({ className, ...props }) {
  return (
    <input
      {...props}
      className={cx(
        "w-full rounded-lg border border-black/15 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/20",
        className
      )}
    />
  );
}

function Select({ className, children, ...props }) {
  return (
    <select
      {...props}
      className={cx(
        "w-full rounded-lg border border-black/15 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black/20",
        className
      )}
    >
      {children}
    </select>
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 outline-none min-h-[110px] focus:ring-2 focus:ring-black/20"
    />
  );
}

function Chip({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F1EC] border border-black/10 px-3 py-1 text-xs">
      {children}
      {onRemove && (
        <button
          type="button"
          className="rounded-full p-0.5 hover:bg-black/10"
          onClick={onRemove}
          aria-label="Remove"
        >
          <FiX className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

/* ----------------------------- Main Form ------------------------------- */

export default function BlogForm({ initialData = {}, onSubmit }) {
  const [uploading, setUploading] = useState(false);
  const [coverProg, setCoverProg] = useState(0);

  const [form, setForm] = useState({
    title: "",
    urlSlug: "",
    image: "",
    video: "",
    category: "",
    subCategory: "",
    subSubCategory: "",
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    connectedServices: [],
    relatedBlog: "",
    content: "",
    schemaMarkup: "",
    faqs: [],
    locations: "",
    businessName: "",
    address: "",
    phone: "",
    websiteName: "",
    serviceSpecificPage: "",
    focusKeyword: "",
    author: "",
    status: "visible",
    ...initialData,
  });

  // Derived lists for Category -> Sub -> SubSub
  const categoryOptions = useMemo(() => Object.keys(CATEGORY_TREE), []);
  const subCategoryOptions = useMemo(() => {
    const node = CATEGORY_TREE[form.category] || {};
    return Object.keys(node);
  }, [form.category]);
  const subSubCategoryOptions = useMemo(() => {
    const node = CATEGORY_TREE[form.category] || {};
    const arr = node[form.subCategory] || [];
    return Array.isArray(arr) ? arr : [];
  }, [form.category, form.subCategory]);

  // Keep dependent fields in sync
  const onCategoryChange = (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, category: value, subCategory: "", subSubCategory: "" }));
  };
  const onSubCategoryChange = (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, subCategory: value, subSubCategory: "" }));
  };

  /* Auto-slug (only when slug not manually set initially) */
  const debTitle = useDebounced(form.title, 250);
  useEffect(() => {
    if (!initialData.urlSlug) {
      setForm((prev) => ({
        ...prev,
        urlSlug: slugify(debTitle || "", { lower: true, strict: true }),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debTitle]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /* FAQs */
  const addFAQ = () => setForm((f) => ({ ...f, faqs: [...f.faqs, { question: "", answer: "" }] }));
  const updateFAQ = (i, k, v) =>
    setForm((f) => {
      const faqs = [...f.faqs];
      faqs[i][k] = v;
      return { ...f, faqs };
    });
  const removeFAQ = (i) =>
    setForm((f) => {
      const faqs = [...f.faqs];
      faqs.splice(i, 1);
      return { ...f, faqs };
    });

  /* Connected Services */
  const addService = () =>
    setForm((f) => ({ ...f, connectedServices: [...f.connectedServices, { name: "", link: "" }] }));
  const updateService = (i, k, v) =>
    setForm((f) => {
      const s = [...f.connectedServices];
      s[i][k] = v;
      return { ...f, connectedServices: s };
    });
  const removeService = (i) =>
    setForm((f) => {
      const s = [...f.connectedServices];
      s.splice(i, 1);
      return { ...f, connectedServices: s };
    });

  /* Cloudinary */
  const fileInputRef = useRef(null);

  const onPickCover = () => fileInputRef.current?.click();

  const handleCoverFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setCoverProg(0);
    try {
      const url = await uploadToCloudinary(file, setCoverProg);
      setForm((f) => ({ ...f, image: url }));
    } catch (e) {
      alert(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onDropCover = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) handleCoverFile(f);
  };

  /* Chips */
  const keywords = useMemo(
    () =>
      (form.focusKeyword || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [form.focusKeyword]
  );
  const locations = useMemo(
    () =>
      (form.locations || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [form.locations]
  );
  const relatedBlogs = useMemo(
    () =>
      (form.relatedBlog || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    [form.relatedBlog]
  );

  const removeChip = (kind, value) => {
    const map = {
      focusKeyword: keywords,
      locations,
      relatedBlog: relatedBlogs,
    };
    const next = map[kind].filter((x) => x !== value).join(", ");
    setForm((f) => ({ ...f, [kind]: next }));
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      urlSlug: form.urlSlug,
      content: typeof form.content === "object" ? JSON.stringify(form.content) : form.content,
      focusKeyword: keywords,
      locations,
      relatedBlog: relatedBlogs,
    };
    await onSubmit(payload);
  };

  /* ------------------------------ UI ------------------------------ */

  return (
    <form onSubmit={handleSubmit} className="bg-[#F4F1EC]">
      {/* Page header */}
      <div className="max-w-7xl mx-auto md:px-0 px-4 pt-24 pb-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs tracking-wider uppercase text-neutral-600">Editor</p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Blog Editor</h1>
            <p className="mt-2 text-neutral-700">
              Craft content, optimize SEO, and manage business metadata — all in one place.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
           
            <button
              type="submit"
              disabled={uploading}
              className="rounded-full   bg-[#FF4017] px-5 py-2 text-sm   text-white inline-flex items-center gap-2 disabled:opacity-50"
            >
              <FiCheck /> Publish
            </button>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="max-w-7xl mx-auto px-5 pb-14 grid md:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="md:col-span-8 space-y-6">
          {/* Content */}
          {/* Content */}
<Card
  title="Content"
  hint="Write your article content below. Supports headings, images, embeds, and more."
  right={
    <span className="text-xs text-neutral-500 inline-flex items-center gap-1">
      <FiInfo /> Rich text
    </span>
  }
>
  {(() => {
    // Freeze the initial content so React re-renders don’t reset the editor
    const initialContentRef = useRef(
      typeof form.content === "object" ? form.content : (form.content || {})
    );

    const handleEditorChange = (val) => {
      // `val` is Editor.js saved data
      setForm((f) => ({ ...f, content: val }));
    };

    const onImageUpload = async (file) => {
      // Reuse your Cloudinary uploader; progress bar is optional here
      const url = await uploadToCloudinary(file);
      return url; // Editor will insert this
    };

    return (
      <RichTextEditor
        defaultValue={initialContentRef.current}
        onChange={handleEditorChange}
        onImageUpload={onImageUpload}
      />
    );
  })()}
</Card>
          {/* Basic Info */}
          <Card title="Basics" hint="Title, slug, status, author & media.">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Page Title" after={<Counter value={form.title} max={120} />}>
                <Input name="title" value={form.title} onChange={handleChange} />
              </Field>

              <Field
                label="URL Slug"
                hint={`Permalink: /blog/${form.urlSlug || "…"} `}
              >
                <Input name="urlSlug" value={form.urlSlug} onChange={handleChange} />
              </Field>

              <Field label="Status">
                <Select name="status" value={form.status} onChange={handleChange}>
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                </Select>
              </Field>

              <Field label="Author">
                <Input name="author" value={form.author} onChange={handleChange} />
              </Field>
            </div>

            {/* Media */}
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <Field label="Cover Image">
                <div
                  onClick={onPickCover}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={onDropCover}
                  className="rounded-xl border border-dashed border-black/20 bg-[#F4F1EC] px-4 py-8 text-center cursor-pointer hover:bg-[#EEE9E1] transition"
                >
                  <div className="flex items-center justify-center gap-2 text-neutral-700">
                    <FiImage />
                    <span className="text-sm">
                      Drag & drop or click to upload cover image
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCoverFile(e.target.files?.[0])}
                  />
                </div>

                {(form.image || coverProg > 0) && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-black/10 bg-white">
                    {form.image ? (
                      <img src={form.image} alt="cover" className="h-40 w-full object-cover" />
                    ) : (
                      <div className="h-40 w-full bg-neutral-200 animate-pulse" />
                    )}
                    {uploading && (
                      <div className="h-1.5 bg-black/10">
                        <div className="h-full bg-black" style={{ width: `${coverProg}%` }} />
                      </div>
                    )}
                  </div>
                )}
              </Field>

              <Field label="Video (YouTube URL)">
                <Input name="video" value={form.video} onChange={handleChange} placeholder="https://youtu.be/…" />
              </Field>
            </div>
          </Card>

          {/* Categories */}
          <Card title="Categories" hint="Organize your content for discovery.">
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="Category">
                <Select name="category" value={form.category} onChange={onCategoryChange}>
                  <option value="">Select Category</option>
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Sub Category">
                <Select
                  name="subCategory"
                  value={form.subCategory}
                  onChange={onSubCategoryChange}
                  disabled={!form.category}
                >
                  <option value="">{form.category ? "Select Sub Category" : "Pick a category first"}</option>
                  {subCategoryOptions.map((sc) => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </Select>
              </Field>

              <Field label="Sub Sub Category">
                <Select
                  name="subSubCategory"
                  value={form.subSubCategory}
                  onChange={handleChange}
                  disabled={!form.subCategory || subSubCategoryOptions.length === 0}
                >
                  <option value="">{form.subCategory ? (subSubCategoryOptions.length ? "Select Sub Sub Category" : "No further levels") : "Pick a sub category first"}</option>
                  {subSubCategoryOptions.map((ssc) => (
                    <option key={ssc} value={ssc}>{ssc}</option>
                  ))}
                </Select>
              </Field>
            </div>
          </Card>

          {/* SEO */}
          <Card title="SEO Metadata" hint="Craft how your post appears on search engines.">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Meta Title" after={<Counter value={form.metaTitle} max={60} />}>
                <Input name="metaTitle" value={form.metaTitle} onChange={handleChange} />
              </Field>
              <Field label="Canonical URL">
                <Input name="canonicalUrl" value={form.canonicalUrl} onChange={handleChange} placeholder="https://example.com/blog/..." />
              </Field>
              <Field
                label="Meta Description"
                after={<Counter value={form.metaDescription} max={160} />}
              >
                <Textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} />
              </Field>
              <Field label="Website Name">
                <Input name="websiteName" value={form.websiteName} onChange={handleChange} />
              </Field>
            </div>
          </Card>

          {/* Schema */}
          <Card title="Schema Markup" hint="Paste JSON-LD for rich results.">
            <Textarea
              name="schemaMarkup"
              placeholder='{\n  "@context": "https://schema.org",\n  "@type": "BlogPosting",\n  ...\n}'
              rows={6}
              value={form.schemaMarkup}
              onChange={handleChange}
            />
          </Card>

          {/* FAQs */}
          <Card
            title="FAQs"
            hint="Add common questions to boost helpfulness and eligibility for rich results."
            right={
              <button type="button" onClick={addFAQ} className="inline-flex items-center gap-2 rounded-full border border-black px-3 py-1.5 text-sm hover:bg-black hover:text-white">
                <FiPlus /> Add FAQ
              </button>
            }
          >
            {form.faqs.length === 0 ? (
              <p className="text-sm text-neutral-600">No FAQs yet.</p>
            ) : (
              <div className="space-y-3">
                {form.faqs.map((faq, i) => (
                  <div key={i} className="rounded-xl border border-black/10 p-3 relative">
                    <button
                      type="button"
                      onClick={() => removeFAQ(i)}
                      className="absolute right-3 top-3 text-neutral-500 hover:text-red-600"
                      aria-label="Remove FAQ"
                    >
                      <FiTrash2 />
                    </button>
                    <Field label={`Question ${i + 1}`}>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFAQ(i, "question", e.target.value)}
                        placeholder="What is the turnaround time?"
                      />
                    </Field>
                    <Field label="Answer">
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(i, "answer", e.target.value)}
                        placeholder="We typically deliver within 7-10 business days…"
                      />
                    </Field>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-4 space-y-6">
          {/* Business */}
          <Card title="Business Details" hint="Optional — appear alongside your article.">
            <div className="grid gap-3">
              <Field label="Business Name">
                <Input name="businessName" value={form.businessName} onChange={handleChange} />
              </Field>
              <Field label="Address" hint="Street, City, Country">
                <Input name="address" value={form.address} onChange={handleChange} />
              </Field>
              <div className="grid grid-cols-1 gap-3">
                <Field label="Phone">
                  <Input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 …" />
                </Field>
                 
              </div>
            </div>
          </Card>

         

          {/* Keywords, Locations, Related */}
          <Card title="Advanced & Related" hint="Keywords help SEO; locations help local context.">
            <Field label="Focus Keywords (comma separated)" after={<FiTag className="text-neutral-500" />}>
              <Input
                name="focusKeyword"
                value={form.focusKeyword}
                onChange={handleChange}
                placeholder="modern interior, warm wood, daylight"
              />
              {keywords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {keywords.map((k) => (
                    <Chip key={k} onRemove={() => removeChip("focusKeyword", k)}>{k}</Chip>
                  ))}
                </div>
              )}
            </Field>

            <Field label="Locations (comma separated)" after={<FiMapPin className="text-neutral-500" />}>
              <Input
                name="locations"
                value={form.locations}
                onChange={handleChange}
                placeholder="Nairobi, Mumbai, Kyoto"
              />
              {locations.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {locations.map((k) => (
                    <Chip key={k} onRemove={() => removeChip("locations", k)}>{k}</Chip>
                  ))}
                </div>
              )}
            </Field>

          
          </Card>

          {/* Sticky actions (mobile) */}
          <div className="md:hidden sticky bottom-4 flex justify-end">
            <div className="inline-flex gap-2 rounded-full border border-black/15 bg-white/95 px-3 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
              <button
                type="button"
                onClick={() => window.open(`/blog/${form.urlSlug || ""}`, "_blank")}
                className="rounded-full border border-black/20 px-3 py-1.5 text-sm hover:bg-black/5"
              >
                Preview
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="rounded-full border border-black px-3 py-1.5 bg-[#234D7E] text-sm   hover:text-white disabled: opacity-50"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}