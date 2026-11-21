import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  Check,
  ChevronRight,
  MapPin,
  Pencil,
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

        {/* Main image */}
        <div className="relative mt-4 h-72 w-full overflow-hidden rounded-xl bg-slate-100 md:h-96">
          <Image
            src={studio.imageUrl}
            alt={studio.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
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
                {rating(studio._id)}
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {studio.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" />
              {studio.location}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
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
                <p className="text-xs text-muted-foreground">{studio.ownerEmail}</p>
              </div>
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
