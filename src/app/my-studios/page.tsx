import PagePlaceholder from "@/components/PagePlaceholder";

export default function MyStudiosPage() {
  return (
    <PagePlaceholder
      eyebrow="Your listings"
      title="My Studio Listings"
      description="You have not listed any studios yet."
      action={{ label: "Add a new studio", href: "/add-studio" }}
    />
  );
}
