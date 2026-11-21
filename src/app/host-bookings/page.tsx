import Link from "next/link";
import { headers } from "next/headers";
import { ChevronRight } from "lucide-react";

import { auth } from "@/lib/auth";
import HostBookingsList from "@/components/booking/HostBookingsList";
import type { IBooking } from "@/lib/types/booking";

const HostBookingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email ?? "";

  // TODO: replace the empty array with a host-bookings API response when available.
  // Example: GET ${NEXT_PUBLIC_API_URL}/host-bookings/${email}
  const bookings: IBooking[] = [];

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
            <span className="text-foreground">Host Bookings</span>
          </nav>
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
            Host dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Host booking management
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Review booking requests for your studios. Confirm or reject pending requests
            from one place.
          </p>
          {email && (
            <p className="mt-2 text-xs text-muted-foreground">Host account: {email}</p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <HostBookingsList bookings={bookings} />
      </div>
    </main>
  );
};

export default HostBookingsPage;
