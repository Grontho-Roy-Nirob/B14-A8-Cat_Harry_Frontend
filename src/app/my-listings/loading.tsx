import { PageLoading } from "@/components/LoadingStates";

export default function MyListingsLoading() {
  return (
    <PageLoading
      eyebrow="Host dashboard"
      title="Loading listings"
      description="Fetching your studio listings..."
      count={6}
    />
  );
}
