import { ContentSkeleton, LoadingLabel } from "@/components/LoadingStates";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main role="status" aria-live="polite" className="w-full px-6 py-16">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <div>
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-6 h-14 w-full" />
          <Skeleton className="mt-3 h-14 w-4/5" />
          <Skeleton className="mt-6 h-4 w-3/4" />
          <div className="mt-8 flex gap-3">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-36" />
          </div>
          <div className="mt-10">
            <LoadingLabel>Loading your home page...</LoadingLabel>
          </div>
        </div>
        <Skeleton className="h-[320px] rounded-2xl md:h-[440px]" />
      </div>
      <div className="mx-auto mt-20 max-w-7xl">
        <ContentSkeleton count={6} />
      </div>
    </main>
  );
}
