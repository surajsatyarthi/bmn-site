export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 md:col-span-2">
          <div className="h-64 animate-pulse rounded-xl bg-gray-200"></div>
          <div className="h-48 animate-pulse rounded-xl bg-gray-200"></div>
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="h-40 animate-pulse rounded-xl bg-gray-200"></div>
          <div className="h-40 animate-pulse rounded-xl bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
