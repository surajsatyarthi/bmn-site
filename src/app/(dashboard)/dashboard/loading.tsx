export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200 mb-2"></div>
          <div className="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-bmn-border bg-white p-6 shadow-sm">
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="mb-2 h-8 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded-xl bg-gray-200"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
