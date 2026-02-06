export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bmn-light-bg p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm border border-bmn-border">
        {/* Header skeleton */}
        <div className="mx-auto mb-6 h-8 w-32 animate-pulse rounded bg-gray-200"></div>
        {/* Form field skeletons */}
        <div className="mb-4 space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
          <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
        </div>
        <div className="mb-6 space-y-2">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
          <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
        </div>
        {/* Button skeleton */}
        <div className="h-10 w-full animate-pulse rounded bg-gray-200"></div>
      </div>
    </div>
  );
}
