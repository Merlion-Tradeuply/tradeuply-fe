import { getCurrentClientFromCookies } from "@/lib/auth/current-client";
import { refreshClientSession } from "@/lib/auth/refresh-client-session";
import { clearClientSessionCookies } from "@/lib/auth/session-cookies";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const client = await getCurrentClientFromCookies();

  if (client) {
    return Response.json({ data: { client }, success: true });
  }

  const refreshedSession = await refreshClientSession(request);

  if (refreshedSession) {
    return Response.json({
      data: { client: refreshedSession.data.client },
      success: true,
    });
  }

  await clearClientSessionCookies();
  return Response.json(
    {
      error: { code: "UNAUTHENTICATED", message: "No active client session was found." },
      success: false,
    },
    { status: 401 },
  );
}
