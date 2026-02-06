export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
      </div>

      {/* Campaign Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-200"></div>
        ))}
      </div>
    </div>
  );
}
