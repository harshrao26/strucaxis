function ProjectCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden border border-black/10 bg-white">
      {/* Image shimmer */}
      <div className="aspect-[4/3] bg-neutral-200" />

      <div className="p-4 space-y-3">
        <div className="h-3 w-20 bg-neutral-200 rounded" />
        <div className="h-4 w-2/3 bg-neutral-200 rounded" />
        <div className="h-3 w-full bg-neutral-200 rounded" />
        <div className="flex gap-2 mt-3">
          <div className="h-5 w-12 bg-neutral-200 rounded-full" />
          <div className="h-5 w-12 bg-neutral-200 rounded-full" />
        </div>
        <div className="h-3 w-24 bg-neutral-200 rounded mt-3" />
      </div>
    </div>
  );
}

export default ProjectCardSkeleton;