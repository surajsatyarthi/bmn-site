export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header & Filter Bar */}
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="h-12 w-full animate-pulse rounded-xl bg-gray-200"></div>
      </div>

      {/* Match Cards */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-bmn-border bg-white p-6 shadow-sm">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
              </div>
              <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
