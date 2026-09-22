import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";
import type { BackendClientSessionResponse } from "@/lib/api/types";
import { setClientSessionCookies } from "@/lib/auth/session-cookies";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const result = await requestBackend(API_ENDPOINTS.backend.clientLogin, {
    body: await request.text(),
    headers: {
      "Content-Type": "application/json",
      "User-Agent": request.headers.get("user-agent") ?? "",
    },
    method: "POST",
  });

  if (result.status !== 200) {
    return new Response(result.body, {
      headers: { "Content-Type": "application/json" },
      status: result.status,
    });
  }

  const session = JSON.parse(result.body) as BackendClientSessionResponse;
  await setClientSessionCookies(session.data.tokens);

  return Response.json({
    data: { client: session.data.client },
    message: session.message,
    success: true,
  });
}
