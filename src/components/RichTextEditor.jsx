'use client';

import { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Table from '@editorjs/table';

export default function EditorJSRenderer({ value, onChange }) {
  const editorRef = useRef(null);
  const holderRef = useRef(null);

  useEffect(() => {
    if (!holderRef.current || editorRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      data: value || {},
      autofocus: true,
      tools: {
        header: Header,
        list: List,
        table: Table,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

                const res = await fetch(
                  `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                  { method: 'POST', body: formData }
                );

                const data = await res.json();
                return {
                  success: 1,
                  file: { url: data.secure_url },
                };
              },
            },
          },
        },
      },
      onChange: async () => {
        const saved = await editor.saver.save();
        onChange?.(saved);
      },
    });

    editorRef.current = editor;

    return () => {
      editor.isReady
        .then(() => editor.destroy())
        .catch((e) => console.warn('Editor cleanup error:', e));
      editorRef.current = null;
    };
  }, []); // EMPTY dependencies → ensures it only runs ONCE

  return (
    <div>
      <div ref={holderRef} className="border rounded-xl p-4 bg-white" />
    </div>
  );
}
