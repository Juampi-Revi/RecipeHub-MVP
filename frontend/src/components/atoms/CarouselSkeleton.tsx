export function CarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex-shrink-0 w-80">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl h-48 animate-pulse"></div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}