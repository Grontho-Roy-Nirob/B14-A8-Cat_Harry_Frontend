import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  AudioLines,
  CalendarCheck,
  Camera,
  Search,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const quickLinks = [
  {
    label: "Explore studios",
    description: "Browse rooms that are ready to book.",
    href: "/studios",
    icon: Search,
  },
  {
    label: "My bookings",
    description: "Check the status of your shoots.",
    href: "/my-bookings",
    icon: CalendarCheck,
  },
  {
    label: "Host your space",
    description: "Put your studio in front of creators.",
    href: "/add-studio",
    icon: Camera,
  },
];

export default function NotFound() {
  return (
    <main className="w-full bg-gradient-to-b from-white via-white to-[#f8f9fa] px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <p className="text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
              Page not found
            </p>

            <div className="mt-4">
              <span className="block text-5xl font-extrabold tracking-tight text-[#c2410c] md:text-6xl">
                404 Not Found
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              This room isn&apos;t on the floor plan.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground lg:mx-0">
              The page you were looking for may have moved, or the link might have
              a typo. Let&apos;s get you back to a space that exists.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button
                nativeButton={false}
                render={<Link href="/" />}
                className="h-11 rounded-lg bg-[#f97316] px-6 text-sm font-semibold text-white hover:bg-[#ea580c]"
              >
                <ArrowLeft />
                Back to Home
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/studios" />}
                variant="outline"
                className="h-11 rounded-lg border-slate-300 bg-white px-6 text-sm font-semibold text-foreground hover:bg-slate-50"
              >
                Explore Studios
                <ArrowUpRight />
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -top-10 -right-10 size-52 rounded-full bg-orange-100 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 size-52 rounded-full bg-blue-100 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#ea580c] uppercase">
                <Sparkles className="size-4" />
                StudioSpace
              </div>

              <div className="mt-8 grid size-16 place-items-center rounded-2xl bg-orange-50 text-[#ea580c]">
                <Search className="size-8" />
              </div>
              <p className="mt-6 text-xl font-semibold text-slate-900">
                No studio at this address
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Try the explore page, or pick one of the shortcuts below. Every
                good shoot starts with the right room.
              </p>

              <div className="mt-8 border-t border-dashed border-slate-200 pt-6">
                <p className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                  Popular destinations
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                    <Camera className="size-3.5 text-[#ea580c]" />
                    Photo studios
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                    <AudioLines className="size-3.5 text-[#ea580c]" />
                    Music suites
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                    <CalendarCheck className="size-3.5 text-[#ea580c]" />
                    Bookings
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {quickLinks.map(({ label, description, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-orange-50 text-[#ea580c]">
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-sm font-semibold text-slate-900">
                  {label}
                  <ArrowUpRight className="size-3.5 text-[#ea580c] transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
