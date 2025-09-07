"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiHash, FiImage, FiPlus, FiTrash2, FiType, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import CloudinaryUploader from "./CloudinaryUploader";

export default function CapabilityForm({ mode = "create", initial = {}, onSubmit }) {
  const router = useRouter();
  const si = initial ?? {};
  const [f, setF] = useState({
    title: si.title || "",
    slug: si.slug || "",
    subheading: si.subheading || "",
    services: Array.isArray(si.services) ? si.services : ["", "", "", "", ""], // you can add/remove
    images: Array.isArray(si.images) && si.images.length === 4 ? si.images : [{src:"",alt:""},{src:"",alt:""},{src:"",alt:""},{src:"",alt:""}],
    order: typeof si.order === "number" ? si.order : 0,
    active: typeof si.active === "boolean" ? si.active : true,
  });

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!f.slug && f.title && mode === "create") {
      const s = f.title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      setF((p) => ({ ...p, slug: s }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.title]);

  const onChange = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const validate = () => {
    if (!f.title.trim()) return "Title is required.";
    if (!f.slug.trim()) return "Slug is required.";
    const cleanServices = (f.services || []).map((s) => s.trim()).filter(Boolean);
    if (cleanServices.length < 1) return "Add at least one service line.";
    if (!Array.isArray(f.images) || f.images.length !== 4 || f.images.some(i => !i?.src)) return "Upload all 4 images.";
    return null;
  };

  const addService = () => onChange("services", [...(f.services || []), ""]);
  const removeService = (i) => {
    const next = [...f.services]; next.splice(i,1); onChange("services", next.length ? next : [""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    const v = validate();
    if (v) { setErr(v); return; }

    setSaving(true);
    try {
      const payload = {
        title: f.title.trim(),
        slug: f.slug.trim().toLowerCase(),
        subheading: f.subheading.trim(),
        services: (f.services || []).map(s => s.trim()).filter(Boolean),
        images: f.images.map(i => ({ src: i.src, alt: (i.alt || "").trim() })),
        order: Number(f.order) || 0,
        active: !!f.active,
      };
      await onSubmit(payload);
      setMsg(mode === "create" ? "Section created!" : "Section updated!");
      setTimeout(() => router.push("/admin/dashboard/capabilities"), 650);
    } catch (e2) {
      setErr(e2?.message || "Error saving section.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {err && <Banner tone="error"><FiAlertCircle /> {err}</Banner>}
      {msg && <Banner tone="success"><FiCheckCircle /> {msg}</Banner>}

      {/* Basics */}
      <Card title="Basics" icon={<FiType />}>
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Title *">
            <input className="input w-full" value={f.title} onChange={(e)=>onChange("title", e.target.value)} placeholder="Everything under one roof" />
          </Field>
          <Field label="Slug *" icon={<FiHash />}>
            <input className="input w-full" value={f.slug} onChange={(e)=>onChange("slug", e.target.value.toLowerCase().replace(/\s+/g,"-"))} placeholder="everything-under-one-roof" />
          </Field>
          <Field label="Order">
            <input className="input w-full" value={f.order} onChange={(e)=>onChange("order", e.target.value.replace(/[^\d-]/g,""))} placeholder="0" />
          </Field>
        </div>
        <Field label="Subheading">
          <textarea className="input w-full min-h-[110px]" value={f.subheading} onChange={(e)=>onChange("subheading", e.target.value)}
            placeholder="Our production clusters reduce dependency on third parties…" />
        </Field>
      </Card>

      {/* Services list */}
      <Card title="One-line services">
        <div className="space-y-3">
          {(f.services || []).map((line, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto] gap-2">
              <input className="input" value={line} onChange={(e)=> {
                const next = [...f.services]; next[i] = e.target.value; onChange("services", next);
              }} placeholder={i===0 ? "Carpentry & premium joinery (CNC enabled)" : "Service line"} />
              <button type="button" onClick={()=>removeService(i)} className="btn-danger"><FiTrash2 /> Remove</button>
            </div>
          ))}
          <button type="button" onClick={addService} className="btn-subtle"><FiPlus /> Add line</button>
        </div>
      </Card>

      {/* Images 4-up */}
      <Card title="Images (exactly 4)" icon={<FiImage />}>
        <div className="grid gap-4 md:grid-cols-2">
          {f.images.map((img, i) => (
            <div key={i} className="rounded-xl border p-3">
              <div className="text-sm font-medium mb-2">Image {i+1}</div>
              <CloudinaryUploader
                label={`Upload image ${i+1}`}
                multiple={false}
                value={img?.src || ""}
                onChange={(url) => {
                  const next = [...f.images]; next[i] = { ...(next[i]||{}), src: url }; onChange("images", next);
                }}
              />
              {img?.src && <img src={img.src} alt="" className="mt-3 aspect-video w-full rounded-lg object-cover" />}
              <div className="mt-2">
                <input className="input w-full" value={img?.alt || ""} onChange={(e)=>{
                  const next = [...f.images]; next[i] = { ...(next[i]||{}), alt: e.target.value }; onChange("images", next);
                }} placeholder="Alt text (SEO & a11y)" />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="sticky bottom-3 z-10">
        <div className="flex items-center gap-3 rounded-xl border bg-white/90 p-3 shadow-lg backdrop-blur">
          <button disabled={saving} className="btn-primary">{saving ? (mode==="create"?"Creating…":"Saving…") : (mode==="create"?"Create Section":"Save Changes")}</button>
          <button type="button" className="btn-plain" onClick={()=>history.back()}>Cancel</button>
        </div>
      </div>
    </form>
  );
}

function Card({ title, icon, children }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">{icon || <FiType />}</div>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
function Field({ label, icon, children }) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center gap-2 text-sm font-medium text-zinc-800">{icon}{label}</div>
      {children}
    </label>
  );
}
function Banner({ tone="info", children }) {
  const map = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-zinc-200 bg-zinc-50 text-zinc-800",
  }[tone];
  return <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${map}`}>{children}</div>;
}

/* Tailwind helpers (optional)
@layer components {
  .input { @apply rounded-lg border-2 border-zinc-200 bg-white px-3 py-2 outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-zinc-100; }
  .btn-primary { @apply inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-50; }
  .btn-plain { @apply inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm hover:bg-zinc-50; }
  .btn-subtle { @apply inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50; }
  .btn-danger { @apply inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-red-700 hover:bg-red-50; }
}
*/