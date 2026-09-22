import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";

export async function GET() {
  const result = await requestBackend(API_ENDPOINTS.backend.publicInvestmentPlans);
  return new Response(result.body, {
    headers: { "Content-Type": "application/json" },
    status: result.status,
  });
}
