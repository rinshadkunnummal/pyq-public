export default function PaperDetailsLoading() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-6 h-10 bg-[#111111] rounded w-32 animate-pulse"></div>

        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-12 bg-[#111111] rounded w-3/4 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-[#111111] rounded w-20"></div>
            <div className="h-6 bg-[#111111] rounded w-20"></div>
            <div className="h-6 bg-[#111111] rounded w-20"></div>
          </div>
        </div>

        {/* Metadata Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[#111111] rounded-lg p-4 h-24"></div>
          ))}
        </div>

        {/* Info Sections Skeleton */}
        <div className="space-y-4 animate-pulse">
          <div className="bg-[#111111] rounded-lg p-4 h-20"></div>
          <div className="bg-[#111111] rounded-lg p-4 h-96"></div>
        </div>
      </div>
    </div>
  );
}
