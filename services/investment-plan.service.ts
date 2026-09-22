import "server-only";

import type { InvestmentPlan } from "@/data/investment-plans";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";

type PlansResponse = {
  data?: { plans: InvestmentPlan[] };
};

export async function getPublicInvestmentPlans() {
  const response = await requestBackend(API_ENDPOINTS.backend.publicInvestmentPlans);
  if (response.status !== 200) return [];
  try {
    const result = JSON.parse(response.body) as PlansResponse;
    return result.data?.plans ?? [];
  } catch {
    return [];
  }
}
