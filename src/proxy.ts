import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  let isAuthenticated = false;

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    isAuthenticated = Boolean(session?.user);
  } catch {
    isAuthenticated = false;
  }

  if (isAuthenticated) return NextResponse.next();

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/add-studio/:path*",
    "/my-listings/:path*",
    "/my-bookings/:path*",
    "/host-bookings/:path*",
    "/studios/edit/:path*",
  ],
};
