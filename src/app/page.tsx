import { Suspense } from "react";

import Banner from "@/components/HomePage/Banner";
import BrowseCategories from "@/components/HomePage/BrowseCategories";
import Featured from "@/components/HomePage/Featured";
import HostGuarantee from "@/components/HomePage/HostGuarantee";
import HowItWorks from "@/components/HomePage/HowItWorks";
import { HeroSkeleton } from "@/components/LoadingStates";
import { getFeaturedStudios } from "@/lib/data";

async function Hero() {
  const studios = await getFeaturedStudios();
  return <Banner studios={studios ?? undefined} />;
}

export default function Home() {
  return (
    <main>
      <Suspense fallback={<HeroSkeleton />}>
        <Hero />
      </Suspense>
      <Featured />
      <BrowseCategories />
      <HowItWorks />
      <HostGuarantee />
    </main>
  );
}
