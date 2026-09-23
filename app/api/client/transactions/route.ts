import {
  authenticatedClientRequest,
  jsonProxyResponse,
} from "@/lib/api/authenticated-proxy";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.toString();
  const backendPath = `${API_ENDPOINTS.backend.clientTransactions}${query ? `?${query}` : ""}`;
  return jsonProxyResponse(
    await authenticatedClientRequest(request, backendPath, { method: "GET" }),
  );
}
