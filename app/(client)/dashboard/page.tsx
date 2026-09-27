import { ChartLineUp, CheckCircle, EnvelopeSimple, IdentificationCard } from "@phosphor-icons/react/dist/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { DashboardWallet } from "@/components/deposits/dashboard-wallet";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";
import type {
  AuthenticatedClient,
  ClientBalance,
  Deposit,
  PaymentMethod,
  ClientWalletPaymentMethod,
  Withdrawal,
} from "@/lib/api/types";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session";

export const metadata = {
  description: "Access your TradeUply client dashboard and account details.",
  title: "Client Dashboard | TradeUply",
};

async function getWalletData() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) redirect("/login?returnTo=/dashboard");

  const result = await requestBackend(API_ENDPOINTS.backend.clientDashboard, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (result.status === 401) {
    redirect("/api/client/token/refresh?returnTo=/dashboard");
  }
  if (result.status !== 200) {
    throw new Error("The account wallet could not be loaded.");
  }

  return (JSON.parse(result.body) as {
    data: {
      balances: ClientBalance[];
      client: AuthenticatedClient;
      deposits: Deposit[];
      methods: PaymentMethod[];
      withdrawalMethods: ClientWalletPaymentMethod[];
      withdrawals: Withdrawal[];
    };
  }).data;
}

export default async function DashboardPage() {
  const { client, ...walletData } = await getWalletData();

  return (
    <ClientDashboardShell
      description={`Welcome, ${client.firstName}. Review your wallets and funding activity.`}
      title="Dashboard"
    >
        <DashboardWallet {...walletData} />

        <section aria-labelledby="account-overview" className="mt-6 grid min-w-0 gap-4 sm:mt-7 sm:gap-5 lg:grid-cols-3">
          <article className="min-w-0 rounded-[1.3rem] border border-[var(--color-border)] bg-white p-5 shadow-[0_18px_55px_rgba(18,45,72,0.07)] sm:rounded-[1.6rem] sm:p-6">
            <IdentificationCard aria-hidden="true" className="text-[var(--color-brand-hover)]" size={28} weight="duotone" />
            <h2 className="mt-5 text-lg font-extrabold text-[var(--color-ink)]" id="account-overview">Account holder</h2>
            <p className="mt-2 text-sm font-semibold text-[var(--color-text-muted)]">{client.firstName} {client.lastName}</p>
          </article>
          <article className="min-w-0 rounded-[1.3rem] border border-[var(--color-border)] bg-white p-5 shadow-[0_18px_55px_rgba(18,45,72,0.07)] sm:rounded-[1.6rem] sm:p-6">
            <EnvelopeSimple aria-hidden="true" className="text-[var(--color-brand-hover)]" size={28} weight="duotone" />
            <h2 className="mt-5 text-lg font-extrabold text-[var(--color-ink)]">Registered email</h2>
            <p className="mt-2 break-all text-sm font-semibold text-[var(--color-text-muted)]">{client.email}</p>
          </article>
          <article className="min-w-0 rounded-[1.3rem] border border-[var(--color-border)] bg-white p-5 shadow-[0_18px_55px_rgba(18,45,72,0.07)] sm:rounded-[1.6rem] sm:p-6">
            <CheckCircle aria-hidden="true" className="text-[var(--color-brand-hover)]" size={28} weight="duotone" />
            <h2 className="mt-5 text-lg font-extrabold text-[var(--color-ink)]">Account status</h2>
            <p className="mt-2 text-sm font-extrabold text-[var(--color-brand-hover)]">Active and verified</p>
          </article>
        </section>

        <section className="mt-6 flex min-w-0 flex-col items-start gap-4 rounded-[1.3rem] border border-[var(--color-border)] bg-white p-5 sm:mt-7 sm:flex-row sm:items-center sm:rounded-[1.6rem] sm:p-8">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
            <ChartLineUp aria-hidden="true" size={25} weight="duotone" />
          </span>
          <div>
            <h2 className="font-extrabold text-[var(--color-ink)]">Verified funding workflow</h2>
            <p className="mt-1 text-sm leading-6 font-medium text-[var(--color-text-muted)]">Submitted crypto transfers remain pending until an authorized administrator verifies the blockchain transaction ID and payment evidence.</p>
          </div>
        </section>
    </ClientDashboardShell>
  );
}
