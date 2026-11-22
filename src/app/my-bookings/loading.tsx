import { PageLoading } from "@/components/LoadingStates";

export default function MyBookingsLoading() {
  return (
    <PageLoading
      eyebrow="Creator account"
      title="Loading bookings"
      description="Fetching your bookings..."
      count={3}
      variant="rows"
    />
  );
}
