import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ClientInvestment } from "@/lib/api/types";

type InvestmentResponse = {
  data?: { investment: ClientInvestment };
  error?: { message?: string };
};

export async function createClientInvestment(payload: {
  amountUsd: number;
  planId: string;
  requestId: string;
  walletCurrency: string;
}) {
  const response = await fetch(API_ENDPOINTS.client.clientInvestments, {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const result = (await response.json()) as InvestmentResponse;

  if (!response.ok || !result.data?.investment) {
    throw new Error(result.error?.message ?? "The investment could not be created.");
  }
  return result.data.investment;
}
