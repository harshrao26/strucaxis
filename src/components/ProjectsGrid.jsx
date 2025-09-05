// components/ProjectsGrid.jsx
"use client";

const tiles = [
  { title: "PROJECTS", variant: "active" },
  { title: "RESIDENTIAL SPACES", variant: "white" },
  { title: "COMMERCIAL SPACES", variant: "gold" },
  { title: "WORKPLACE DESIGN", variant: "white" },
  { title: "HOSPITALITY & LEISURE", variant: "white" },
  { title: "CONCEPT & EXPERIMENTAL", variant: "gold" },
  { title: "ONGOING PROJECTS", variant: "white" },
  { title: "COMPLETED PROJECTS", variant: "gold" }
];

function PlusBadge({ hide }) {
  if (hide) return null;
  return (
    <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full border border-black text-[14px] font-bold leading-none">
      +
    </span>
  );
}

function Tile({ title, variant }) {
  const isActive = variant === "active";
  const isGold = variant === "gold";
  const base = "relative h-[220px] md:h-[240px] px-6 py-6 select-none";

  const bg = isActive
    ? "bg-[#1b1b1b] border border-[#e5b657]"
    : isGold
    ? "bg-[#f6c26b]"
    : "bg-white";

  return (
    <article className={`${base} ${bg}`}>
      <PlusBadge hide={isActive} />
      {isActive ? (
        <div className="flex h-full items-center justify-center">
          <p className="m-0 text-[18px] md:text-[20px] font-semibold tracking-wide text-[#f6c26b]">
            PROJECTS
          </p>
        </div>
      ) : (
        <div className="flex h-full items-end">
          <p className="m-0 text-[18px] md:text-[20px] font-semibold uppercase leading-tight tracking-tight text-black">
            {title}
          </p>
        </div>
      )}
    </article>
  );
}

export default function ProjectsGrid() {
  return (
    <section className="bg-[#1f1f1f]">
      <div className="mx-auto max-w-7xl px-4 sm:px-0 py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile) => (
            <Tile key={tile.title} {...tile} />
          ))}
        </div>
      </div>
    </section>
  );
}