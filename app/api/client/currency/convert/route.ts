import {
  authenticatedClientRequest,
  jsonProxyResponse,
} from "@/lib/api/authenticated-proxy";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const backendPath = `${API_ENDPOINTS.backend.currencyConversion}?${searchParams.toString()}`;

  return jsonProxyResponse(
    await authenticatedClientRequest(request, backendPath, { method: "GET" }),
  );
}
