'use client';

export function LoadingSkeleton() {
  return (
    <div className="rounded-lg border-2 border-gray-200 bg-gray-50 p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="h-12 w-12 rounded-full bg-gray-300 animate-pulse" />
          <div className="flex-1">
            <div className="h-5 w-48 bg-gray-300 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-6 w-24 bg-gray-300 rounded-full animate-pulse" />
      </div>

      <div className="space-y-3">
        <div className="h-4 w-40 bg-gray-300 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-300 rounded animate-pulse" />
        <div className="h-4 w-56 bg-gray-300 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function LoadingSkeletons() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <LoadingSkeleton key={i} />
      ))}
    </div>
  );
}