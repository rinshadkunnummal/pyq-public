"use client";

export function LoadingGrid() {
  const skeletons = Array.from({ length: 9 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skeletons.map((i) => (
        <div
          key={i}
          className="bg-[#111111] border border-[#27272A] rounded-lg p-4 animate-pulse"
        >
          {/* Title skeleton */}
          <div className="h-6 bg-[#1A1A1A] rounded mb-3 w-3/4"></div>

          {/* Badges skeleton */}
          <div className="flex gap-2 mb-3">
            <div className="h-6 bg-[#1A1A1A] rounded w-16"></div>
            <div className="h-6 bg-[#1A1A1A] rounded w-16"></div>
          </div>

          {/* Metadata skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-[#1A1A1A] rounded w-full"></div>
            <div className="h-4 bg-[#1A1A1A] rounded w-full"></div>
            <div className="h-4 bg-[#1A1A1A] rounded w-full"></div>
            <div className="h-4 bg-[#1A1A1A] rounded w-3/4"></div>
          </div>

          {/* Status skeleton */}
          <div className="h-6 bg-[#1A1A1A] rounded mb-4 w-24"></div>

          {/* Buttons skeleton */}
          <div className="flex gap-2">
            <div className="h-9 bg-[#1A1A1A] rounded flex-1"></div>
            <div className="h-9 bg-[#1A1A1A] rounded flex-1"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
