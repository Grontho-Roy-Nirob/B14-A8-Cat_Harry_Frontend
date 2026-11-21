"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import type { IStudio } from "@/lib/types/studios";

const hours = ["9:00", "10:00", "11:00", "12:00", "1:00", "2:00", "3:00", "4:00", "5:00"];

const BookingCard = ({ studio }: { studio: IStudio }) => {
  const { data: session } = authClient.useSession();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("1:00");

  const startIndex = hours.indexOf(startTime);
  const endIndex = hours.indexOf(endTime);
  const hoursCount = endIndex > startIndex ? endIndex - startIndex : 0;
  const subtotal = hoursCount * studio.hourlyRate;
  const total = subtotal + studio.securityDeposit;

  const handleSubmit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studioId: studio._id,
        studioTitle: studio.title,
        studioImage: studio.imageUrl,
        location: studio.location,
        ownerEmail: studio.ownerEmail,
        name: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
        date,
        startTime,
        endTime,
        totalPrice: total,
      }),
    });

    await res.json();

    toast.add({
      type: res.ok ? "success" : "error",
      title: res.ok ? "Booking request sent" : "Booking request failed",
      description: res.ok
        ? "You won't be charged until the host confirms."
        : "Please try again.",
    });
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
            onChange={(event) => setDate(event.target.value)}
          />
          <CalendarDays className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <Label>Pick your hours</Label>
        <div className="grid grid-cols-3 gap-2">
          {hours.map((hour) => (
            <button
              key={hour}
              type="button"
              onClick={() => {
                if (startTime === "" || endTime !== "") setStartTime(hour);
                else setEndTime(hour);
              }}
              className={
                hour === startTime || hour === endTime
                  ? "h-9 rounded-lg bg-[#1e293b] text-xs font-medium text-white"
                  : "h-9 rounded-lg border border-slate-200 bg-white text-xs font-medium text-foreground"
              }
            >
              {hour}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">
          Start {startTime} &middot; End {endTime}. Crossed-out slots are already confirmed.
        </p>
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
        disabled={hoursCount === 0 || !date}
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
