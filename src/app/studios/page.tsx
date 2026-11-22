import { Suspense } from "react";

import { StudiosGrid } from "@/components/studio/studios-grid";
import type { IStudio } from "@/lib/types/StudioType";

async function Studios() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios`, {
    cache: "no-store",
  });
  const data: IStudio[] = await res.json();

  return <StudiosGrid studios={data} />;
}

function StudiosSkeleton() {
  return (
    <section className="w-full bg-[#f8f9fa] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="h-12 w-96 max-w-full animate-pulse rounded-md bg-muted" />
        <div className="mt-4 h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-8 animate-pulse rounded-lg border border-border bg-muted/50"
            />
          ))}
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-sm border border-border bg-muted/50"
            />
          ))}
        </div>
        .
      </div>
    </section>
  );
}

export default function AllStudiosPage() {
  return (
    <main>
      <Suspense fallback={<StudiosSkeleton />}>
        <Studios />
      </Suspense>
    </main>
  );
}
