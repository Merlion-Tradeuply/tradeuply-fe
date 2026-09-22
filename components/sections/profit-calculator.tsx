"use client";

import {
  ArrowRight,
  Calculator,
  CalendarBlank,
  ChartLineUp,
  CheckCircle,
  CurrencyDollar,
  ShieldCheck,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Container } from "@/components/ui/container";
import {
  calculatePlanProjection,
  formatUsd,
  investmentPlanTerms,
  type InvestmentPlanId,
} from "@/data/investment-plans";

export function ProfitCalculator() {
  const [selectedPlanId, setSelectedPlanId] = useState<InvestmentPlanId>("balanced");
  const [amount, setAmount] = useState("1000");

  const selectedPlan =
    investmentPlanTerms.find((plan) => plan.id === selectedPlanId) ?? investmentPlanTerms[2];
  const amountValue = Number(amount);
  const isValidAmount = Number.isFinite(amountValue) && amountValue >= selectedPlan.minimum;
  const projection = calculatePlanProjection(
    isValidAmount ? amountValue : 0,
    selectedPlan.objective,
    selectedPlan.horizonDays,
  );
  const quickAmounts = [
    selectedPlan.minimum,
    selectedPlan.minimum * 2,
    selectedPlan.minimum * 5,
  ];

  function selectPlan(planId: InvestmentPlanId) {
    const nextPlan = investmentPlanTerms.find((plan) => plan.id === planId);

    if (!nextPlan) return;

    setSelectedPlanId(planId);
    setAmount(String(nextPlan.minimum));
  }

  return (
    <section
      aria-labelledby="calculator-title"
      className="relative scroll-mt-28 overflow-hidden bg-[#f4f8f6] py-20 sm:py-24 lg:py-32"
      id="profit-calculator"
    >
      <div
        aria-hidden="true"
        className="absolute -top-52 -left-52 size-[32rem] rounded-full bg-[var(--color-brand)]/[0.06] blur-3xl"
      />

      <Container>
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">
            Profit Calculator
          </p>
          <h2
            className="mt-5 text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]"
            id="calculator-title"
          >
            Calculate your projected return.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[length:var(--text-body-lg)] leading-[1.75] font-medium text-[var(--color-text-muted)]">
            Select an investment plan and enter an amount to preview the daily profit,
            total projected profit, and final value at the end of its fixed term.
          </p>
        </header>

        <div className="relative mt-14 grid overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-[0_28px_80px_rgba(18,45,72,0.1)] lg:mt-16 lg:grid-cols-[0.94fr_1.06fr]">
          <form className="p-6 sm:p-9 lg:p-12" onSubmit={(event) => event.preventDefault()}>
            <div className="flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
                <Calculator aria-hidden="true" size={26} weight="duotone" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold tracking-[-0.025em] text-[var(--color-ink)]">
                  Build your projection
                </h3>
                <p className="mt-1 text-sm font-medium text-[var(--color-text-muted)]">
                  Results update instantly.
                </p>
              </div>
            </div>

            <fieldset className="mt-9">
              <legend className="text-sm font-extrabold text-[var(--color-ink)]">
                Select an investment plan
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {investmentPlanTerms.map((plan) => {
                  const isSelected = plan.id === selectedPlan.id;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-extrabold transition ${
                        isSelected
                          ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"
                          : "border-[var(--color-border)] bg-white text-[var(--color-ink-soft)] hover:border-[#91bba4]"
                      }`}
                      key={plan.id}
                      onClick={() => selectPlan(plan.id)}
                      type="button"
                    >
                      {plan.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-8">
              <label className="text-sm font-extrabold text-[var(--color-ink)]" htmlFor="investment-amount">
                Investment amount
              </label>
              <div className="relative mt-3">
                <CurrencyDollar
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-brand-hover)]"
                  size={23}
                  weight="bold"
                />
                <input
                  aria-describedby="investment-amount-help"
                  className={`h-14 w-full rounded-xl border bg-[#f8faf9] pr-4 pl-12 text-lg font-extrabold text-[var(--color-ink)] outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 ${
                    amount !== "" && !isValidAmount ? "border-[#e59b79]" : "border-[var(--color-border)]"
                  }`}
                  id="investment-amount"
                  inputMode="decimal"
                  min={selectedPlan.minimum}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder={String(selectedPlan.minimum)}
                  step="any"
                  type="number"
                  value={amount}
                />
              </div>
              <p
                className={`mt-2 text-xs font-semibold ${
                  amount !== "" && !isValidAmount ? "text-[#b94f32]" : "text-[var(--color-text-muted)]"
                }`}
                id="investment-amount-help"
              >
                {amount !== "" && !isValidAmount
                  ? `The ${selectedPlan.name} plan requires at least ${formatUsd(selectedPlan.minimum)}.`
                  : `Minimum for ${selectedPlan.name}: ${formatUsd(selectedPlan.minimum)}`}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2" aria-label="Quick investment amounts">
              {quickAmounts.map((quickAmount) => (
                <button
                  className="rounded-lg border border-[var(--color-border)] bg-white px-3.5 py-2 text-xs font-extrabold text-[var(--color-ink-soft)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
                  key={quickAmount}
                  onClick={() => setAmount(String(quickAmount))}
                  type="button"
                >
                  {formatUsd(quickAmount)}
                </button>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl bg-[#f4f7f5] p-4">
              <div className="flex items-center gap-3">
                <CalendarBlank aria-hidden="true" className="shrink-0 text-[var(--color-brand-hover)]" size={22} weight="duotone" />
                <div>
                  <p className="text-[0.65rem] font-extrabold tracking-[0.08em] text-[var(--color-text-muted)] uppercase">
                    Fixed term
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-[var(--color-ink)]">
                    {selectedPlan.horizonDays} days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <ShieldCheck aria-hidden="true" className="shrink-0 text-[var(--color-brand-hover)]" size={22} weight="duotone" />
                <div>
                  <p className="text-[0.65rem] font-extrabold tracking-[0.08em] text-[var(--color-text-muted)] uppercase">
                    Risk level
                  </p>
                  <p className="mt-1 text-sm font-extrabold text-[var(--color-ink)]">
                    {selectedPlan.risk}
                  </p>
                </div>
              </div>
            </div>
          </form>

          <div className="relative flex min-h-[34rem] flex-col overflow-hidden bg-[var(--color-ink)] p-6 text-white sm:p-9 lg:p-12">
            <div
              aria-hidden="true"
              className="absolute -top-28 -right-24 size-72 rounded-full bg-[var(--color-brand)]/20 blur-3xl"
            />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">
                  Projected outcome
                </p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">
                  {selectedPlan.name} plan
                </h3>
              </div>
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-[#67e4a7]">
                <ChartLineUp aria-hidden="true" size={26} weight="duotone" />
              </span>
            </div>

            <output aria-live="polite" className="relative mt-10 block">
              <p className="text-sm font-bold text-white/55">Projected total profit</p>
              <p className="mt-2 text-[clamp(2.35rem,5vw,4.2rem)] leading-none font-extrabold tracking-[-0.055em] text-[#67e4a7]">
                {formatUsd(projection.profit)}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-xs font-extrabold text-white/75">
                <CheckCircle aria-hidden="true" className="text-[#67e4a7]" size={17} weight="fill" />
                {selectedPlan.objective}% daily objective · {selectedPlan.horizonDays}-day term
              </p>
            </output>

            <div className="relative mt-7 overflow-hidden rounded-2xl border border-[#67e4a7]/20 bg-[#67e4a7]/[0.07]">
              <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 p-4 sm:gap-4 sm:px-5">
                <CalculationValue
                  label="Investment"
                  value={formatUsd(isValidAmount ? amountValue : 0)}
                />
                <CalculationOperator symbol="×" />
                <CalculationValue
                  align="center"
                  label="Daily objective"
                  value={`${selectedPlan.objective}%`}
                />
                <CalculationOperator symbol="=" />
                <CalculationValue
                  align="right"
                  emphasis
                  label="Daily profit"
                  value={formatUsd(projection.dailyProfit)}
                />
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 border-t border-white/10 p-4 sm:gap-4 sm:px-5">
                <CalculationValue
                  label="Daily profit"
                  value={formatUsd(projection.dailyProfit)}
                />
                <CalculationOperator symbol="×" />
                <CalculationValue
                  align="center"
                  label="Total days"
                  value={`${selectedPlan.horizonDays} days`}
                />
                <CalculationOperator symbol="=" />
                <CalculationValue
                  align="right"
                  emphasis
                  label="Total profit"
                  value={formatUsd(projection.profit)}
                />
              </div>
            </div>

            <dl className="relative mt-4 grid grid-cols-2 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/[0.055] p-5 sm:p-6">
              <div className="pr-4">
                <dt className="text-[0.68rem] font-extrabold tracking-[0.1em] text-white/45 uppercase">
                  Investment
                </dt>
                <dd className="mt-2 text-lg font-extrabold">
                  {formatUsd(isValidAmount ? amountValue : 0)}
                </dd>
              </div>
              <div className="pl-5">
                <dt className="text-[0.68rem] font-extrabold tracking-[0.1em] text-white/45 uppercase">
                  Projected total
                </dt>
                <dd className="mt-2 text-lg font-extrabold">{formatUsd(projection.total)}</dd>
              </div>
            </dl>

            <div className="relative mt-auto pt-10">
              <a
                className={`inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-extrabold transition ${
                  isValidAmount
                    ? "bg-[var(--color-brand)] text-white hover:-translate-y-0.5 hover:bg-[#08c971]"
                    : "pointer-events-none bg-white/10 text-white/35"
                }`}
                href={isValidAmount ? "/register" : "#investment-amount"}
              >
                Start with {selectedPlan.name}
                <ArrowRight aria-hidden="true" size={17} weight="bold" />
              </a>
              <p className="mt-5 text-center text-[0.7rem] leading-5 font-semibold text-white/45">
                This projection is illustrative, not guaranteed. It excludes fees,
                taxes, withdrawals, and market changes. Capital may be at risk.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

type CalculationValueProps = {
  align?: "center" | "left" | "right";
  emphasis?: boolean;
  label: string;
  value: string;
};

function CalculationValue({
  align = "left",
  emphasis = false,
  label,
  value,
}: CalculationValueProps) {
  const alignment =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  return (
    <div className={alignment}>
      <p className="text-[0.58rem] leading-4 font-extrabold tracking-[0.07em] text-white/45 uppercase sm:text-[0.68rem] sm:tracking-[0.1em]">
        {label}
      </p>
      <p className={`mt-1.5 text-sm font-extrabold sm:text-base ${emphasis ? "text-[#67e4a7]" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}

function CalculationOperator({ symbol }: { symbol: string }) {
  return (
    <span aria-hidden="true" className="text-base font-extrabold text-white/25 sm:text-lg">
      {symbol}
    </span>
  );
}
