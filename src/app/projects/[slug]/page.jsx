import ProjectDetailClient from "./ProjectDetailClient";

async function getProject(slug) {
  const res = await fetch("http://localhost:3000/api/feature-projects", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch");

  const data = await res.json();
  const projects = data.items || [];
  return projects.find((p) => p.slug === slug);
}

export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug);

  if (!project) {
    return <div className="p-12">Project not found</div>;
  }

  // Pass server-fetched data down to client component
  return <ProjectDetailClient project={project} />;
}