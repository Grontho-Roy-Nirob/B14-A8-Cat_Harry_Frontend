import { jsPDF } from "jspdf";

import type { IBooking } from "@/lib/types/booking";

const text = (value?: string | number) =>
  value === undefined || value === null || value === "" ? "—" : String(value);

export function downloadInvoice(booking: IBooking) {
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

  doc.setDrawColor(226, 232, 240);
  doc.line(16, 100, 194, 100);

  doc.setFont("helvetica", "bold");
  doc.text("Booking details", 16, 112);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${text(booking.date ?? booking.bookingDate)}`, 16, 121);
  doc.text(
    `Time: ${text(booking.startTime)} - ${text(booking.endTime)}`,
    16,
    129
  );

  doc.setDrawColor(226, 232, 240);
  doc.line(16, 138, 194, 138);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Total", 16, 150);
  doc.text(`$${text(booking.totalPrice ?? booking.price)}`, 194, 150, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Thank you for booking with StudioSpace.", 16, 170);

  doc.save(`studiospace-invoice-${booking._id}.pdf`);
}
