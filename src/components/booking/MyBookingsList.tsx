"use client";

import { useState } from "react";

import MyBookingCard from "@/components/booking/MyBookingCard";
import { sortBookingsNewestFirst } from "@/lib/booking";
import type { IBooking } from "@/lib/types/BookingType";

const tabs = ["All bookings", "Pending", "Confirmed", "Cancelled"];

const MyBookingsList = ({ bookings }: { bookings: IBooking[] }) => {
  const [active, setActive] = useState("All bookings");

  const userBookings = sortBookingsNewestFirst(
    bookings.filter((booking) => !booking.isHostNotification),
  );

  const visible =
    active === "All bookings"
      ? userBookings
      : userBookings.filter(
          (booking) => (booking.status || "Pending") === active,
        );

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-6 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={
              active === tab
                ? "-mb-px border-b-2 border-[#f97316] pb-3 text-sm font-semibold text-slate-900"
                : "-mb-px pb-3 text-sm font-medium text-muted-foreground hover:text-slate-900"
            }
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-base font-semibold text-slate-900">
              No bookings found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Bookings in this status will appear here.
            </p>
          </div>
        ) : (
          visible.map((booking) => (
            <MyBookingCard key={booking._id} booking={booking} />
          ))
        )}
      </div>
    </>
  );
};

export default MyBookingsList;
