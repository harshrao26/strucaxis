"use client";

export function Row({ children }) {
  return <div className="grid gap-5 md:grid-cols-3">{children}</div>;
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium">{label}</div>
      {children}
      <style jsx>{`
        .input {
          all: unset;
          display: block;
          width: 100%;
          background: white;
          padding: 0.5rem 0.75rem;
          border: 1px solid rgb(212 212 216);
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }
        .input:focus { outline: 2px solid rgb(24 24 27 / 0.1); }
      `}</style>
    </label>
  );
}