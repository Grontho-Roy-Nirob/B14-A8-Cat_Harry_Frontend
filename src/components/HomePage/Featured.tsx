import Link from "next/link";

import { FeaturedStudios } from "./featured-studios";

export default async function Featured() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/featured-studios`,
    { cache: "no-store" },
  );

  const studios = await response.json();

  const featured = Array.isArray(studios) ? studios.slice(0, 6) : [];

  return (
    <section id="featured-studios" className="w-full bg-[#f8f9fa] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
              Trending studios
            </p>
            <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
              Fresh spaces, ready this week
            </h2>
          </div>

          <Link
            href="/studios"
            className="inline-flex h-11 items-center rounded-lg border border-slate-300 bg-white px-6 text-xs font-semibold hover:bg-slate-50"
          >
            View all studios
          </Link>
        </div>

        {/* Studio cards */}
        {featured.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">
            New spaces are on their way. Check back soon!
          </p>
        ) : (
          <FeaturedStudios studios={featured} />
        )}
      </div>
    </section>
  );
}
