import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { PortfolioGrid } from "@/components/dashboard/portfolio-grid";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";
import type { ClientInvestment } from "@/lib/api/types";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = {
  description: "Review your TradeUply investment portfolio.",
  title: "My Portfolio | TradeUply",
};

async function getInvestments() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!accessToken) redirect("/login?returnTo=/my-porfolio");

  const result = await requestBackend(API_ENDPOINTS.backend.clientInvestments, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.status === 401) {
    redirect("/api/client/token/refresh?returnTo=/my-porfolio");
  }
  if (result.status !== 200) throw new Error("Your portfolio could not be loaded.");

  return (
    JSON.parse(result.body) as {
      data: { investments: ClientInvestment[] };
    }
  ).data.investments;
}

export default async function MyPortfolioPage() {
  const investments = await getInvestments();

  return (
    <ClientDashboardShell
      description="Track each active investment, its funding wallet, term, and projected value."
      title="My Portfolio"
    >
      <PortfolioGrid investments={investments} />
    </ClientDashboardShell>
  );
}
