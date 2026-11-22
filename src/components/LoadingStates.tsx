import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function LoadingLabel({ children = "Loading..." }: { children?: React.ReactNode }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm font-medium text-[#ea580c]">
      <Spinner className="size-4 text-[#ea580c]" />
      {children}
    </span>
  );
}

export function ContentSkeleton({
  count = 6,
  variant = "grid",
  className,
}: {
  count?: number;
  variant?: "grid" | "rows";
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className={cn(
        "grid gap-6",
        variant === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          {variant === "grid" ? (
            <>
              <Skeleton className="h-48 rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            </>
          ) : (
            <div className="flex gap-5 p-5">
              <Skeleton className="size-28 shrink-0 rounded-lg sm:size-36" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="mt-6 h-9 w-32" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function FormLoading({
  title = "Loading form...",
  description = "Preparing the editor...",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <main
      role="status"
      aria-live="polite"
      className="min-h-[calc(100vh-5.5rem)] bg-[#f4f5fa] px-6 py-8"
    >
      <div className="mx-auto max-w-6xl">
        <h1 className="sr-only">{title}</h1>
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="mt-4 h-4 w-96 max-w-full" />
        <div className="mt-4">
          <LoadingLabel>{description}</LoadingLabel>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            {[0, 1, 2].map((section) => (
              <div
                key={section}
                className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
              >
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-11 w-full" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-11 w-full" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </main>
  );
}

export function PageLoading({
  eyebrow = "StudioSpace",
  title = "Loading...",
  description = "Fetching the latest studios and bookings.",
  count = 6,
  variant = "grid",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  count?: number;
  variant?: "grid" | "rows";
}) {
  return (
    <main
      role="status"
      aria-live="polite"
      className="min-h-[calc(100vh-5.5rem)] bg-[#f8f9fa] px-6 py-10"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
          {eyebrow}
        </p>
        <h1 className="sr-only">{title}</h1>
        <Skeleton className="mt-4 h-10 w-80 max-w-full" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        <div className="mt-4">
          <LoadingLabel>{description}</LoadingLabel>
        </div>
        <div className="mt-10">
          <ContentSkeleton count={count} variant={variant} />
        </div>
      </div>
    </main>
  );
}
