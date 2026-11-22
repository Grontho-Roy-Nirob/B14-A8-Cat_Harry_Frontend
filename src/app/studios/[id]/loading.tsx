import { LoadingLabel } from "@/components/LoadingStates";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudioDetailsLoading() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="min-h-[calc(100vh-5.5rem)] bg-[#f4f5fa] px-6 py-8"
    >
      <div className="mx-auto max-w-6xl">
        <Skeleton className="h-3 w-72" />
        <Skeleton className="mt-4 h-72 w-full rounded-xl md:h-96" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-72 w-full rounded-xl" />
            <LoadingLabel>Loading studio details...</LoadingLabel>
          </div>
        </div>
      </div>
    </main>
  );
}
