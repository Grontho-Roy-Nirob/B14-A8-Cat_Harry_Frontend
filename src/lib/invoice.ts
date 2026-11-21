import { jsPDF } from "jspdf";

import type { IBooking } from "@/lib/types/booking";
import type { IStudio } from "@/lib/types/studios";

const text = (value?: string | number) =>
  value === undefined || value === null || value === "" ? "—" : String(value);

export async function downloadInvoice(booking: IBooking) {
  let ownerName = booking.ownerName;
  let ownerEmail = booking.ownerEmail;

  // Older bookings may not have ownerName/ownerEmail stored. Fall back to the
  // studio record using the existing GET /studio/:id endpoint.
  if ((!ownerName || !ownerEmail) && booking.studioId) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/studio/${booking.studioId}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const studio: IStudio = await res.json();
        ownerName = ownerName || studio.ownerName;
        ownerEmail = ownerEmail || studio.ownerEmail;
      }
    } catch {
      // Keep the values already present on the booking.
    }
  }

  const doc = new jsPDF();

  doc.setFillColor(249, 115, 22);
  doc.rect(0, 0, 210, 22, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("StudioSpace", 16, 14);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(20);
  doc.text("INVOICE", 16, 40);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Booking ID: ${text(booking._id)}`, 16, 49);
  doc.text(`Status: ${text(booking.status)}`, 16, 56);

  doc.setDrawColor(226, 232, 240);
  doc.line(16, 64, 194, 64);

  doc.setFont("helvetica", "bold");
  doc.text("Studio", 16, 76);
  doc.text("Customer", 110, 76);

  doc.setFont("helvetica", "normal");
  doc.text(text(booking.studioTitle ?? booking.title), 16, 84);
  doc.text(text(booking.name), 110, 84);
  doc.text(text(booking.location), 16, 91);
  doc.text(text(booking.email), 110, 91);

  doc.setFont("helvetica", "bold");
  doc.text("Host", 16, 103);
  doc.setFont("helvetica", "normal");
  doc.text(text(ownerName), 16, 111);
  doc.text(text(ownerEmail), 16, 118);

  doc.setDrawColor(226, 232, 240);
  doc.line(16, 126, 194, 126);

  doc.setFont("helvetica", "bold");
  doc.text("Booking details", 16, 138);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${text(booking.date ?? booking.bookingDate)}`, 16, 147);
  doc.text(
    `Time: ${text(booking.startTime)} - ${text(booking.endTime)}`,
    16,
    155
  );

  doc.setDrawColor(226, 232, 240);
  doc.line(16, 164, 194, 164);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Total", 16, 176);
  doc.text(`$${text(booking.totalPrice ?? booking.price)}`, 194, 176, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Thank you for booking with StudioSpace.", 16, 196);

  doc.save(`studiospace-invoice-${booking._id}.pdf`);
}
