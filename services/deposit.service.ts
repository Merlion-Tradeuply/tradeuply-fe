import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Deposit } from "@/lib/api/types";

type DepositPayload = {
  amount: number;
  notes: string;
  paymentMethodId: string;
  senderWalletAddress: string;
  transactionHash: string;
};

type DepositResponse = {
  data?: { deposit: Deposit };
  error?: { message: string };
};

export async function submitDeposit(payload: DepositPayload) {
  const response = await fetch(API_ENDPOINTS.client.clientDeposits, {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const result = (await response.json()) as DepositResponse;

  if (!response.ok || !result.data?.deposit) {
    throw new Error(
      result.error?.message ?? "The deposit could not be submitted.",
    );
  }

  return result.data.deposit;
}
