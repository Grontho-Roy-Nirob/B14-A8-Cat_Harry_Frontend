import { notFound } from "next/navigation";
import StudioForm from "@/components/studio/StudioForm";
import type { IStudio } from "@/types/StudioType";

const EditStudioPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studio/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) notFound();
  const studio: IStudio = await res.json();

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-4xl font-light tracking-tight text-foreground md:text-5xl">
        Edit Studio
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Update the details of your listing. Host information is read-only.
      </p>

      <div className="mt-8">
        <StudioForm studio={studio} />
      </div>
    </main>
  );
};

export default EditStudioPage;
