export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-56 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-80 animate-pulse rounded bg-gray-200"></div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="rounded-xl border border-bmn-border bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
              <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200"></div>
            </div>
          ))}
        </div>
        <div className="mt-3 h-9 w-24 animate-pulse rounded-lg bg-gray-200"></div>
      </div>

      {/* Result Card Skeletons */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl border border-bmn-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-5 w-48 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-8 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-4 w-16 animate-pulse rounded-full bg-gray-200"></div>
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="h-3 w-64 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="h-8 w-16 animate-pulse rounded-lg bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
