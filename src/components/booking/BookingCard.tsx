"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import type { IBooking } from "@/lib/types/booking";
import type { IStudio } from "@/lib/types/studios";

const hours = ["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00"];

const BookingCard = ({ studio }: { studio: IStudio }) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [bookedHours, setBookedHours] = useState<string[]>([]);

  const email = session?.user?.email;
  const lookupEmail = studio.ownerEmail || email;
  const activeBookedHours = date ? bookedHours : [];

  useEffect(() => {
    if (!lookupEmail || !date) return;

    const loadBookedHours = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${lookupEmail}`,
          { cache: "no-store" }
        );
        const bookings: IBooking[] = await res.json();
        const blocked = new Set<string>();

        bookings.forEach((booking) => {
          if (booking.studioId !== studio._id) return;
          if (booking.date !== date) return;
          if ((booking.status || "Pending") === "Cancelled") return;

          const start = hours.indexOf(booking.startTime ?? "");
          const end = hours.indexOf(booking.endTime ?? "");
          if (start === -1 || end === -1) return;

          for (let index = start; index < end; index += 1) {
            blocked.add(hours[index]);
          }
        });

        setBookedHours([...blocked]);
      } catch {
        // If the API is unavailable, no slots are blocked locally.
      }
    };

    void loadBookedHours();
  }, [lookupEmail, studio._id, date]);

  const startIndex = hours.indexOf(startTime);
  const endIndex = hours.indexOf(endTime);
  const hoursCount = endIndex > startIndex ? endIndex - startIndex : 0;
  const selectedSlots = hours.slice(startIndex, endIndex);
  const rangeOverlaps = selectedSlots.some((slot) => activeBookedHours.includes(slot));
  const subtotal = hoursCount * studio.hourlyRate;
  const total = subtotal + studio.securityDeposit;

  const handleHourClick = (hour: string) => {
    if (activeBookedHours.includes(hour)) return;

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
    if (isPending) return;

    if (!session?.user?.email) {
      toast.add({
        type: "error",
        title: "Sign in required",
        description: "Please sign in to book a studio.",
      });
      router.push("/login");
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

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      const inserted = (await res.json().catch(() => null)) as
        | { insertedId?: string }
        | null;

      if (!res.ok) throw new Error("Booking failed");

      // Host notification record: stored under the owner's email so the host
      // dashboard can read it with the existing /my-bookings/:email endpoint.
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

      setStartTime("");
      setEndTime("");
      setSelecting("start");

      toast.add({
        type: "success",
        title: "Booking request sent",
        description: "The host has been notified. You won't be charged until confirmed.",
      });
    } catch {
      toast.add({
        type: "error",
        title: "Booking request failed",
        description: "Please try again.",
      });
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-md">
      <p className="text-2xl font-semibold text-foreground">
        ${studio.hourlyRate}
        <span className="text-sm font-normal text-muted-foreground"> / hour</span>
      </p>

      <div className="mt-5 grid gap-2">
        <Label htmlFor="booking-date">Date</Label>
        <div className="relative">
          <Input
            id="booking-date"
            type="date"
            className="h-10 rounded-lg border-slate-200 bg-white pr-3 pl-3"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setStartTime("");
              setEndTime("");
              setSelecting("start");
            }}
          />
          <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
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
            <span className="block text-sm text-foreground">{startTime || "—"}</span>
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
            <span className={`block text-sm ${selecting === "end" ? "text-white" : "text-foreground"}`}>
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
          {activeBookedHours.length > 0 && " Booked slots on this date are unavailable."}
        </p>
        {rangeOverlaps && (
          <p className="text-[11px] font-medium text-red-600">
            Selected range overlaps an existing booking.
          </p>
        )}
      </div>

      <div className="mt-5 grid gap-2 border-t pt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>${studio.hourlyRate} &times; {hoursCount} hours</span>
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
        disabled={isPending || hoursCount === 0 || !date || rangeOverlaps}
        className="mt-5 h-11 w-full rounded-lg bg-[#f97316] text-white hover:bg-[#ea580c]"
      >
        Book Workspace Now
      </Button>
      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        You won&apos;t be charged until the host confirms.
      </p>
    </div>
  );
};

export default BookingCard;
