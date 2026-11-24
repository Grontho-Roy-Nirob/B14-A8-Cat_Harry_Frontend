import { Suspense } from "react";

import { ContentSkeleton, LoadingLabel } from "@/components/LoadingStates";
import { StudiosGrid } from "@/components/studio/studios-grid";
import { Skeleton } from "@/components/ui/skeleton";
import type { IStudio } from "@/types/StudioType";

async function Studios({ category }: { category?: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios`, {
    next: { revalidate: 60 },
  });
  const data: IStudio[] = await res.json();

  return (
    <StudiosGrid
      key={category ?? "all"}
      studios={data}
      initialCategory={category ?? "All"}
    />
  );
}

function StudiosSkeleton() {
  return (
    <section
      role="status"
      aria-live="polite"
      className="w-full bg-[#f8f9fa] px-6 py-12"
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
          All workspaces
        </p>
        <Skeleton className="mt-4 h-12 w-96 max-w-full" />
        <Skeleton className="mt-4 h-4 w-72 max-w-full" />
        <div className="mt-4">
          <LoadingLabel>Loading studios...</LoadingLabel>
        </div>
        <div className="mt-10">
          <ContentSkeleton count={6} />
        </div>
      </div>
    </section>
  );
}

export default async function AllStudiosPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  return (
    <main>
      <Suspense fallback={<StudiosSkeleton />}>
        <Studios category={category} />
      </Suspense>
    </main>
  );
}
