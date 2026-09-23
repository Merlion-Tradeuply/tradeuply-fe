import {
  authenticatedClientRequest,
  jsonProxyResponse,
} from "@/lib/api/authenticated-proxy";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function GET(
  request: Request,
  context: { params: Promise<{ investmentId: string }> },
) {
  const { investmentId } = await context.params;
  return jsonProxyResponse(
    await authenticatedClientRequest(
      request,
      API_ENDPOINTS.backend.clientInvestment(investmentId),
      { method: "GET" },
    ),
  );
}
