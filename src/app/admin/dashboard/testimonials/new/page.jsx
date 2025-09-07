"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import CloudinaryUploader from "@/components/CloudinaryUploader";

export default function NewTestimonialPage() {
  const router = useRouter();
  const [f, setF] = useState({
    name: "",
    role: "",
    location: "",
    message: "",
    image: { src: "", alt: "" },
    order: 0,
    active: true,
  });
  const [saving, setSaving] = useState(false);
  const onChange = (k, v) => setF((s) => ({ ...s, [k]: v }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error("Create failed");
      router.push("/admin/dashboard/testimonials");
    } catch (e2) {
      alert(e2.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl mt-20 px-5 sm:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">New Testimonial</h1>
      <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border bg-white p-5">
        <input className="input w-full" placeholder="Name *" value={f.name} onChange={(e)=>onChange("name", e.target.value)} />
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Role" value={f.role} onChange={(e)=>onChange("role", e.target.value)} />
          <input className="input" placeholder="Location" value={f.location} onChange={(e)=>onChange("location", e.target.value)} />
        </div>
        <textarea className="input min-h-[120px]" placeholder="Message *" value={f.message} onChange={(e)=>onChange("message", e.target.value)} />
        <div>
          <div className="mb-1 text-sm font-medium">Photo (Cloudinary)</div>
          <CloudinaryUploader multiple={false} value={f.image?.src} onChange={(url)=>onChange("image",{...f.image, src:url})} />
          {f.image?.src ? <img src={f.image.src} alt="" className="mt-3 h-24 rounded-lg object-cover" /> : null}
          <input className="input mt-2" placeholder="Alt text" value={f.image?.alt || ""} onChange={(e)=>onChange("image",{...f.image, alt:e.target.value})} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <input className="input" placeholder="Order" value={f.order} onChange={(e)=>onChange("order", e.target.value.replace(/[^\d-]/g,""))} />
          <select className="input" value={String(f.active)} onChange={(e)=>onChange("active", e.target.value==="true")}>
            <option value="true">active: true</option>
            <option value="false">active: false</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button disabled={saving} className="rounded bg-zinc-900 px-4 py-2 text-sm text-white">{saving?"Saving…":"Save"}</button>
          <button type="button" className="rounded border px-4 py-2 text-sm" onClick={()=>history.back()}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

/* add in globals.css for convenience
@layer components {
  .input { @apply rounded-lg border-2 border-zinc-200 bg-white px-3 py-2 outline-none focus:border-zinc-300; }
}
*/