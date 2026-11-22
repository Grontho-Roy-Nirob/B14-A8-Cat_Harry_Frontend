import { PageLoading } from "@/components/LoadingStates";

export default function HostBookingsLoading() {
  return (
    <PageLoading
      eyebrow="Host dashboard"
      title="Loading host bookings"
      description="Fetching booking requests..."
      count={3}
      variant="rows"
    />
  );
}
