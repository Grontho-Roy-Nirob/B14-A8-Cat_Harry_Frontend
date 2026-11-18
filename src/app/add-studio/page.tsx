import PagePlaceholder from "@/components/PagePlaceholder";

export default function AddStudioPage() {
  return (
    <PagePlaceholder
      eyebrow="For hosts"
      title="Add New Studio"
      description="The studio listing form will appear here."
      action={{ label: "Back to my studios", href: "/my-studios" }}
    />
  );
}
