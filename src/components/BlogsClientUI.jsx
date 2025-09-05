"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import EditorJsRenderer from "./EditorJsRenderer";
import BlogSidebarContactForm from "./BlogSidebarContactForm";

// Reusable text cleaner
function cleanText(input = "") {
  return String(input || "")
    .replace(/&nbsp;/g, " ")
    .replace(/<br\s*\/?>/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Safe HTML renderer (basic sanitization)
function cleanHtml(html = "") {
  const withoutScripts = html.replace(
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    ""
  );
  return withoutScripts
    .replace(/&nbsp;/g, " ")
    .replace(/<br\s*\/?>/gi, "")
    .trim();
}

// Renders content blocks

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-md">
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center w-full px-4 py-3 text-left hover:bg-gray-50"
      >
        <span className="font-medium text-gray-800">{faq.question}</span>
        <span className="text-blue-600">{open ? <FaMinus /> : <FaPlus />}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-gray-700 text-sm">{faq.answer}</div>
      )}
    </div>
  );
}

// ⬇ MAIN CLIENT COMPONENT ⬇
export default function BlogsClientUI({ blog }) {
  const [mounted, setMounted] = useState(false);

  // Safely parse Editor.js content
  const contentData = (() => {
    const raw = blog?.content;
    try {
      if (!raw) return null;
      if (typeof raw === "string") return JSON.parse(raw);
      if (typeof raw === "object") return raw;
      return null;
    } catch (e) {
      console.warn("EditorJS content parse failed:", e?.message);
      return null;
    }
  })();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh]  overflow-hidden">
        <img
          src={blog?.image || "/placeholder-hero.jpg"}
          alt={blog?.title || "Blog cover"}
          className="w-full h-full object-cover brightness-50 absolute"
        />
        <div className="absolute md:px-0 px-4 inset-0 flex flex-col justify-end px-0 md:px-10 pb-10 text-white max-w-7xl mx-auto">
          <span className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-xs font-medium w-fit mb-3">
            {blog.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold mb-3 special-font ">
            {blog.title}
          </h1>
          <p className="text-sm text-gray-300">
            {blog.author || "Unknown"} •{" "}
            {blog?.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }) : ""}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto md:px-0 px-4 mt-10 flex flex-col lg:flex-row gap-8">
        <div className="w-full">
          {contentData ? (
            <EditorJsRenderer content={contentData} />
          ) : (
            <div className="prose max-w-none">
              {/* Fallback: render sanitized HTML or plain text if content isn’t valid Editor.js JSON */}
              {typeof blog?.content === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: cleanHtml(blog.content) }} />
              ) : (
                <p className="text-slate-600">No content available.</p>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
      </div>

      {/* Connected Services */}
      {blog.connectedServices?.length > 0 && (
        <section className="max-w-7xl mx-auto py-10 md:px-0 px-4">
          <h2 className="text-2xl font-medium mb-4">Connected Services</h2>
          <ul className="list-disc list-inside">
            {blog.connectedServices.map((service, index) => (
              <li key={index}>
                <a
                  href={service.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {service.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQs */}
      {blog.faqs?.length > 0 && (
        <section className="max-w-7xl mx-auto py-10 px-4">
          <h2 className="text-2xl font-medium mb-4">FAQs</h2>
          <div className="space-y-4">
            {blog.faqs.map((faq) => (
              <FaqItem key={faq._id} faq={faq} />
            ))}
          </div>
        </section>
      )}

      {/* Related Blogs */}
      {blog.relatedBlog?.length > 0 && (
        <section className="max-w-7xl mx-auto py-10 px-4">
          <h2 className="text-2xl font-medium mb-4">Related Blogs</h2>
          <ul className="list-disc list-inside">
            {blog.relatedBlog.map((slug, index) => (
              <li key={index}>
                <a href={`/blogs/${slug}`} className="text-blue-600 underline">
                  {slug.replace(/-/g, " ")}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Business Info */}
      {/* {blog.businessName && (
        <section className="max-w-7xl mx-auto py-10 px-4">
          <h2 className="text-2xl font-medium mb-4">Business Information</h2>
          <p><strong>Name:</strong> {blog.businessName}</p>
          <p><strong>Address:</strong> {blog.address}</p>
          <p><strong>Phone:</strong> {blog.phone}</p>
        </section>
      )} */}
    </div>
  );
}
