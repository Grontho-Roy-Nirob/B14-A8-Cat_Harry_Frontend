import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { REDIRECT_PARAM } from "@/lib/redirect";

export async function proxy(request: NextRequest) {
  let isAuthenticated = false;

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    isAuthenticated = Boolean(session?.user);
  } catch {
    isAuthenticated = false;
  }

  if (isAuthenticated) return NextResponse.next();

  const next = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(
    new URL(`/login?${REDIRECT_PARAM}=${next}`, request.url)
  );
}

export const config = {
  matcher: [
    "/add-studio/:path*",
    "/my-listings/:path*",
    "/my-bookings/:path*",
    "/host-bookings/:path*",
    "/my-studios/:path*",
    "/edit-studio/:path*",
    "/studios/edit/:path*",
  ],
};
