import Image from "next/image";
import Link from "next/link";

function cleanColor(accent) {
  if (!accent) return undefined;
  return accent.split(" ")[0].trim(); // strip "(Warm Yellow...)" if present
}

export default function ProjectCard({ project }) {
  const color = cleanColor(project.accentColor) || "#111";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-2xl overflow-hidden border border-black/5 bg-white shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-[16/10] bg-neutral-100">
        <img
          src={project.coverImage}
          alt={project.title}
          fill
          className="object-cover h-60 transition-transform duration-300 group-hover:scale-[1.03]"
         />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,.45) 0%, rgba(0,0,0,0) 55%)",
          }}
        />
        {project.year && (
          <span
            className="absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white/90"
            style={{ backgroundColor: color }}
          >
            {project.year}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold leading-tight">{project.title}</h3>
        {project.client && (
          <p className="mt-1 text-sm text-neutral-600">for {project.client}</p>
        )}
      </div>
    </Link>
  );
}