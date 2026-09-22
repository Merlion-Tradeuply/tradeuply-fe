import { NextResponse } from "next/server";

import { refreshClientSession } from "@/lib/auth/refresh-client-session";

export const runtime = "nodejs";

function safeReturnPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";
}

export async function POST(request: Request) {
  const session = await refreshClientSession(request);

  if (!session) {
    return Response.json(
      { error: { code: "INVALID_SESSION", message: "Please log in again." }, success: false },
      { status: 401 },
    );
  }

  return Response.json({
    data: { client: session.data.client },
    message: session.message,
    success: true,
  });
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const returnTo = safeReturnPath(requestUrl.searchParams.get("returnTo"));
  const session = await refreshClientSession(request);

  return NextResponse.redirect(new URL(session ? returnTo : "/login", requestUrl.origin));
}
