"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import type { IBooking } from "@/types/BookingType";
import type { IStudio } from "@/types/StudioType";

const hours = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

// 12-hour AM/PM keys above so existing bookings still block their slots.
const toHourKey = (value: string) => {
  if (!value) return value;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return value;
  const hour = Number(match[1]);
  const minute = match[2];
  const suffix = match[3]?.toUpperCase();
  if (!Number.isFinite(hour)) return value;
  if (suffix) return `${hour}:${minute} ${suffix}`;
  if (hour > 12) return `${hour - 12}:${minute} PM`;
  return `${hour}:${minute} ${hour < 12 ? "AM" : "PM"}`;
};

// Local calendar date — toISOString().slice(0, 10) is UTC and can be a day off.
const todayKey = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
};

const isBookableDate = (value: string) => value !== "" && value >= todayKey();

const fetchBookingsFor = async (email: string): Promise<IBooking[]> => {
  if (!email) return [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${encodeURIComponent(email)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    return (await res.json()) as IBooking[];
  } catch {
    // If the API is unavailable, treat the slot list as empty.
    return [];
  }
};

// Every non-cancelled booking for this studio on this date blocks its hour range,
// so a slot taken by a different guest is never offered again.
const blockedHoursFor = (
  bookings: IBooking[],
  studioId: string,
  date: string,
) => {
  const blocked = new Set<string>();
  for (const booking of bookings) {
    if (booking.studioId !== studioId || booking.date !== date) continue;
    if ((booking.status || "Pending") === "Cancelled") continue;

    const start = hours.indexOf(toHourKey(booking.startTime ?? ""));
    const end = hours.indexOf(toHourKey(booking.endTime ?? ""));
    if (start === -1 || end === -1 || end <= start) continue;

    for (let index = start; index < end; index += 1) blocked.add(hours[index]);
  }
  return [...blocked];
};

const BookingCard = ({ studio }: { studio: IStudio }) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [bookedHours, setBookedHours] = useState<string[]>([]);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const email = session?.user?.email;
  const lookupKey = [studio.ownerEmail, email]
    .filter((value): value is string => Boolean(value))
    .join("|");
  const today = todayKey();
  const activeBookedHours = isBookableDate(date) ? bookedHours : [];

  useEffect(() => {
    if (!date || !isBookableDate(date) || !lookupKey) return;

    let cancelled = false;
    const loadBookedHours = async () => {
      setCheckingSlots(true);
      try {
        const lists = await Promise.all(
          lookupKey.split("|").map(fetchBookingsFor),
        );
        if (cancelled) return;
        setBookedHours(blockedHoursFor(lists.flat(), studio._id, date));
      } catch {
        // If the API is unavailable, no slots are blocked locally.
        if (!cancelled) setBookedHours([]);
      } finally {
        if (!cancelled) setCheckingSlots(false);
      }
    };

    void loadBookedHours();
    return () => {
      cancelled = true;
    };
  }, [date, lookupKey, studio._id]);

  const startIndex = hours.indexOf(startTime);
  const endIndex = hours.indexOf(endTime);
  const hoursCount = endIndex > startIndex ? endIndex - startIndex : 0;
  const selectedSlots = hours.slice(startIndex, endIndex);
  const rangeOverlaps = selectedSlots.some((slot) =>
    activeBookedHours.includes(slot),
  );
  const subtotal = hoursCount * studio.hourlyRate;
  const total = subtotal + studio.securityDeposit;

  const handleHourClick = (hour: string) => {
    if (!isBookableDate(date) || activeBookedHours.includes(hour)) return;

    if (selecting === "start" || !startTime) {
      setStartTime(hour);
      setEndTime("");
      setSelecting("end");
      return;
    }

    const candidateEnd = hours.indexOf(hour);
    const start = hours.indexOf(startTime);

    if (candidateEnd > start) {
      const range = hours.slice(start, candidateEnd);
      if (range.some((slot) => activeBookedHours.includes(slot))) {
        toast.add({
          type: "error",
          title: "Time unavailable",
          description: "This range overlaps an existing booking.",
        });
        return;
      }

      setEndTime(hour);
      setSelecting("start");
      return;
    }

    setStartTime(hour);
    setEndTime("");
    setSelecting("end");
  };

  const handleSubmit = async () => {
    if (isPending || submitting) return;

    if (!session?.user?.email) {
      toast.add({
        type: "error",
        title: "Sign in required",
        description: "Please sign in to book a studio.",
      });
      router.push("/login");
      return;
    }

    if (!isBookableDate(date)) {
      toast.add({
        type: "error",
        title: "Date unavailable",
        description: "Choose today or a future date.",
      });
      return;
    }

    if (hoursCount === 0) {
      toast.add({
        type: "error",
        title: "Select a time range",
        description: "Choose an end time after the start time.",
      });
      return;
    }

    if (rangeOverlaps) {
      toast.add({
        type: "error",
        title: "Time unavailable",
        description: "This range overlaps an existing booking.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const lists = await Promise.all(
        lookupKey.split("|").map(fetchBookingsFor),
      );
      const latestBlocked = new Set(
        blockedHoursFor(lists.flat(), studio._id, date),
      );
      const selectedHours = hours.slice(startIndex, endIndex);

      if (selectedHours.some((slot) => latestBlocked.has(slot))) {
        setBookedHours([...latestBlocked]);
        setStartTime("");
        setEndTime("");
        setSelecting("start");
        toast.add({
          type: "error",
          title: "Time just taken",
          description:
            "Someone else booked that time. Please pick another slot.",
        });
        return;
      }

      const booking = {
        studioId: studio._id,
        studioTitle: studio.title,
        studioImage: studio.imageUrl,
        location: studio.location,
        ownerEmail: studio.ownerEmail,
        ownerName: studio.ownerName,
        name: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
        customerEmail: session?.user?.email ?? "",
        date,
        startTime,
        endTime,
        totalPrice: total,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      const inserted = (await res.json().catch(() => null)) as {
        insertedId?: string;
      } | null;

      if (!res.ok) throw new Error("Booking failed");

      if (studio.ownerEmail && studio.ownerEmail !== booking.email) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...booking,
            email: studio.ownerEmail,
            customerEmail: booking.email,
            guestEmail: booking.email,
            guestName: booking.name,
            bookingRef: inserted?.insertedId ? String(inserted.insertedId) : "",
            isHostNotification: true,
          }),
        });
      }

      setBookedHours((current) => [...new Set([...current, ...selectedHours])]);
      setStartTime("");
      setEndTime("");
      setSelecting("start");

      toast.add({
        type: "success",
        title: "Booking request sent",
        description:
          "The host has been notified. You won't be charged until confirmed.",
      });
    } catch {
      toast.add({
        type: "error",
        title: "Booking request failed",
        description: "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
      <p className="text-2xl font-semibold text-foreground">
        ${studio.hourlyRate}
        <span className="text-sm font-normal text-muted-foreground">
          {" "}
          / hour
        </span>
      </p>

      <div className="mt-5 grid gap-2">
        <Label htmlFor="booking-date">Date</Label>
        <div className="relative">
          <Input
            id="booking-date"
            type="date"
            min={today}
            className="h-10 rounded-lg border-slate-200 bg-white pr-3 pl-3"
            value={date}
            onChange={(event) => {
              const nextDate = event.target.value;
              if (nextDate && !isBookableDate(nextDate)) return;
              setDate(nextDate);
              setStartTime("");
              setEndTime("");
              setSelecting("start");
            }}
          />
          <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Today or later only. Hours already booked by another guest are
          disabled.
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        <Label>Pick your hours</Label>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSelecting("start")}
            className={[
              "rounded-lg border px-3 py-2 text-left text-xs",
              selecting === "start"
                ? "border-[#f97316] bg-orange-50 text-orange-700"
                : "border-slate-200 bg-white text-muted-foreground",
            ].join(" ")}
          >
            <span className="block font-semibold">Start</span>
            <span className="block text-sm text-foreground">
              {startTime || "—"}
            </span>
          </button>
          <button
            type="button"
            disabled={!startTime}
            onClick={() => setSelecting("end")}
            className={[
              "rounded-lg border px-3 py-2 text-left text-xs",
              selecting === "end"
                ? "border-[#1e293b] bg-slate-900 text-white"
                : "border-slate-200 bg-white text-muted-foreground",
            ].join(" ")}
          >
            <span className="block font-semibold">End</span>
            <span
              className={`block text-sm ${selecting === "end" ? "text-white" : "text-foreground"}`}
            >
              {endTime || "—"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {hours.map((hour) => {
            const isBooked = activeBookedHours.includes(hour);
            const isStart = hour === startTime;
            const isEnd = hour === endTime;

            return (
              <button
                key={hour}
                type="button"
                disabled={isBooked}
                onClick={() => handleHourClick(hour)}
                className={[
                  "h-9 rounded-lg text-xs font-medium",
                  isBooked
                    ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 line-through"
                    : isStart
                      ? "bg-[#f97316] text-white"
                      : isEnd
                        ? "bg-[#1e293b] text-white"
                        : "border border-slate-200 bg-white text-foreground hover:border-slate-300",
                ].join(" ")}
              >
                {hour}
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-muted-foreground">
          Now selecting: {selecting === "start" ? "start time" : "end time"}.
          {activeBookedHours.length > 0 &&
            " Booked slots on this date are unavailable."}
        </p>
        {rangeOverlaps && (
          <p className="text-[11px] font-medium text-red-600">
            Selected range overlaps an existing booking.
          </p>
        )}
      </div>

      <div className="mt-5 grid gap-2 border-t pt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>
            ${studio.hourlyRate} &times; {hoursCount} hours
          </span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Refundable deposit</span>
          <span>${studio.securityDeposit}</span>
        </div>
        <div className="flex justify-between font-semibold text-foreground">
          <span>Total due</span>
          <span>${total}</span>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={
          isPending ||
          submitting ||
          checkingSlots ||
          hoursCount === 0 ||
          !isBookableDate(date) ||
          rangeOverlaps
        }
        className="mt-5 h-11 w-full rounded-lg bg-[#f97316] text-white hover:bg-[#ea580c]"
      >
        {submitting ? "Booking…" : "Book Workspace Now"}
      </Button>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        You won&apos;t be charged until the host confirms.
      </p>
    </div>
  );
};

export default BookingCard;
