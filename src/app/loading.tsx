import { ContentSkeleton, HeroSkeleton } from "@/components/LoadingStates";

export default function HomeLoading() {
  return (
    <>
      <HeroSkeleton />
      <div className="mx-auto mt-6 max-w-7xl px-6 pb-16">
        <ContentSkeleton count={6} />
      </div>
    </>
  );
}
