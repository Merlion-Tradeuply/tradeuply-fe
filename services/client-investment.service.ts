import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ClientInvestment,
  InvestmentProfitWithdrawal,
} from "@/lib/api/types";

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

export async function getClientInvestment(investmentId: string) {
  const response = await fetch(API_ENDPOINTS.client.clientInvestment(investmentId), {
    cache: "no-store",
  });
  const result = (await response.json()) as InvestmentResponse;

  if (!response.ok || !result.data?.investment) {
    throw new Error(result.error?.message ?? "The investment details could not be loaded.");
  }
  return result.data.investment;
}

export async function transferClientInvestmentCapital(investmentId: string) {
  const response = await fetch(
    API_ENDPOINTS.client.clientInvestmentCapitalTransfer(investmentId),
    { method: "POST" },
  );
  const result = (await response.json()) as InvestmentResponse;

  if (!response.ok || !result.data?.investment) {
    throw new Error(result.error?.message ?? "The capital could not be transferred.");
  }
  return result.data.investment;
}

export async function withdrawClientInvestmentProfit({
  investmentId,
  requestId,
  walletCurrency,
}: {
  investmentId: string;
  requestId: string;
  walletCurrency: string;
}) {
  const response = await fetch(
    API_ENDPOINTS.client.clientInvestmentProfitWithdrawal(investmentId),
    {
      body: JSON.stringify({ requestId, walletCurrency }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    },
  );
  const result = (await response.json()) as {
    data?: {
      investment: ClientInvestment;
      withdrawal: InvestmentProfitWithdrawal;
    };
    error?: { message?: string };
  };

  if (!response.ok || !result.data) {
    throw new Error(result.error?.message ?? "The profit could not be withdrawn.");
  }
  return result.data;
}
