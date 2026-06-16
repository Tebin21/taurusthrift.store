export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-4 w-48 rounded bg-muted animate-pulse mb-8" />
      <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
        {/* Gallery skeleton */}
        <div className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />
        {/* Info skeleton */}
        <div className="space-y-5">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-8 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-10 w-32 rounded bg-muted animate-pulse" />
          <div className="h-px bg-border" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-muted animate-pulse" style={{ width: `${80 - i * 10}%` }} />
            ))}
          </div>
          <div className="h-12 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
