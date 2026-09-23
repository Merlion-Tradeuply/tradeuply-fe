import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ClientBalance, CurrencyConversion } from "@/lib/api/types";

type ApiResult<Data> = {
  data?: Data;
  error?: { message?: string };
};

async function parseResponse<Data>(response: Response, fallback: string) {
  const result = (await response.json()) as ApiResult<Data>;
  if (!response.ok || !result.data) {
    throw new Error(result.error?.message ?? fallback);
  }
  return result.data;
}

export async function getClientWalletBalances() {
  const response = await fetch(API_ENDPOINTS.client.clientBalance, {
    cache: "no-store",
  });
  const data = await parseResponse<{ balances: ClientBalance[] }>(
    response,
    "Wallet balances could not be loaded.",
  );
  return data.balances;
}

export async function getCurrencyConversion({
  amount,
  from,
  to,
}: {
  amount: number;
  from: string;
  to: string;
}) {
  const params = new URLSearchParams({ amount: String(amount), from, to });
  const response = await fetch(
    `${API_ENDPOINTS.client.currencyConversion}?${params.toString()}`,
    { cache: "no-store" },
  );
  const data = await parseResponse<{ conversion: CurrencyConversion }>(
    response,
    "The live conversion rate could not be loaded.",
  );
  return data.conversion;
}
