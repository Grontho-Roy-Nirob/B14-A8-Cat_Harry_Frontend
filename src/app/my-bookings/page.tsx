import PagePlaceholder from "@/components/PagePlaceholder";

export default function MyBookingsPage() {
  return (
    <PagePlaceholder
      eyebrow="Your activity"
      title="My Bookings"
      description="You do not have any studio bookings yet."
      action={{ label: "Explore studios", href: "/studios" }}
    />
  );
}
