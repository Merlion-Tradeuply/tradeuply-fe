import {
  authenticatedClientRequest,
  jsonProxyResponse,
} from "@/lib/api/authenticated-proxy";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

type RouteContext = { params: Promise<{ methodId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { methodId } = await context.params;
  return jsonProxyResponse(
    await authenticatedClientRequest(
      request,
      API_ENDPOINTS.backend.clientWallet(methodId),
      {
        body: await request.text(),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      },
    ),
  );
}

export async function DELETE(request: Request, context: RouteContext) {
  const { methodId } = await context.params;
  return jsonProxyResponse(
    await authenticatedClientRequest(
      request,
      API_ENDPOINTS.backend.clientWallet(methodId),
      { method: "DELETE" },
    ),
  );
}
