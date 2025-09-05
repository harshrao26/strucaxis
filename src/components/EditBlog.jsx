"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BlogForm from "@/components/BlogForm";

export default function EditBlog() {
  const { id: slug } = useParams();
  const router = useRouter();

  const [blogData, setBlogData] = useState(null);
  const [originalSlug, setOriginalSlug] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        const data = await res.json();

        if (res.ok && data) {
          setBlogData({
            ...data,
            locations: data.locations?.join(", ") || "",
            focusKeyword: data.focusKeyword?.join(", ") || "",
            relatedBlog: data.relatedBlog?.join(", ") || "",
            content:
              typeof data.content === "string"
                ? JSON.parse(data.content)
                : data.content, // ✅ FIX here
          });
          setOriginalSlug(data.urlSlug);
        } else {
          alert("Blog not found");
          router.push("/admin/dashboard/blogs");
        }
      } catch (err) {
        console.error("Error loading blog:", err);
        alert("Error loading blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleUpdate = async (updatedData) => {
    try {
      const res = await fetch(`/api/blogs/${originalSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Blog updated successfully");

        // Redirect only if slug has changed
        const newSlug = result.blog.urlSlug;
        if (newSlug !== originalSlug) {
          router.push(`/admin/dashboard/blogs/${newSlug}`);
        } else {
          router.push("/admin/dashboard/blogs");
        }
      } else {
        alert("Update failed: " + result?.error || "Unknown error");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Update error");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="">
       {blogData && <BlogForm initialData={blogData} onSubmit={handleUpdate} />}
    </div>
  );
}

