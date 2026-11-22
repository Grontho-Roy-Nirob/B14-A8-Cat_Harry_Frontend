import type { IBooking } from "@/lib/types/BookingType";

// Newest activity first: an updated booking goes above older ones, and a fresh
// booking goes above everything else. Legacy records fall back to the timestamp
// embedded in Mongo's ObjectId.
const activityTime = (booking: IBooking) => {
  for (const value of [booking.updatedAt, booking.createdAt]) {
    const time = value ? Date.parse(value) : NaN;
    if (!Number.isNaN(time)) return time;
  }

  const objectIdTime = /^[0-9a-f]{8}/i.test(booking._id)
    ? parseInt(booking._id.slice(0, 8), 16) * 1000
    : NaN;
  return Number.isNaN(objectIdTime) ? 0 : objectIdTime;
};

export const sortBookingsNewestFirst = <T extends IBooking>(bookings: T[]) =>
  [...bookings].sort((a, b) => activityTime(b) - activityTime(a));
