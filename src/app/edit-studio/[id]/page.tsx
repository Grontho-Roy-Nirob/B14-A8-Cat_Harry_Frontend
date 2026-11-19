import PagePlaceholder from "@/components/ui/PagePlaceholder";

export default function EditStudioPage() {
  return (
    <PagePlaceholder
      eyebrow="For hosts"
      title="Edit Studio"
      description="The studio editor will appear here."
      action={{ label: "Back to my studios", href: "/my-studios" }}
    />
  );
}
