export default function ProductsLoading() {
  return (
    <div className="min-h-screen">
      {/* Top bar skeleton */}
      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <div className="h-9 flex-1 max-w-sm rounded-md bg-muted animate-pulse" />
          <div className="h-9 w-36 rounded-md bg-muted animate-pulse ms-auto" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 rounded-md bg-muted animate-pulse" />
          ))}
        </aside>
        {/* Grid skeleton */}
        <div className="flex-1">
          <div className="h-4 w-24 rounded bg-muted animate-pulse mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />
                <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
