import {
  authenticatedClientRequest,
  jsonProxyResponse,
} from "@/lib/api/authenticated-proxy";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function GET(request: Request) {
  return jsonProxyResponse(
    await authenticatedClientRequest(
      request,
      API_ENDPOINTS.backend.clientDeposits,
      {
        method: "GET",
      },
    ),
  );
}

export async function POST(request: Request) {
  return jsonProxyResponse(
    await authenticatedClientRequest(
      request,
      API_ENDPOINTS.backend.clientDeposits,
      {
        body: await request.text(),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      },
    ),
  );
}
