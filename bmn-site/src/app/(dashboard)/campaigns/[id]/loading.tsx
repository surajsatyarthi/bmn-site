export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-xl bg-gray-200"></div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2 h-64 animate-pulse rounded-xl bg-gray-200"></div>
          <div className="h-64 animate-pulse rounded-xl bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
