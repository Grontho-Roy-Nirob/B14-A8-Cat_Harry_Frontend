import Link from "next/link";
import { headers } from "next/headers";
import { ChevronRight } from "lucide-react";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import MyStudioListingList from "@/components/studio/MyStudioListingList";
import type { IStudio } from "@/types/StudioType";

const MyListingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email ?? "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/my-listings/${email}`,
    { cache: "no-store" },
  );
  const studios: IStudio[] = await res.json();

  return (
    <main className="min-h-[calc(100vh-5.5rem)] bg-[#f8f9fa]">
      <section className="border-b border-slate-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground">My Studio Listings</span>
          </nav>
          <p className="mt-6 text-xs font-bold tracking-[0.16em] text-[#ea580c] uppercase">
            Host dashboard
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Your studio listings
              </h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Update rates, photos and amenities, or take a listing down.
              </p>
            </div>
            <Button
              nativeButton={false}
              render={<Link href="/add-studio" />}
              className="h-11 rounded-lg bg-[#f97316] px-6 text-white hover:bg-[#ea580c]"
            >
              Add New Studio
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <MyStudioListingList studios={studios} />
      </div>
    </main>
  );
};

export default MyListingsPage;
