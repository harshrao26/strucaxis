"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CloudinaryUploader from "@/components/CloudinaryUploader";

export default function EditTestimonialPage({ params }) {
  const { id } = params;
  const router = useRouter();

  const [f, setF] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const onChange = (k, v) => setF((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/testimonials/${id}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) { alert(json?.error || "Not found"); router.push("/admin/dashboard/testimonials"); return; }
      setF({
        name: json.name || "",
        role: json.role || "",
        location: json.location || "",
        message: json.message || "",
        image: json.image || { src: "", alt: "" },
        order: typeof json.order === "number" ? json.order : 0,
        active: json.active !== false,
      });
      setLoading(false);
    })();
  }, [id, router]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error("Update failed");
      router.push("/admin/dashboard/testimonials");
    } catch (e2) {
      alert(e2.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !f) return <div className="mx-auto max-w-3xl px-5 py-8 text-sm text-zinc-500">Loading…</div>;

  return (
    <div className="mx-auto max-w-7xl mt-20 px-5 sm:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Testimonial</h1>
      <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border bg-white p-5">
        <input className="input w-full" value={f.name} onChange={(e)=>onChange("name", e.target.value)} />
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" value={f.role} onChange={(e)=>onChange("role", e.target.value)} />
          <input className="input" value={f.location} onChange={(e)=>onChange("location", e.target.value)} />
        </div>
        <textarea className="input min-h-[120px]" value={f.message} onChange={(e)=>onChange("message", e.target.value)} />
        <div>
          <div className="mb-1 text-sm font-medium">Photo</div>
          <CloudinaryUploader multiple={false} value={f.image?.src} onChange={(url)=>onChange("image",{...f.image, src:url})} />
          {f.image?.src ? <img src={f.image.src} alt="" className="mt-3 h-24 rounded-lg object-cover" /> : null}
          <input className="input mt-2" placeholder="Alt text" value={f.image?.alt || ""} onChange={(e)=>onChange("image",{...f.image, alt:e.target.value})} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="input" value={f.order} onChange={(e)=>onChange("order", e.target.value.replace(/[^\d-]/g,""))} />
          <select className="input" value={String(f.active)} onChange={(e)=>onChange("active", e.target.value==="true")}>
            <option value="true">active: true</option>
            <option value="false">active: false</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button disabled={saving} className="rounded bg-zinc-900 px-4 py-2 text-sm text-white">{saving?"Saving…":"Save changes"}</button>
          <button type="button" className="rounded border px-4 py-2 text-sm" onClick={()=>history.back()}>Cancel</button>
        </div>
      </form>
    </div>
  );
}