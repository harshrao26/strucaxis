"use client";

const BlogCardSkeleton = () => {
  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm animate-pulse">
      {/* Image placeholder with shimmer effect */}
      <div className="relative w-full h-52 bg-gray-200 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_1.5s_infinite_linear]"
          style={{
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      <div className="p-4 space-y-3">
        {/* Date & read time */}
        <div className="w-1/2 h-3 bg-gray-300 rounded"></div>

        {/* Title */}
        <div className="w-3/4 h-5 bg-gray-300 rounded"></div>

        {/* Summary lines */}
        <div className="w-full h-4 bg-gray-300 rounded"></div>
        <div className="w-5/6 h-4 bg-gray-300 rounded"></div>

        {/* Author info */}
        <div className="flex items-center gap-2 mt-4">
          <div className="w-6 h-6 bg-gray-300 rounded-full" />
          <div className="w-1/3 h-4 bg-gray-300 rounded" />
        </div>
      </div>

      {/* Inline style tag for keyframes (only needed once if reusing) */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BlogCardSkeleton;
