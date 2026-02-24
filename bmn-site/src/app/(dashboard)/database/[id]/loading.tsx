export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
      </div>
      
      {/* Header Skeleton */}
      <div className="rounded-xl border border-bmn-border bg-white p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-64 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="rounded-xl border border-bmn-border bg-white shadow-sm overflow-hidden">
        <div className="border-b border-bmn-border px-6">
            <div className="flex gap-6 py-4">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-32 bg-gray-100 rounded-xl"></div>
                <div className="h-32 bg-gray-100 rounded-xl"></div>
            </div>
        </div>
      </div>
    </div>
  );
}
