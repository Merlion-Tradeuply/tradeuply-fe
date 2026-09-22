import "server-only";

import { cookies } from "next/headers";

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";
import type { AuthenticatedClient } from "@/lib/api/types";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session";

export async function getCurrentClientFromCookies() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) return null;

  const result = await requestBackend(API_ENDPOINTS.backend.clientMe, {
    headers: { Authorization: `Bearer ${accessToken}` },
    method: "GET",
  });

  if (result.status !== 200) return null;

  return (JSON.parse(result.body) as { data: { client: AuthenticatedClient } }).data
    .client;
}
