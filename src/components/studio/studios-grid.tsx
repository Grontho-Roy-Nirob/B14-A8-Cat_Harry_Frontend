"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rating } from "@/lib/studio";
import type { IStudio } from "@/lib/types/StudioType";

const categories = [
  "All",
  "Photo Studio",
  "Sound Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

// Base UI renders the raw value in <SelectValue> unless the root gets `items`,
// which maps values to the labels displayed in the trigger.
const priceOptions = [
  { value: "any", label: "Any price" },
  { value: "under50", label: "Under $50" },
  { value: "50to100", label: "$50 - $100" },
  { value: "over100", label: "Over $100" },
];

const sortOptions = [
  { value: "rating", label: "Top Rated" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];

// Older listings were saved as "Film Stage"; treat them as "Sound Stage".
const matchesCategory = (studioCategory: string, selected: string) => {
  if (selected === "All") return true;
  if (selected === "Sound Stage") {
    return studioCategory === "Sound Stage" || studioCategory === "Film Stage";
  }
  return studioCategory === selected;
};

export function StudiosGrid({
  studios,
  initialCategory = "All",
}: {
  studios: IStudio[];
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const initial = initialCategory === "Film Stage" ? "Sound Stage" : initialCategory;
  const [category, setCategory] = useState(
    categories.includes(initial) ? initial : "All"
  );
  const [price, setPrice] = useState("any");
  const [sort, setSort] = useState("rating");
  const [page, setPage] = useState(1);

  const filtered = studios.filter((studio) => {
    const term = query.toLowerCase();
    const matchTerm =
      !term ||
      studio.title?.toLowerCase().includes(term) ||
      studio.location?.toLowerCase().includes(term);
    const matchCategory = matchesCategory(studio.category, category);
    const rate = Number(studio.hourlyRate ?? 0);
    const matchPrice =
      price === "any" ||
      (price === "under50" && rate < 50) ||
      (price === "50to100" && rate >= 50 && rate <= 100) ||
      (price === "over100" && rate > 100);
    return matchTerm && matchCategory && matchPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-low")
      return Number(a.hourlyRate) - Number(b.hourlyRate);
    if (sort === "price-high")
      return Number(b.hourlyRate) - Number(a.hourlyRate);
    return Number(rating(b._id)) - Number(rating(a._id));
  });

  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <>
      {/* Header */}
      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground">Explore Studios</span>
          </nav>
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
            All workspaces
          </p>
          <h1 className="mt-2 text-4xl font-light tracking-tight text-foreground md:text-5xl">
            Find a studio that fits your shoot
          </h1>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Browse every listed space, narrow it down by category, and open a
              listing to see live availability.
            </p>
            <p className="text-xs text-muted-foreground">
              Showing {visible.length} of {studios.length} studios
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="relative min-w-64 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-10 rounded-lg border-slate-200 bg-white pl-9 text-sm"
                placeholder="Search by studio name or area"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="w-full sm:w-36">
              <Select
                items={priceOptions}
                value={price}
                onValueChange={(value) => {
                  setPrice(value ?? "any");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white text-sm">
                  <SelectValue placeholder="Any price" />
                </SelectTrigger>
                <SelectContent>
                  {priceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-36">
              <Select
                items={sortOptions}
                value={sort}
                onValueChange={(value) => setSort(value ?? "rating")}
              >
                <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white text-sm">
                  <SelectValue placeholder="Top Rated" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setCategory(item);
                  setPage(1);
                }}
                className={
                  category === item
                    ? "h-9 rounded-full bg-[#1e293b] px-4 text-xs font-semibold text-white"
                    : "h-9 rounded-full border border-slate-200 bg-white px-4 text-xs font-medium text-muted-foreground"
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="w-full bg-[#f8f9fa] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((studio) => (
              <article
                key={studio._id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={studio.imageUrl}
                    alt={studio.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
                    {studio.category}
                  </span>
                  <span className="absolute bottom-3 left-3 rounded bg-white/95 px-2 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase shadow-sm">
                    Photo &mdash; {studio.category}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="truncate text-base font-semibold text-foreground">
                      {studio.title}
                    </h2>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-[#ea580c]">
                      <Star className="size-3 fill-[#ea580c] text-[#ea580c]" />
                      {rating(studio._id)}
                    </span>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {studio.location}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-foreground">
                      ${studio.hourlyRate}
                      <span className="text-xs font-normal text-muted-foreground">
                        {" "}
                        /hr
                      </span>
                    </p>
                    <Button
                      nativeButton={false}
                      render={<Link href={`/studios/${studio._id}`} />}
                      className="h-9 rounded-lg bg-[#f97316] px-4 text-xs font-semibold text-white hover:bg-[#ea580c]"
                    >
                      View Details
                      <ArrowUpRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="size-9 rounded-lg bg-white"
              >
                <ChevronLeft />
              </Button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  type="button"
                  onClick={() => setPage(index + 1)}
                  className={
                    currentPage === index + 1
                      ? "size-9 rounded-lg bg-[#f97316] text-white hover:bg-[#ea580c]"
                      : "size-9 rounded-lg border border-slate-200 bg-white text-foreground"
                  }
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="size-9 rounded-lg bg-white"
              >
                <ChevronRight />
              </Button>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}

export default StudiosGrid;
