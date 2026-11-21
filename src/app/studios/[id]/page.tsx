import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Ruler,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import BookingCard from "@/components/booking/BookingCard";
import DeleteStudioDialog from "@/components/studio/DeleteStudioDialog";
import type { IStudio } from "@/lib/types/studios";

// Deterministic pseudo-rating from the id (the API has no rating/review field)
function rating(id: string) {
  const sum = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return (4 + (sum % 10) / 10).toFixed(1);
}

const reviews = [
  {
    name: "Mehnaz Ahmed",
    role: "Product photographer",
    text: "The cyc wall was spotless and the host had the strobes warmed up before I arrived.",
    score: "5.0",
  },
  {
    name: "Sabbir Hossain",
    role: "Video producer",
    text: "Plenty of daylight and enough room for a small crew. Booking was simple.",
    score: "4.8",
  },
  {
    name: "Tania Nasrin",
    role: "Fashion stylist",
    text: "The makeup corner saved us a second location. The deposit came back the next day.",
    score: "4.9",
  },
];

const StudioDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studio/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const studio: IStudio = await res.json();

  const specs = [
    { label: "Hourly rate", value: `$${studio.hourlyRate}`, icon: CalendarDays },
    { label: "Security deposit", value: `$${studio.securityDeposit}`, icon: ShieldCheck },
    { label: "Max capacity", value: `${studio.maxCapacity} people`, icon: Users },
    { label: "Floor area", value: studio.floorArea ?? "—", icon: Ruler },
  ];

  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-[#f4f5fa] px-6 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/studios" className="hover:text-foreground">
            Explore Studios
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{studio.title}</span>
        </nav>

        {/* Gallery */}
        <div className="mt-4">
          <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
            <div className="relative h-72 overflow-hidden rounded-xl bg-slate-100 md:h-96">
              <Image
                src={studio.imageUrl}
                alt={studio.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-foreground uppercase">
                Photo &mdash; main view
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <div className="relative h-32 overflow-hidden rounded-xl bg-orange-50 md:h-44">
                <Image
                  src={studio.imageUrl}
                  alt="Lighting grid"
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-top"
                />
                <span className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-[9px] font-semibold tracking-wide text-foreground uppercase">
                  Photo &mdash; lighting grid
                </span>
              </div>
              <div className="relative h-32 overflow-hidden rounded-xl bg-green-50 md:h-44">
                <Image
                  src={studio.imageUrl}
                  alt="Makeup corner"
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-bottom"
                />
                <span className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-[9px] font-semibold tracking-wide text-foreground uppercase">
                  Photo &mdash; makeup corner
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-8 rounded-full bg-white"
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="size-8 rounded-full bg-white"
            >
              <ChevronRight />
            </Button>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[#f97316]" />
              <span className="h-1.5 w-5 rounded-full bg-slate-300" />
              <span className="h-1.5 w-5 rounded-full bg-slate-300" />
              <span className="h-1.5 w-5 rounded-full bg-slate-300" />
            </div>
            <span className="text-xs text-muted-foreground">1 / 4 photos</span>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#ea580c]">
                {studio.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#ea580c]">
                <Star className="size-3 fill-[#ea580c] text-[#ea580c]" />
                {rating(studio._id)} &middot; 38 reviews
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {studio.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {studio.location}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {specs.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center shadow-sm"
                >
                  <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Icon className="size-3.5" />
                    {label}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-8 text-xl font-semibold text-foreground">About this space</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {studio.overview}
            </p>

            <h2 className="mt-8 text-xl font-semibold text-foreground">Amenities</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {studio.amenities.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-foreground shadow-sm"
                >
                  <Check className="size-4 shrink-0 text-[#ea580c]" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-orange-100 text-sm font-semibold text-[#ea580c]">
                {studio.ownerName.slice(0, 2).toUpperCase()}
              </span>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Hosted by</p>
                <p className="text-sm font-semibold text-foreground">{studio.ownerName}</p>
                <p className="text-xs text-muted-foreground">Verified host &middot; replies within an hour</p>
              </div>
              <Button variant="outline" className="rounded-lg text-xs">
                Message host
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">What creators say</h2>
              <p className="text-xs text-muted-foreground">4.9 average from 38 reviews</p>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {reviews.map((review) => (
                <div
                  key={review.name}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid size-9 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-foreground">
                      {review.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.name}</p>
                      <p className="text-xs text-muted-foreground">{review.role}</p>
                    </div>
                  </div>
                  <span className="mt-3 inline-block rounded bg-orange-50 px-2 py-1 text-xs font-semibold text-[#ea580c]">
                    {review.score}
                  </span>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
            <BookingCard studio={studio} />
            <div className="flex gap-3">
              <Button
                nativeButton={false}
                render={<Link href={`/studios/edit/${id}`} />}
                variant="outline"
                className="flex-1 rounded-lg text-xs"
              >
                <Pencil />
                Edit
              </Button>
              <DeleteStudioDialog id={id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StudioDetailsPage;
