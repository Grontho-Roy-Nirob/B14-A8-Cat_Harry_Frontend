"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Clock, Download, MapPin, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/booking/StatusBadge";
import { toast } from "@/components/ui/toast";
import { downloadInvoice } from "@/lib/invoice";
import type { IBooking } from "@/lib/types/booking";

const imageUrl = (booking: IBooking) =>
  booking.studioImage || booking.imageUrl || booking.image || "/favicon.ico";

const title = (booking: IBooking) =>
  booking.studioTitle || booking.title || "Studio booking";

const MyBookingCard = ({ booking }: { booking: IBooking }) => {
  const router = useRouter();
  const status = booking.status || "Pending";

  const handleCancel = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${booking._id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      }
    );

    await res.json().catch(() => null);

    if (!res.ok) {
      toast.add({
        type: "error",
        title: "Could not cancel booking",
        description: "Please try again.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: "Booking cancelled",
      description: "Your request has been cancelled.",
    });
    router.refresh();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="relative h-40 w-full shrink-0 bg-slate-100 md:h-auto md:w-56">
          <Image
            src={imageUrl(booking)}
            alt={title(booking)}
            fill
            sizes="(max-width: 768px) 100vw, 224px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-900">{title(booking)}</h2>
              <StatusBadge status={status} />
            </div>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4" />
                {booking.date || booking.bookingDate || "—"}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="size-4" />
                {booking.startTime && booking.endTime
                  ? `${booking.startTime} – ${booking.endTime}`
                  : "—"}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="size-4" />
                {booking.location || "—"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-semibold text-slate-900">
                ${booking.totalPrice ?? booking.price ?? 0}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {status === "Pending" && (
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <XCircle className="size-4" />
                  Cancel Booking
                </Button>
              )}

              {(status === "Confirmed" || status === "Completed") && (
                <Button
                  onClick={() => void downloadInvoice(booking)}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="size-4" />
                  Download Invoice
                </Button>
              )}

              {status === "Cancelled" && (
                <Button
                  nativeButton={false}
                  render={<Link href="/studios" />}
                  variant="outline"
                  className="gap-2"
                >
                  Book Again
                  <ArrowRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookingCard;
