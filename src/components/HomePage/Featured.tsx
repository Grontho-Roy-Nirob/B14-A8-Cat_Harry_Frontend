import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ContentSkeleton, LoadingLabel } from "@/components/LoadingStates";
import { Button } from "@/components/ui/button";
import { getFeaturedStudios } from "@/lib/data";
import { FeaturedStudios } from "./featured-studios";

async function FeaturedList() {
  const studios = await getFeaturedStudios();

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
    <div className="space-y-6">
      <LoadingLabel>Loading featured studios...</LoadingLabel>
      <ContentSkeleton count={6} />
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
