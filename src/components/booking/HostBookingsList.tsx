"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  Download,
  Inbox,
  MapPin,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/booking/StatusBadge";
import { toast } from "@/components/ui/toast";
import { downloadInvoice } from "@/lib/invoice";
import type { IBooking } from "@/lib/types/booking";

const imageUrl = (booking: IBooking) =>
  booking.studioImage || booking.imageUrl || booking.image || "/favicon.ico";

const title = (booking: IBooking) =>
  booking.studioTitle || booking.title || "Studio booking";

const HostBookingsList = ({ bookings }: { bookings: IBooking[] }) => {
  const router = useRouter();

  const hostRequests = bookings.filter(
    (booking) => booking.isHostNotification || booking.bookingRef
  );

  const updateStatus = async (booking: IBooking, action: "confirm" | "reject") => {
    const isConfirm = action === "confirm";
    const ids = [booking._id, booking.bookingRef].filter(Boolean) as string[];

    const results = await Promise.all(
      ids.map((id) =>
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${id}${
            isConfirm ? "/confirm" : ""
          }`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: isConfirm ? undefined : JSON.stringify({ status: "Cancelled" }),
          }
        )
      )
    );

    if (results.some((res) => !res.ok)) {
      toast.add({
        type: "error",
        title: isConfirm ? "Could not confirm booking" : "Could not reject booking",
        description: "Please try again.",
      });
      return;
    }

    toast.add({
      type: "success",
      title: isConfirm ? "Booking confirmed" : "Booking rejected",
      description: `${title(booking)} has been updated.`,
    });
    router.refresh();
  };

  if (hostRequests.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-orange-50 text-[#ea580c]">
          <Inbox className="size-6" />
        </span>
        <p className="mt-4 text-base font-semibold text-slate-900">
          No host booking requests yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          New booking requests for your studios will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {hostRequests.map((booking) => {
        const status = booking.status || "Pending";

        return (
          <div
            key={booking._id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
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
                    <h2 className="text-xl font-semibold text-slate-900">
                      {title(booking)}
                    </h2>
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

                  <p className="mt-3 text-sm text-muted-foreground">
                    Requested by {booking.guestName || booking.name || "—"} &middot;{" "}
                    {booking.customerEmail || booking.guestEmail || booking.email || "—"}
                  </p>
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
                      <>
                        <Button
                          onClick={() => updateStatus(booking, "reject")}
                          variant="outline"
                          className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <XCircle className="size-4" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => updateStatus(booking, "confirm")}
                          className="gap-2 bg-green-600 text-white hover:bg-green-700"
                        >
                          <CheckCircle className="size-4" />
                          Confirm
                        </Button>
                      </>
                    )}

                    {(status === "Confirmed" || status === "Completed") && (
                      <Button
                        onClick={() =>
                          void downloadInvoice({
                            ...booking,
                            email:
                              booking.customerEmail ??
                              booking.guestEmail ??
                              booking.email,
                          })
                        }
                        variant="outline"
                        className="gap-2"
                      >
                        <Download className="size-4" />
                        Download Invoice
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HostBookingsList;
