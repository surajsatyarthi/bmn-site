export default function Loading() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Dark Sidebar Skeleton */}
      <div className="hidden w-64 flex-col bg-gray-900 p-4 md:flex">
        <div className="mb-8 h-8 w-24 animate-pulse rounded bg-gray-700"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded bg-gray-800"></div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-gray-200"></div>
          ))}
        </div>
        <div className="mt-8 h-96 w-full animate-pulse rounded-xl bg-gray-200"></div>
      </div>
    </div>
  );
}
