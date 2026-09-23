import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { ClientPaymentMethods } from "@/components/payment-methods/client-payment-methods";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";
import type { ClientWalletPaymentMethod } from "@/lib/api/types";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  description: "Manage the crypto wallets connected to your TradeUply account.",
  title: "Payment Methods | TradeUply",
};

async function getClientWallets() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) redirect("/login?returnTo=/payment-methods");

  const result = await requestBackend(API_ENDPOINTS.backend.clientWallets, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.status === 401) {
    redirect("/api/client/token/refresh?returnTo=/payment-methods");
  }
  if (result.status !== 200) throw new Error("Your payment methods could not be loaded.");

  return (
    JSON.parse(result.body) as {
      data: { methods: ClientWalletPaymentMethod[] };
    }
  ).data.methods;
}

export default async function PaymentMethodsPage() {
  const methods = await getClientWallets();

  return (
    <ClientDashboardShell
      description="Save the crypto wallets you use to fund investments and receive future transfers."
      title="Payment Methods"
    >
      <ClientPaymentMethods initialMethods={methods} />
    </ClientDashboardShell>
  );
}
