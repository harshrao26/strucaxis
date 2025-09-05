"use client";

import React from "react";

// Utility: Clean raw text
function cleanText(input = "") {
  return String(input || "")
    .replace(/&nbsp;/g, " ")
    .replace(/<br\s*\/?>/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Utility: Clean inline HTML
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

// ✅ Main Read-Only Renderer Component
export default function EditorJsRenderer({ content }) {
  if (!content || !content.blocks) return null;
  function decodeHtmlEntities(str) {
    if (typeof window !== "undefined") {
      const txt = document.createElement("textarea");
      txt.innerHTML = str;
      return txt.value;
    }
    return str;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-gray-800 [&_a]:text-blue-600 [&_a]:underline">
      {content.blocks.map((block) => {
        const { type, data, id } = block;

        switch (type) {
          case "header": {
            const Tag = `h${data.level || 2}`;
            const sizes = {
              1: "text-4xl",
              2: "text-3xl",
              3: "text-2xl",
              4: "text-xl",
              5: "text-lg",
              6: "text-base",
            };
            const text = decodeHtmlEntities(cleanText(data.text));
            if (!text) return null;
            return (
              <Tag
                key={id}
                className={`${sizes[data.level] || "text-xl"} font-medium  mt-6`}
              >
                {text}
              </Tag>
            );
          }

          case "paragraph": {
            const cleaned = cleanHtml(data.text);
            if (!cleaned) return null;
            return (
              <div
                key={id}
                className="text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: cleaned }}
              />
            );
          }

          case "list": {
            if (!Array.isArray(data.items)) return null;

            const items = data.items
              .map((item) => {
                if (typeof item === "string") return cleanText(item);
                if (typeof item === "object" && item.content)
                  return cleanText(item.content);
                if (typeof item === "object" && item.text)
                  return cleanText(item.text);
                return "";
              })
              .filter(Boolean);

            if (!items.length) return null;

            const Tag = data.style === "ordered" ? "ol" : "ul";
            const listClass =
              data.style === "ordered"
                ? "list-decimal ml-6 text-base"
                : "list-disc ml-6 text-base";

            return (
              <Tag key={id} className={listClass}>
                {items.map((item, i) => (
                  <li key={i} className="">
                    {item}
                  </li>
                ))}
              </Tag>
            );
          }

          case "image": {
            const url = data?.file?.url || data?.url;
            if (!url) return null;
            return (
              <div key={id} className="my-6">
                <img
                  src={url}
                  alt={data.caption || ""}
                  className="w-full max-h-[500px] object-contain rounded-lg shadow-md"
                />
                {data.caption && (
                  <p className="text-sm text-center text-gray-500 mt-2">
                    {cleanText(data.caption)}
                  </p>
                )}
              </div>
            );
          }

          case "table": {
            if (!Array.isArray(data.content)) return null;
            return (
              <div key={id} className="overflow-x-auto my-6">
                <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                  <tbody>
                    {data.content.map((row, i) => (
                      <tr key={i} className="even:bg-gray-50">
                        {row.map((cell, j) => (
                          <td key={j} className="border px-4 py-2">
                            {cleanText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case "quote": {
            const text = cleanText(data.text);
            if (!text) return null;
            return (
              <blockquote
                key={id}
                className="border-l-4 border-blue-500 pl-4 italic text-gray-700 text-lg bg-blue-50 p-4 rounded"
              >
                {text}
                {data.caption && (
                  <footer className="mt-2 text-sm text-blue-700 font-medium">
                    — {cleanText(data.caption)}
                  </footer>
                )}
              </blockquote>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
