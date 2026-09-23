import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ClientTransactionResult,
  ClientTransactionType,
} from "@/lib/api/types";

export type ClientTransactionFilters = {
  currency?: string;
  direction?: "credit" | "debit";
  from?: string;
  limit?: number;
  page?: number;
  query?: string;
  sort?: "newest" | "oldest";
  to?: string;
  type?: ClientTransactionType;
};

export async function getClientTransactions(filters: ClientTransactionFilters = {}) {
  const parameters = new URLSearchParams();
  if (filters.currency) parameters.set("currency", filters.currency);
  if (filters.direction) parameters.set("direction", filters.direction);
  if (filters.from) parameters.set("from", filters.from);
  if (filters.limit) parameters.set("limit", String(filters.limit));
  if (filters.page) parameters.set("page", String(filters.page));
  if (filters.query?.trim()) parameters.set("q", filters.query.trim());
  if (filters.sort) parameters.set("sort", filters.sort);
  if (filters.to) parameters.set("to", filters.to);
  if (filters.type) parameters.set("type", filters.type);

  const response = await fetch(
    `${API_ENDPOINTS.client.clientTransactions}?${parameters.toString()}`,
    { cache: "no-store" },
  );
  const result = (await response.json()) as {
    data?: ClientTransactionResult;
    error?: { message?: string };
  };
  if (!response.ok || !result.data) {
    throw new Error(result.error?.message ?? "Transactions could not be loaded.");
  }
  return result.data;
}
