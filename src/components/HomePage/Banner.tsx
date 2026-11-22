"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { IStudio } from "@/lib/types/StudioType";

type Slide = {
  eyebrow: string;
  titleLines: string[];
  description: string;
  image: string;
  category: string;
  status: string;
  studio: string;
  meta: string;
};

const staticSlides: Slide[] = [
  {
    eyebrow: "CREATOR-FIRST STUDIOS",
    titleLines: ["Book the room where", "your next idea gets", "made."],
    description:
      "Photo sets, sound stages, podcast lounges and recording suites. Hand-picked spaces with transparent hourly rates.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    category: "Photo studio",
    status: "Open this Saturday",
    studio: "North Light Cyc Studio",
    meta: "Dhanmondi, Dhaka · $45/hr",
  },
  {
    eyebrow: "SPACE FOR EVERY STORY",
    titleLines: ["Find the perfect set", "for your next", "production."],
    description:
      "Compare rates, check real availability and book the hours you need — no long calls, no hidden fees.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80",
    category: "Sound stage",
    status: "Newly listed",
    studio: "Halcyon Sound Stage",
    meta: "Tejgaon, Dhaka · $120/hr",
  },
  {
    eyebrow: "HOSTS YOU CAN TRUST",
    titleLines: ["List your space,", "fill your calendar,", "get paid."],
    description:
      "Verified profiles and simple booking tools help great rooms meet the right creators, week after week.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80",
    category: "Podcast lounge",
    status: "Verified host",
    studio: "Velvet Booth Podcast Lounge",
    meta: "Banani, Dhaka · $30/hr",
  },
];

const trustBadges = ["Verified hosts", "Hourly pricing", "Flexible bookings"];

// Marketing copy stays static; the studio-specific parts come from the API.
const slidesFromStudios = (studios: IStudio[]): Slide[] =>
  studios.slice(0, 3).map((studio, index) => {
    const copy = staticSlides[index] ?? staticSlides[0];
    return {
      ...copy,
      image: studio.imageUrl || copy.image,
      category: studio.category,
      status: "Open for booking",
      studio: studio.title,
      meta: `${studio.location} · $${studio.hourlyRate}/hr`,
    };
  });

function HeroControls({ count }: { count: number }) {
  const { api, scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setSelected(api.selectedScrollSnap());
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  return (
    <div className="mt-10 flex items-center gap-6">
      <p
        aria-live="polite"
        aria-atomic="true"
        className="min-w-16 text-sm font-semibold tabular-nums text-foreground"
      >
        <span className="sr-only">Slide </span>
        {String(selected + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </p>
      <div aria-hidden="true" className="h-px flex-1 bg-border" />
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label="Previous slide"
          disabled={!canScrollPrev}
          onClick={scrollPrev}
          className="size-11 rounded-full"
        >
          <ArrowLeft />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label="Next slide"
          disabled={!canScrollNext}
          onClick={scrollNext}
          className="size-11 rounded-full"
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default function Banner({ studios }: { studios?: IStudio[] }) {
  const slides =
    studios && studios.length > 0 ? slidesFromStudios(studios) : staticSlides;

  return (
    <section className="w-full bg-white px-6 pt-12 pb-16 lg:pt-20 lg:pb-24">
      <Carousel
        opts={{ loop: slides.length > 1, align: "start" }}
        aria-label="StudioSpace highlights"
        tabIndex={0}
        className="mx-auto max-w-7xl"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.studio}>
              <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
                    {slide.eyebrow}
                  </p>
                  <h1 className="mt-5 text-4xl leading-[1.08] font-semibold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                    {slide.titleLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="mt-6 max-w-lg text-sm leading-relaxed text-slate-500 md:text-base">
                    {slide.description}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button
                      nativeButton={false}
                      render={<Link href="/studios" />}
                      className="h-11 rounded-lg bg-[#f97316] px-6 text-sm font-semibold text-white hover:bg-[#ea580c]"
                    >
                      Explore Studios
                      <ArrowRight />
                    </Button>
                    <Button
                      nativeButton={false}
                      render={<Link href="/add-studio" />}
                      variant="outline"
                      className="h-11 rounded-lg border-slate-300 bg-white px-6 text-sm font-semibold text-foreground hover:bg-slate-50"
                    >
                      Host Your Space
                    </Button>
                  </div>

                  <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                    {trustBadges.map((badge) => (
                      <li
                        key={badge}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-500"
                      >
                        <Check className="size-3.5 text-[#ea580c]" />
                        {badge}
                      </li>
                    ))}
                  </ul>

                </div>

                <div className="relative h-[320px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 via-white to-orange-100 md:h-[440px]">
                  <Image
                    src={slide.image}
                    alt={`${slide.studio} studio space`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
                    <span className="size-1.5 rounded-full bg-green-500" />
                    {slide.status}
                  </span>
                  <div className="absolute right-5 bottom-5 left-5 flex items-center gap-3 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-sm">
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-orange-100 text-[#ea580c]">
                      <Star className="size-5 fill-[#ea580c]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {slide.studio}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="size-3" />
                        {slide.meta}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "hidden rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold text-[#ea580c] sm:inline"
                      )}
                    >
                      {slide.category}
                    </span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <HeroControls count={slides.length} />
      </Carousel>
    </section>
  );
}
