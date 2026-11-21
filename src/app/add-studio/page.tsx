import Link from "next/link";
import { ChevronRight } from "lucide-react";

import StudioForm from "@/components/studio/StudioForm";

const AddStudioPage = () => {
  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-[#f4f5fa]">
      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground">Add New Studio</span>
          </nav>
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
            Host dashboard
          </p>
          <h1 className="mt-2 text-4xl font-light tracking-tight text-foreground md:text-5xl">
            List your space on StudioSpace
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Tell creators what your room offers. You can edit or remove the listing at any
            time.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <StudioForm />
      </div>
    </main>
  );
};

export default AddStudioPage;
