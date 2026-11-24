"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPin, Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { Button } from "@/components/ui/button";
import { LoadingLabel } from "@/components/LoadingStates";
import type { IStudio } from "@/types/StudioType";

// Only the headline text is static. The image and studio details come from the API.
const slideCopy = [
  {
    eyebrow: "CREATOR-FIRST STUDIOS",
    headline: ["Book the room where", "your next idea gets", "made."],
    subtext:
      "Photo sets, sound stages, podcast lounges and recording suites. Hand-picked spaces with transparent hourly rates.",
  },
  {
    eyebrow: "SPACE FOR EVERY STORY",
    headline: ["Find the perfect set", "for your next", "production."],
    subtext:
      "Compare rates, check real availability and book the hours you need — no long calls, no hidden fees.",
  },
  {
    eyebrow: "HOSTS YOU CAN TRUST",
    headline: ["List your space,", "fill your calendar,", "get paid."],
    subtext:
      "Verified profiles and simple booking tools help great rooms meet the right creators, week after week.",
  },
];

const trustBadges = ["Verified hosts", "Hourly pricing", "Flexible bookings"];

export default function Banner() {
  const [studios, setStudios] = useState<IStudio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudios() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/studios`,
          { cache: "no-store" },
        );

        const data = await response.json();
        setStudios(Array.isArray(data) ? data.slice(-3) : []);
      } catch {
        setStudios([]);
      } finally {
        setIsLoading(false);
      }
    }

    void loadStudios();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full bg-white px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <LoadingLabel>Loading featured studios...</LoadingLabel>
        </div>
      </section>
    );
  }

  if (studios.length === 0) {
    return (
      <section className="w-full bg-white px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
            CREATOR-FIRST STUDIOS
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Book the room where your next idea gets made.
          </h1>
          <p className="mt-6 text-sm text-slate-500">
            New spaces are on their way. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white px-6 pt-12 pb-20 lg:pt-20 lg:pb-24">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={studios.length > 1}
        slidesPerView={1}
        className="hero-swiper mx-auto max-w-7xl"
      >
        {studios.map((studio, index) => {
          const copy = slideCopy[index];

          return (
            <SwiperSlide key={studio._id}>
              <div className="grid items-center gap-12 pb-12 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
                    {copy.eyebrow}
                  </p>
                  <h1 className="mt-5 text-4xl leading-[1.08] font-semibold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                    {copy.headline.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="mt-6 max-w-lg text-sm leading-relaxed text-slate-500 md:text-base">
                    {copy.subtext}
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
                    src={studio.imageUrl}
                    alt={`${studio.title} studio space`}
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <span className="absolute top-5 right-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
                    <span className="size-1.5 rounded-full bg-green-500" />
                    Open for booking
                  </span>
                  <div className="absolute right-5 bottom-5 left-5 flex items-center gap-3 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-sm">
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-orange-100 text-[#ea580c]">
                      <Star className="size-5 fill-[#ea580c]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {studio.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="size-3" />
                        {studio.location} · ${studio.hourlyRate}/hr
                      </p>
                    </div>
                    <span className="hidden rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold text-[#ea580c] sm:inline">
                      {studio.category}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
