import "server-only";

import { cookies } from "next/headers";

import type { ClientTokenPair } from "@/lib/api/types";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth/session";

const baseCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export async function setClientSessionCookies(tokens: ClientTokenPair) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
    ...baseCookieOptions,
    maxAge: tokens.accessTokenExpiresIn,
  });
  cookieStore.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
    ...baseCookieOptions,
    maxAge: tokens.refreshTokenExpiresIn,
  });
}

export async function clearClientSessionCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
}
