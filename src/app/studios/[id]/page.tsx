import PagePlaceholder from "@/components/ui/PagePlaceholder";

export default function StudioDetailPage() {
  return (
    <PagePlaceholder
      eyebrow="Studio"
      title="Studio Details"
      description="Details for this studio will appear here."
      action={{ label: "Back to studios", href: "/studios" }}
    />
  );
}
