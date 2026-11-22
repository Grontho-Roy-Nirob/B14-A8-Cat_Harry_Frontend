import Link from "next/link";
import { ArrowUpRight, AudioLines, Camera, Clapperboard, Mic, Palette } from "lucide-react";

const categories = [
  {
    label: "Photo Studios",
    value: "Photo Studio",
    description: "Cyc walls and soft light for portraits and product shoots.",
    icon: Camera,
  },
  {
    label: "Sound Stages",
    value: "Film Stage",
    description: "Big, quiet stages ready for full production days.",
    icon: Clapperboard,
  },
  {
    label: "Podcast Rooms",
    value: "Podcast Lounge",
    description: "Treated rooms with mics and desk setups included.",
    icon: Mic,
  },
  {
    label: "Music Suites",
    value: "Music Suite",
    description: "Control booths and live rooms for the next take.",
    icon: AudioLines,
  },
  {
    label: "Art Workshops",
    value: "Workshop",
    description: "Creative spaces for making, painting and crafting.",
    icon: Palette,
  },
];

export default function BrowseCategories() {
  return (
    <section id="categories" className="w-full bg-white px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
          Browse by category
        </p>
        <h2 className="mt-3 text-3xl font-light tracking-tight text-foreground md:text-4xl">
          Pick the kind of room you need
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(({ label, value, description, icon: Icon }) => (
            <Link
              key={label}
              href={`/studios?category=${encodeURIComponent(value)}`}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-orange-50 text-[#ea580c]">
                <Icon className="size-5" />
              </span>
              <p className="mt-5 text-sm font-semibold text-foreground">{label}</p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#ea580c]">
                Explore
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
