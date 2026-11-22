import { FormLoading } from "@/components/LoadingStates";

export default function EditStudioLoading() {
  return (
    <FormLoading
      title="Loading studio editor"
      description="Fetching studio details..."
    />
  );
}
