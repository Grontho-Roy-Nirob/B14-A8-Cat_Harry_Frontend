import Link from "next/link";
import { headers } from "next/headers";
import { ChevronRight } from "lucide-react";

import { auth } from "@/lib/auth";
import MyBookingsList from "@/components/booking/MyBookingsList";
import type { IBooking } from "@/lib/types/BookingType";

const MyBookingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${email}`,
    { cache: "no-store" },
  );
  const bookings: IBooking[] = await res.json();

  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-[#f8f9fa]">
      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-5xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground">My Bookings</span>
          </nav>
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
            Creator account
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Your studio bookings
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Track every request, cancel pending slots and download invoices for
            confirmed shoots.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <MyBookingsList bookings={bookings} />
      </div>
    </main>
  );
};

export default MyBookingsPage;
