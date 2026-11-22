"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { rating } from "@/lib/studio";
import type { IStudio } from "@/lib/types/StudioType";

export function FeaturedStudios({ studios }: { studios: IStudio[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {studios.map((studio) => (
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
              <h3 className="truncate text-base font-semibold text-foreground">
                {studio.title}
              </h3>
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
  );
}
