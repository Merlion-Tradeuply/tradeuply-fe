import "server-only";

import { cookies } from "next/headers";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";
import type { BackendClientSessionResponse } from "@/lib/api/types";
import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/session";
import {
  clearClientSessionCookies,
  setClientSessionCookies,
} from "@/lib/auth/session-cookies";

export async function refreshClientSession(request: Request) {
  const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;

  if (!refreshToken) return null;

  const result = await requestBackend(API_ENDPOINTS.backend.clientTokenRefresh, {
    body: JSON.stringify({ refreshToken }),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": request.headers.get("user-agent") ?? "",
    },
    method: "POST",
  });

  if (result.status !== 200) {
    await clearClientSessionCookies();
    return null;
  }

  const session = JSON.parse(result.body) as BackendClientSessionResponse;
  await setClientSessionCookies(session.data.tokens);
  return session;
}
