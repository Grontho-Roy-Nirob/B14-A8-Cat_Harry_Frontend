import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { IStudio } from "@/lib/types/StudioType";
import { FeaturedStudios } from "./featured-studios";

async function FeaturedList() {
  let studios: IStudio[] | null = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/featured-studios`,
      { cache: "no-store" }
    );
    if (response.ok) {
      const data: unknown = await response.json();
      if (Array.isArray(data)) studios = data as IStudio[];
    }
  } catch {
    // Rendered as the unavailable state below.
  }

  if (studios === null) {
    return (
      <p role="status" className="py-16 text-center text-sm text-muted-foreground">
        Featured studios are unavailable right now. Please try again later.
      </p>
    );
  }

  if (studios.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        New spaces are on their way. Check back soon!
      </p>
    );
  }

  return <FeaturedStudios studios={studios} />;
}

function FeaturedSkeleton() {
  return (
    <div role="status" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <span className="sr-only">Loading featured studios</span>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-border bg-white"
        >
          <div className="h-48 animate-pulse bg-muted" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-8 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Featured() {
  return (
    <section id="featured-studios" className="w-full bg-[#f8f9fa] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
              Trending studios
            </p>
            <h2 className="mt-3 text-3xl font-light tracking-tight text-foreground md:text-4xl">
              Fresh spaces, ready this week
            </h2>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/studios" />}
            variant="outline"
            className="h-11 rounded-lg border-slate-300 bg-white px-6 text-xs font-semibold text-foreground hover:bg-slate-50"
          >
            View all studios
            <ArrowRight />
          </Button>
        </div>

        <Suspense fallback={<FeaturedSkeleton />}>
          <FeaturedList />
        </Suspense>
      </div>
    </section>
  );
}
