"use client";

import {
  ArrowRight,
  CalendarCheck,
  ChartLineUp,
  CheckCircle,
  ClockCountdown,
  Coins,
  SpinnerGap,
  TrendUp,
  Wallet,
  X,
} from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { formatUsd } from "@/data/investment-plans";
import type { ClientInvestment } from "@/lib/api/types";
import {
  getClientInvestment,
  transferClientInvestmentCapital,
} from "@/services/client-investment.service";

function formatCrypto(value: string | number, currency: string) {
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getProfitSchedule(investment: ClientInvestment) {
  const entriesByDay = new Map(
    (investment.profit.entries ?? []).map((entry) => [entry.dayNumber, entry]),
  );
  const startsAt = new Date(investment.startsAt).getTime();

  return Array.from({ length: investment.plan.horizonDays }, (_, index) => {
    const dayNumber = index + 1;
    const entry = entriesByDay.get(dayNumber);
    return {
      amountUsd: entry?.amountUsd ?? investment.profit.dailyUsd,
      creditDate:
        entry?.creditDate ??
        new Date(startsAt + dayNumber * 24 * 60 * 60 * 1000).toISOString(),
      dayNumber,
      isCredited: Boolean(entry),
    };
  });
}

function statusLabel(status: ClientInvestment["status"]) {
  if (status === "matured") return "Matured";
  if (status === "completed") return "Capital returned";
  if (status === "cancelled") return "Cancelled";
  return "Active";
}

export function PortfolioModule({ investments }: { investments: ClientInvestment[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedInvestmentId = searchParams.get("investment");
  const [investment, setInvestment] = useState<ClientInvestment | null>(null);
  const [error, setError] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const isLoading = Boolean(
    selectedInvestmentId && investment?.id !== selectedInvestmentId && !error,
  );

  useEffect(() => {
    if (!selectedInvestmentId) {
      return;
    }

    const controller = new AbortController();
    getClientInvestment(selectedInvestmentId)
      .then((result) => {
        if (!controller.signal.aborted) setInvestment(result);
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "The investment details could not be loaded.",
          );
        }
      });

    return () => controller.abort();
  }, [selectedInvestmentId]);

  function setSelectedInvestment(investmentId?: string) {
    setInvestment(null);
    setError("");
    const params = new URLSearchParams(searchParams.toString());
    if (investmentId) params.set("investment", investmentId);
    else params.delete("investment");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  async function transferCapital() {
    if (!investment) return;
    setError("");
    setIsTransferring(true);
    try {
      setInvestment(await transferClientInvestmentCapital(investment.id));
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The capital could not be transferred.",
      );
    } finally {
      setIsTransferring(false);
    }
  }

  if (investments.length === 0) {
    return (
      <section className="rounded-[1.5rem] border border-dashed border-[var(--color-border)] bg-white p-10 text-center">
        <ChartLineUp
          className="mx-auto text-[var(--color-brand-hover)]"
          size={30}
          weight="duotone"
        />
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
    (total, item) => total + Number(item.amountUsd),
    0,
  );
  const earnedTotal = investments.reduce(
    (total, item) => total + Number(item.profit.totalAccruedUsd),
    0,
  );

  return (
    <>
      <section className="mb-5 grid gap-3 sm:grid-cols-3">
        {[
          [
            "Active investments",
            String(investments.filter((item) => item.status === "active").length),
          ],
          ["Invested", formatUsd(investedTotal)],
          ["Profit accrued", formatUsd(earnedTotal)],
        ].map(([label, value]) => (
          <article
            className="rounded-[1.25rem] border border-[var(--color-border)] bg-white p-4"
            key={label}
          >
            <p className="text-[0.58rem] font-extrabold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
              {label}
            </p>
            <p className="mt-2 text-xl font-extrabold text-[var(--color-ink)]">
              {value}
            </p>
          </article>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {investments.map((item) => (
          <button
            className="rounded-[1.4rem] border border-[var(--color-border)] bg-white p-5 text-left shadow-[0_14px_38px_rgba(18,45,72,0.055)] transition hover:-translate-y-0.5 hover:border-[var(--color-brand)] hover:shadow-[0_18px_44px_rgba(18,45,72,0.09)]"
            key={item.id}
            onClick={() => setSelectedInvestment(item.id)}
            type="button"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.58rem] font-extrabold tracking-[0.12em] text-[var(--color-brand-hover)] uppercase">
                  {statusLabel(item.status)}
                </p>
                <h2 className="mt-1 text-lg font-extrabold text-[var(--color-ink)]">
                  {item.plan.name}
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
                  {formatUsd(Number(item.amountUsd))}
                </dd>
                <dd className="mt-0.5 text-[0.62rem] font-semibold text-[var(--color-text-muted)]">
                  {formatCrypto(item.walletAmount, item.walletCurrency)}
                </dd>
              </div>
              <div className="rounded-xl bg-[#f5f8f7] p-3">
                <dt className="flex items-center gap-1.5 text-[0.58rem] font-extrabold text-[var(--color-text-muted)] uppercase">
                  <ChartLineUp size={14} weight="duotone" /> Profit accrued
                </dt>
                <dd className="mt-1 text-sm font-extrabold text-[var(--color-brand-hover)]">
                  {formatUsd(Number(item.profit.totalAccruedUsd))}
                </dd>
                <dd className="mt-0.5 text-[0.62rem] font-semibold text-[var(--color-text-muted)]">
                  Day {item.daysCompleted} of {item.plan.horizonDays}
                </dd>
              </div>
            </dl>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#e8efed]">
              <span
                className="block h-full rounded-full bg-[var(--color-brand)]"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-[0.66rem] font-semibold text-[var(--color-text-muted)]">
              <span>{item.progressPercent}% complete</span>
              <span className="flex items-center gap-1.5">
                <CalendarCheck size={15} weight="duotone" />
                {formatDate(item.maturesAt)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedInvestmentId && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#041a36]/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelectedInvestment();
          }}
        >
          <section
            aria-label="Investment details"
            aria-modal="true"
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[1.6rem] bg-[#f4f8f7] shadow-2xl"
            role="dialog"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-white px-5 py-4">
              <div>
                <p className="text-[0.55rem] font-extrabold tracking-[0.13em] text-[var(--color-brand-hover)] uppercase">
                  Portfolio investment
                </p>
                <h2 className="mt-1 text-base font-extrabold text-[var(--color-ink)]">
                  {investment?.plan.name ?? "Investment details"}
                </h2>
              </div>
              <button
                aria-label="Close investment details"
                className="grid size-10 place-items-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-ink)]"
                onClick={() => setSelectedInvestment()}
                type="button"
              >
                <X size={19} weight="bold" />
              </button>
            </header>

            {isLoading && (
              <div className="grid min-h-80 place-items-center">
                <div className="text-center text-sm font-bold text-[var(--color-text-muted)]">
                  <SpinnerGap className="mx-auto mb-3 animate-spin" size={25} />
                  Loading investment activity
                </div>
              </div>
            )}

            {!isLoading && error && !investment && (
              <div className="m-5 rounded-xl bg-red-50 p-4 text-sm font-bold text-[var(--color-danger)]">
                {error}
              </div>
            )}

            {!isLoading && investment && (
              <div className="grid gap-4 p-5 lg:grid-cols-[0.78fr_1.22fr]">
                <aside className="rounded-[1.3rem] bg-[var(--color-ink)] p-5 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[0.58rem] font-extrabold tracking-[0.08em] uppercase">
                      {statusLabel(investment.status)}
                    </span>
                    <TrendUp className="text-emerald-300" size={24} weight="duotone" />
                  </div>
                  <p className="mt-6 text-[0.58rem] font-bold tracking-[0.12em] text-white/55 uppercase">
                    Original capital
                  </p>
                  <p className="mt-2 text-2xl font-extrabold">
                    {formatUsd(Number(investment.amountUsd))}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-white/60">
                    {formatCrypto(investment.walletAmount, investment.walletCurrency)}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="text-white/55">Daily objective</span>
                      <strong>{investment.plan.dailyObjective}%</strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-white/55">Term</span>
                      <strong>{investment.plan.horizonDays} days</strong>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-white/55">Risk</span>
                      <strong>{investment.plan.risk}</strong>
                    </div>
                  </div>
                </aside>

                <div className="space-y-4">
                  <section className="rounded-[1.3rem] border border-[var(--color-border)] bg-white p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[0.58rem] font-extrabold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
                          Investment timeline
                        </p>
                        <h3 className="mt-1 text-base font-extrabold text-[var(--color-ink)]">
                          {investment.daysRemaining > 0
                            ? `${investment.daysRemaining} days remaining`
                            : "Term completed"}
                        </h3>
                      </div>
                      <ClockCountdown
                        className="text-[var(--color-brand-hover)]"
                        size={24}
                        weight="duotone"
                      />
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e8efed]">
                      <span
                        className="block h-full rounded-full bg-[var(--color-brand)]"
                        style={{ width: `${investment.progressPercent}%` }}
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#f5f8f7] p-3">
                        <p className="text-[0.55rem] font-bold text-[var(--color-text-muted)] uppercase">
                          Start date
                        </p>
                        <p className="mt-1 text-xs font-extrabold text-[var(--color-ink)]">
                          {formatDate(investment.startsAt)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#f5f8f7] p-3">
                        <p className="text-[0.55rem] font-bold text-[var(--color-text-muted)] uppercase">
                          Maturity date
                        </p>
                        <p className="mt-1 text-xs font-extrabold text-[var(--color-ink)]">
                          {formatDate(investment.maturesAt)}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[1.3rem] border border-[var(--color-border)] bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.58rem] font-extrabold tracking-[0.1em] text-[var(--color-brand-hover)] uppercase">
                          Daily profit
                        </p>
                        <h3 className="mt-1 text-base font-extrabold text-[var(--color-ink)]">
                          {formatUsd(Number(investment.profit.availableUsd))} available
                        </h3>
                      </div>
                      <span className="grid size-10 place-items-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
                        <ChartLineUp size={21} weight="duotone" />
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#f5f8f7] p-3">
                        <p className="text-[0.55rem] font-bold text-[var(--color-text-muted)] uppercase">
                          Daily credit
                        </p>
                        <p className="mt-1 text-xs font-extrabold text-[var(--color-ink)]">
                          {formatUsd(Number(investment.profit.dailyUsd))}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#f5f8f7] p-3">
                        <p className="text-[0.55rem] font-bold text-[var(--color-text-muted)] uppercase">
                          Credited days
                        </p>
                        <p className="mt-1 text-xs font-extrabold text-[var(--color-ink)]">
                          {investment.profit.accruedDays} of {investment.plan.horizonDays}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-[#f5f8f7] p-3">
                      <p className="text-[0.62rem] font-extrabold text-[var(--color-ink)]">
                        Profit credit schedule
                      </p>
                      <p className="mt-1 text-[0.58rem] leading-4 font-semibold text-[var(--color-text-muted)]">
                        Profit is credited every 24 hours from the investment start time.
                        Times below are shown in your local timezone.
                      </p>
                    </div>

                    <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
                      {getProfitSchedule(investment).map((schedule) => (
                          <div
                            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] px-3 py-2.5"
                            key={schedule.dayNumber}
                          >
                            <div className="flex items-center gap-2">
                              {schedule.isCredited ? (
                                <CheckCircle
                                  className="text-[var(--color-brand-hover)]"
                                  size={17}
                                  weight="fill"
                                />
                              ) : (
                                <ClockCountdown
                                  className="text-[var(--color-text-muted)]"
                                  size={17}
                                  weight="duotone"
                                />
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-[0.66rem] font-extrabold text-[var(--color-ink)]">
                                    Day {schedule.dayNumber} profit
                                  </p>
                                  <span
                                    className={`rounded-full px-2 py-0.5 text-[0.5rem] font-extrabold uppercase ${
                                      schedule.isCredited
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {schedule.isCredited ? "Credited" : "Upcoming"}
                                  </span>
                                </div>
                                <p className="text-[0.56rem] font-semibold text-[var(--color-text-muted)]">
                                  {formatDateTime(schedule.creditDate)}
                                </p>
                              </div>
                            </div>
                            <strong className="text-[0.66rem] text-[var(--color-brand-hover)]">
                              +{formatUsd(Number(schedule.amountUsd))}
                            </strong>
                          </div>
                        ))}
                    </div>

                    <button
                      className="mt-4 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#e7edeb] px-4 text-xs font-extrabold text-[var(--color-text-muted)]"
                      disabled
                      type="button"
                    >
                      <Wallet size={17} weight="duotone" />
                      Withdraw Profit · Coming soon
                    </button>
                  </section>

                  <section className="rounded-[1.3rem] border border-[var(--color-border)] bg-white p-5">
                    <p className="text-[0.58rem] font-extrabold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
                      Capital
                    </p>
                    {investment.status === "completed" ? (
                      <div className="mt-3 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
                        Capital returned to your {investment.walletCurrency} wallet
                        {investment.capitalReturnedAt
                          ? ` on ${formatDate(investment.capitalReturnedAt)}`
                          : ""}.
                      </div>
                    ) : investment.status === "matured" ? (
                      <div className="mt-3">
                        <p className="mb-3 text-xs font-semibold text-[var(--color-text-muted)]">
                          This investment has matured. You can now return the original capital to your wallet.
                        </p>
                        {error && (
                          <p className="mb-3 rounded-xl bg-red-50 p-3 text-xs font-bold text-[var(--color-danger)]">
                            {error}
                          </p>
                        )}
                        <button
                          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 text-xs font-extrabold text-white transition hover:bg-[var(--color-brand-hover)] disabled:cursor-not-allowed disabled:opacity-55"
                          disabled={isTransferring}
                          onClick={transferCapital}
                          type="button"
                        >
                          {isTransferring ? (
                            <SpinnerGap className="animate-spin" size={17} weight="bold" />
                          ) : (
                            <ArrowRight size={17} weight="bold" />
                          )}
                          {isTransferring ? "Transferring capital" : "Transfer Capital"}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="mt-3 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-[#e7edeb] px-4 text-xs font-extrabold text-[var(--color-text-muted)]"
                        disabled
                        type="button"
                      >
                        <ClockCountdown size={17} weight="duotone" />
                        Available after {formatDate(investment.maturesAt)}
                      </button>
                    )}
                  </section>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
