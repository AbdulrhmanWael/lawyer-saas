export default function BlogSkeleton() {
  return (
    <div className="max-w-4xl mx-auto border border-gray-300 mb-0 rounded-2xl px-7 py-7 animate-pulse">
      {/* Category */}
      <div className="bg-gray-300 h-6 w-24 rounded-full mb-4" />

      {/* Title */}
      <div className="h-8 bg-gray-300 w-3/4 rounded mb-2" />
      <div className="h-4 bg-gray-200 w-1/3 rounded mb-6" />

      {/* TOC Placeholder */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg border border-gray-300">
        <div className="h-4 bg-gray-300 w-1/4 mx-auto mb-4 rounded" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
          <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto" />
        </div>
      </div>

      {/* Blog Content Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full" />
        ))}
      </div>
    </div>
  );
}
