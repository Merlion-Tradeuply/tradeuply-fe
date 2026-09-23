import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ClientWalletPaymentMethod } from "@/lib/api/types";

export type ClientWalletPayload = {
  asset: string;
  isDefault: boolean;
  label: string;
  network: string;
  walletAddress: string;
};

type ApiResponse<T> = {
  data?: T;
  error?: { message?: string };
};

async function readResponse<T>(response: Response) {
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.data) {
    throw new Error(result.error?.message ?? "The request could not be completed.");
  }
  return result.data;
}

export async function saveClientWallet(
  payload: ClientWalletPayload,
  methodId?: string,
) {
  const response = await fetch(
    methodId
      ? API_ENDPOINTS.client.clientWallet(methodId)
      : API_ENDPOINTS.client.clientWallets,
    {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      method: methodId ? "PATCH" : "POST",
    },
  );
  const data = await readResponse<{ method: ClientWalletPaymentMethod }>(response);
  return data.method;
}

export async function deleteClientWallet(methodId: string) {
  await readResponse<{ deletedId: string }>(
    await fetch(API_ENDPOINTS.client.clientWallet(methodId), { method: "DELETE" }),
  );
}
