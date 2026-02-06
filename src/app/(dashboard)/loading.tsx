export default function Loading() {
  return (
    <div className="flex h-screen bg-bmn-light-bg">
      {/* Sidebar Skeleton */}
      <div className="hidden w-64 flex-col border-r border-bmn-border bg-white p-4 md:flex">
        <div className="mb-8 h-8 w-24 animate-pulse rounded bg-gray-200"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Header Skeleton */}
        <div className="h-16 border-b border-bmn-border bg-white p-4">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
        </div>
        {/* Content Skeleton */}
        <div className="p-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200"></div>
            ))}
          </div>
          <div className="mt-8 h-64 w-full animate-pulse rounded-xl bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
