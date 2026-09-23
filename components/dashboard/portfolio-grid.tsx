import {
  CalendarCheck,
  ChartLineUp,
  Coins,
  TrendUp,
} from "@phosphor-icons/react/dist/ssr";

import { formatUsd } from "@/data/investment-plans";
import type { ClientInvestment } from "@/lib/api/types";

function formatCrypto(value: string, currency: string) {
  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
  }).format(Number(value))} ${currency}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function PortfolioGrid({
  investments,
}: {
  investments: ClientInvestment[];
}) {
  if (investments.length === 0) {
    return (
      <section className="rounded-[1.5rem] border border-dashed border-[var(--color-border)] bg-white p-10 text-center">
        <ChartLineUp className="mx-auto text-[var(--color-brand-hover)]" size={30} weight="duotone" />
        <h2 className="mt-4 text-lg font-extrabold text-[var(--color-ink)]">
          Your portfolio is empty
        </h2>
        <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">
          Investments you create from Investment Funds will appear here.
        </p>
      </section>
    );
  }

  const investedTotal = investments.reduce(
    (total, investment) => total + Number(investment.amountUsd),
    0,
  );
  const projectedTotal = investments.reduce(
    (total, investment) => total + Number(investment.projectedTotalUsd),
    0,
  );

  return (
    <>
      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        {[
          ["Active investments", String(investments.filter((item) => item.status === "active").length)],
          ["Invested", formatUsd(investedTotal)],
          ["Projected value", formatUsd(projectedTotal)],
        ].map(([label, value]) => (
          <article className="rounded-[1.25rem] border border-[var(--color-border)] bg-white p-4" key={label}>
            <p className="text-[0.58rem] font-extrabold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
              {label}
            </p>
            <p className="mt-2 text-xl font-extrabold text-[var(--color-ink)]">{value}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {investments.map((investment) => (
          <article
            className="rounded-[1.4rem] border border-[var(--color-border)] bg-white p-5 shadow-[0_14px_38px_rgba(18,45,72,0.055)]"
            key={investment.id}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.58rem] font-extrabold tracking-[0.12em] text-[var(--color-brand-hover)] uppercase">
                  {investment.status}
                </p>
                <h2 className="mt-1 text-lg font-extrabold text-[var(--color-ink)]">
                  {investment.plan.name}
                </h2>
              </div>
              <span className="grid size-10 place-items-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
                <TrendUp size={21} weight="duotone" />
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f5f8f7] p-3">
                <dt className="flex items-center gap-1.5 text-[0.58rem] font-extrabold text-[var(--color-text-muted)] uppercase">
                  <Coins size={14} weight="duotone" /> Invested
                </dt>
                <dd className="mt-1 text-sm font-extrabold text-[var(--color-ink)]">
                  {formatUsd(Number(investment.amountUsd))}
                </dd>
                <dd className="mt-0.5 text-[0.62rem] font-semibold text-[var(--color-text-muted)]">
                  {formatCrypto(investment.walletAmount, investment.walletCurrency)}
                </dd>
              </div>
              <div className="rounded-xl bg-[#f5f8f7] p-3">
                <dt className="flex items-center gap-1.5 text-[0.58rem] font-extrabold text-[var(--color-text-muted)] uppercase">
                  <ChartLineUp size={14} weight="duotone" /> Projected value
                </dt>
                <dd className="mt-1 text-sm font-extrabold text-[var(--color-brand-hover)]">
                  {formatUsd(Number(investment.projectedTotalUsd))}
                </dd>
                <dd className="mt-0.5 text-[0.62rem] font-semibold text-[var(--color-text-muted)]">
                  +{formatUsd(Number(investment.projectedProfitUsd))} objective
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4 text-[0.66rem] font-semibold text-[var(--color-text-muted)]">
              <span>{investment.plan.dailyObjective}% daily · {investment.plan.horizonDays} days</span>
              <span className="flex items-center gap-1.5">
                <CalendarCheck size={15} weight="duotone" />
                {formatDate(investment.maturesAt)}
              </span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
