import Banner from "@/components/HomePage/Banner";
import BrowseCategories from "@/components/HomePage/BrowseCategories";
import Featured from "@/components/HomePage/Featured";
import HostGuarantee from "@/components/HomePage/HostGuarantee";
import HowItWorks from "@/components/HomePage/HowItWorks";

export default function Home() {
  return (
    <main>
      <Banner />
      <Featured />
      <BrowseCategories />
      <HowItWorks />
      <HostGuarantee />
    </main>
  );
}
