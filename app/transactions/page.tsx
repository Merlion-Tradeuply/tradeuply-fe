import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { ClientTransactionHistory } from "@/components/transactions/client-transaction-history";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";
import type { ClientTransactionResult } from "@/lib/api/types";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  description: "Review every movement in your TradeUply wallets.",
  title: "Transactions | TradeUply",
};

async function getInitialTransactions() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) redirect("/login?returnTo=/transactions");

  const result = await requestBackend(
    `${API_ENDPOINTS.backend.clientTransactions}?page=1&limit=10&sort=newest`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (result.status === 401) {
    redirect("/api/client/token/refresh?returnTo=/transactions");
  }
  if (result.status !== 200) throw new Error("Transactions could not be loaded.");
  return (JSON.parse(result.body) as { data: ClientTransactionResult }).data;
}

export default async function TransactionsPage() {
  const initialData = await getInitialTransactions();
  return (
    <ClientDashboardShell
      description="See where funds came from, where they moved, and how each activity changed your wallet balance."
      title="Transactions"
    >
      <ClientTransactionHistory initialData={initialData} />
    </ClientDashboardShell>
  );
}
