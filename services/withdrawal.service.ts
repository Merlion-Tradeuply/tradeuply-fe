import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Withdrawal } from "@/lib/api/types";

export async function submitWithdrawal(payload: { amount: number; paymentMethodId: string; requestId: string }) {
  const response = await fetch(API_ENDPOINTS.client.clientWithdrawals, {
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const result = await response.json() as { data?: { withdrawal: Withdrawal }; error?: { message?: string } };
  if (!response.ok || !result.data?.withdrawal) throw new Error(result.error?.message ?? "The withdrawal could not be submitted.");
  return result.data.withdrawal;
}
