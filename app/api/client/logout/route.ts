import { cookies } from "next/headers";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";
import { REFRESH_TOKEN_COOKIE } from "@/lib/auth/session";
import { clearClientSessionCookies } from "@/lib/auth/session-cookies";

export const runtime = "nodejs";

export async function POST() {
  const refreshToken = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;

  if (refreshToken) {
    await requestBackend(API_ENDPOINTS.backend.clientLogout, {
      body: JSON.stringify({ refreshToken }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  }

  await clearClientSessionCookies();
  return Response.json({ message: "You have logged out successfully.", success: true });
}
