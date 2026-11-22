import Link from "next/link";
import { BadgeCheck, Headset, ShieldCheck, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

const assurances = [
  {
    title: "Liability protection",
    description: "Clear terms on every booking so both sides know where they stand.",
    icon: ShieldCheck,
  },
  {
    title: "Verified profiles",
    description: "Hosts and guests are verified before a booking goes live.",
    icon: BadgeCheck,
  },
  {
    title: "Equipment safety",
    description: "Listed gear and rooms are checked before your shoot begins.",
    icon: Wrench,
  },
  {
    title: "24/7 host support",
    description: "Help is available any hour, on any day of your booking.",
    icon: Headset,
  },
];

export default function HostGuarantee() {
  return (
    <section id="about" className="w-full bg-white px-6 py-16">
      <div className="mx-auto max-w-7xl rounded-2xl bg-[#fff1e6] p-6 md:p-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
              Host guarantee &amp; creator support
            </p>
            <h2 className="mt-4 text-3xl font-light leading-tight tracking-tight text-slate-900 md:text-4xl">
              Make the booking, we handle the worry
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-600">
              Every listing on StudioSpace is backed by a promise: safe rooms,
              clear terms and a real person on call when you need one.
            </p>
            <Button
              nativeButton={false}
              render={<Link href="/add-studio" />}
              className="mt-8 h-11 rounded-lg bg-[#c2410c] px-6 text-sm font-semibold text-white hover:bg-[#a33008]"
            >
              Host Your Space
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {assurances.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-orange-50 text-[#ea580c]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
