export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="border-b border-bmn-border bg-white p-4">
        <div className="mx-auto flex max-w-7xl justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
      {/* Content Skeleton */}
      <div className="mx-auto max-w-3xl py-12 px-4">
        <div className="mb-8 h-12 w-3/4 animate-pulse rounded bg-gray-200"></div>
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
