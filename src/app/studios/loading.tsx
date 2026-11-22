import { PageLoading } from "@/components/LoadingStates";

export default function StudiosLoading() {
  return (
    <PageLoading
      eyebrow="All workspaces"
      title="Loading studios"
      description="Fetching studios..."
      count={6}
    />
  );
}
