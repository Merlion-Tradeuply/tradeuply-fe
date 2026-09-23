import {
  ChartLineUp,
  CheckCircle,
  EnvelopeSimple,
  IdentificationCard,
} from "@phosphor-icons/react/dist/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ClientDashboardShell } from "@/components/dashboard/client-dashboard-shell";
import { DashboardWallet } from "@/components/deposits/dashboard-wallet";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { requestBackend } from "@/lib/api/proxy";
import type {
  AuthenticatedClient,
  ClientBalance,
  Deposit,
  PaymentMethod,
} from "@/lib/api/types";
import { ACCESS_TOKEN_COOKIE } from "@/lib/auth/session";

export const metadata = {
  description: "Access your TradeUply client dashboard and account details.",
  title: "Client Dashboard | TradeUply",
};

async function getClient() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) redirect("/login?returnTo=/dashboard");

  const result = await requestBackend(API_ENDPOINTS.backend.clientMe, {
    headers: { Authorization: `Bearer ${accessToken}` },
    method: "GET",
  });

  if (result.status === 401) {
    redirect("/api/client/token/refresh?returnTo=/dashboard");
  }

  if (result.status !== 200) throw new Error("The dashboard could not be loaded.");

  return (JSON.parse(result.body) as { data: { client: AuthenticatedClient } }).data.client;
}

async function getWalletData() {
  const accessToken = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) redirect("/login?returnTo=/dashboard");

  const authorization = { Authorization: `Bearer ${accessToken}` };
  const [balanceResult, depositResult, methodResult] = await Promise.all([
    requestBackend(API_ENDPOINTS.backend.clientBalance, { headers: authorization }),
    requestBackend(API_ENDPOINTS.backend.clientDeposits, { headers: authorization }),
    requestBackend(API_ENDPOINTS.backend.clientPaymentMethods, { headers: authorization }),
  ]);

  if ([balanceResult, depositResult, methodResult].some((result) => result.status === 401)) {
    redirect("/api/client/token/refresh?returnTo=/dashboard");
  }

  if ([balanceResult, depositResult, methodResult].some((result) => result.status !== 200)) {
    throw new Error("The account wallet could not be loaded.");
  }

  return {
    balances: (JSON.parse(balanceResult.body) as { data: { balances: ClientBalance[] } }).data.balances,
    deposits: (JSON.parse(depositResult.body) as { data: { deposits: Deposit[] } }).data.deposits,
    methods: (JSON.parse(methodResult.body) as { data: { methods: PaymentMethod[] } }).data.methods,
  };
}

export default async function DashboardPage() {
  const [client, walletData] = await Promise.all([getClient(), getWalletData()]);

  return (
    <ClientDashboardShell
      description={`Welcome, ${client.firstName}. Review your wallets and funding activity.`}
      title="Dashboard"
    >

        <Suspense fallback={<div className="h-64 animate-pulse rounded-[1.7rem] bg-white" />}>
          <DashboardWallet {...walletData} />
        </Suspense>

        <section aria-labelledby="account-overview" className="mt-7 grid gap-5 lg:grid-cols-3">
          <article className="rounded-[1.6rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_18px_55px_rgba(18,45,72,0.07)]">
            <IdentificationCard aria-hidden="true" className="text-[var(--color-brand-hover)]" size={28} weight="duotone" />
            <h2 className="mt-5 text-lg font-extrabold text-[var(--color-ink)]" id="account-overview">Account holder</h2>
            <p className="mt-2 text-sm font-semibold text-[var(--color-text-muted)]">{client.firstName} {client.lastName}</p>
          </article>
          <article className="rounded-[1.6rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_18px_55px_rgba(18,45,72,0.07)]">
            <EnvelopeSimple aria-hidden="true" className="text-[var(--color-brand-hover)]" size={28} weight="duotone" />
            <h2 className="mt-5 text-lg font-extrabold text-[var(--color-ink)]">Registered email</h2>
            <p className="mt-2 break-all text-sm font-semibold text-[var(--color-text-muted)]">{client.email}</p>
          </article>
          <article className="rounded-[1.6rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_18px_55px_rgba(18,45,72,0.07)]">
            <CheckCircle aria-hidden="true" className="text-[var(--color-brand-hover)]" size={28} weight="duotone" />
            <h2 className="mt-5 text-lg font-extrabold text-[var(--color-ink)]">Account status</h2>
            <p className="mt-2 text-sm font-extrabold text-[var(--color-brand-hover)]">Active and verified</p>
          </article>
        </section>

        <section className="mt-7 flex items-center gap-4 rounded-[1.6rem] border border-[var(--color-border)] bg-white p-6 sm:p-8">
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
