import { authenticatedClientRequest, jsonProxyResponse } from "@/lib/api/authenticated-proxy";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function GET(request: Request) {
  return jsonProxyResponse(
    await authenticatedClientRequest(request, API_ENDPOINTS.backend.clientBalance, {
      method: "GET",
    }),
  );
}
