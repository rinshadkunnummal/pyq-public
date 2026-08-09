import { LoadingGrid } from "@/components/loading-grid";

export default function PapersLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 bg-[#111111] rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-[#111111] rounded w-1/2"></div>
        </div>

        {/* Filter Skeleton */}
        <div className="mb-6 space-y-4 animate-pulse">
          <div className="h-12 bg-[#111111] rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-[#111111] rounded"></div>
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <LoadingGrid />
      </div>
    </div>
  );
}
