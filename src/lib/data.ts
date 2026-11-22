import { cache } from "react";

import type { IStudio } from "@/lib/types/StudioType";

// Shared by the hero and featured sections so the API is fetched once per request.
export const getFeaturedStudios = cache(async (): Promise<IStudio[] | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/featured-studios`,
      { cache: "no-store" }
    );
    if (!response.ok) return null;

    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as IStudio[]) : null;
  } catch {
    return null;
  }
});
