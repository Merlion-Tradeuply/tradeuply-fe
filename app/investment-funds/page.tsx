import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { InvestmentFundGrid } from "@/components/dashboard/investment-fund-grid";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";
import type { PaymentMethod } from "@/lib/api/types";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session";
import { getPublicInvestmentPlans } from "@/services/investment-plan.service";

export const dynamic = "force-dynamic";

export const metadata = {
  description: "Explore your TradeUply investment funds.",
  title: "Investment Funds | TradeUply",
};

async function getPaymentMethods() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) redirect("/login?returnTo=/investment-funds");

  const result = await requestBackend(API_ENDPOINTS.backend.clientPaymentMethods, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.status === 401) {
    redirect("/api/client/token/refresh?returnTo=/investment-funds");
  }
  if (result.status !== 200) {
    throw new Error("Payment methods could not be loaded.");
  }

  return (
    JSON.parse(result.body) as { data: { methods: PaymentMethod[] } }
  ).data.methods;
}

export default async function InvestmentFundsPage() {
  const [methods, plans] = await Promise.all([
    getPaymentMethods(),
    getPublicInvestmentPlans(),
  ]);

  return (
    <ClientDashboardShell
      description="Compare available funds by minimum investment, daily objective, term, and risk before selecting a plan."
      title="Investment Funds"
    >
      <InvestmentFundGrid methods={methods} plans={plans} />
    </ClientDashboardShell>
  );
}
