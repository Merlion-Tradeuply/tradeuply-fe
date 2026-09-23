import {
  authenticatedClientRequest,
  jsonProxyResponse,
} from "@/lib/api/authenticated-proxy";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export async function POST(
  request: Request,
  context: { params: Promise<{ investmentId: string }> },
) {
  const { investmentId } = await context.params;
  return jsonProxyResponse(
    await authenticatedClientRequest(
      request,
      API_ENDPOINTS.backend.clientInvestmentCapitalTransfer(investmentId),
      { method: "POST" },
    ),
  );
}
