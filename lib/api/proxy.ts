import "server-only";

const requestTimeoutMs = 15_000;

export function getBackendBaseUrl() {
  const backendUrl = process.env.BACKEND_API_URL?.trim().replace(/\/$/, "");

  if (!backendUrl) {
    throw new Error("BACKEND_API_URL is not configured.");
  }

  return backendUrl;
}

export async function requestBackend(
  backendPath: string,
  init: RequestInit = {},
) {
  try {
    const backendResponse = await fetch(`${getBackendBaseUrl()}${backendPath}`, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...init.headers,
      },
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    const body = await backendResponse.text();

    return { body, status: backendResponse.status };
  } catch (error) {
    console.error("TradeUply API proxy request failed.", error);

    return {
      body: JSON.stringify({
        error: {
          code: "BACKEND_UNAVAILABLE",
          message: "The account service is temporarily unavailable. Please try again.",
        },
        success: false,
      }),
      status: 503,
    };
  }
}

export async function proxyPost(request: Request, backendPath: string) {
  const result = await requestBackend(backendPath, {
    body: await request.text(),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });

  return new Response(result.body, {
    headers: { "Content-Type": "application/json" },
    status: result.status,
  });
}
