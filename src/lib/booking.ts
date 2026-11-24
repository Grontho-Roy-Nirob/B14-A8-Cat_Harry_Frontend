import type { IBooking } from "@/types/BookingType";

// Returns a number for "how recent" a booking is. Bigger number = newer.
const activityTime = (booking: IBooking) => {
  for (const value of [booking.updatedAt, booking.createdAt]) {
    const time = value ? Date.parse(value) : NaN;
    if (!Number.isNaN(time)) return time; // valid date found
  }

  const objectIdTime = /^[0-9a-f]{8}/i.test(booking._id)
    ? parseInt(booking._id.slice(0, 8), 16) * 1000
    : NaN;
  return Number.isNaN(objectIdTime) ? 0 : objectIdTime; // 0 = oldest
};

export const sortBookingsNewestFirst = <T extends IBooking>(bookings: T[]) =>
  [...bookings].sort((a, b) => activityTime(b) - activityTime(a));
