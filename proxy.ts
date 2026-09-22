import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/session";

export function proxy(request: NextRequest) {
  if (request.cookies.has(ACCESS_TOKEN_COOKIE)) return NextResponse.next();

  const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  if (request.cookies.has(REFRESH_TOKEN_COOKIE)) {
    const refreshUrl = new URL("/api/client/token/refresh", request.url);
    refreshUrl.searchParams.set("returnTo", returnTo);
    return NextResponse.redirect(refreshUrl);
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("returnTo", returnTo);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
