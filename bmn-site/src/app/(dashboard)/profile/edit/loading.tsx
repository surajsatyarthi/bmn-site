export default function Loading() {
  return (
    <div className="space-y-8 p-6">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <div className="h-48 animate-pulse rounded-xl bg-gray-200"></div>
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-gray-200"></div>
        <div className="h-64 animate-pulse rounded-xl bg-gray-200"></div>
      </div>
    </div>
  );
}
