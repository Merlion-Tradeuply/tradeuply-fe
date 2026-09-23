"use client";

import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Calculator,
  ChartDonut,
  Coins,
  Globe,
  Leaf,
  ShieldCheck,
  SpinnerGap,
  Sparkle,
  Wallet,
  X,
} from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import {
  calculatePlanProjection,
  formatUsd,
  type InvestmentPlan,
} from "@/data/investment-plans";
import { AddMoneyModal } from "@/components/deposits/add-money-modal";
import type { ClientBalance, CurrencyConversion } from "@/lib/api/types";
import type { PaymentMethod } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import {
  getClientWalletBalances,
  getCurrencyConversion,
} from "@/services/currency.service";
import { createClientInvestment } from "@/services/client-investment.service";

const planIcons = {
  chart: ChartDonut,
  coins: Coins,
  globe: Globe,
  leaf: Leaf,
  shield: ShieldCheck,
  sparkle: Sparkle,
};

function formatCrypto(value: number | string, currency: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `0 ${currency}`;

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
  }).format(amount)} ${currency}`;
}

function formatCryptoExact(value: number, currency: string) {
  return `${value.toFixed(8)} ${currency}`;
}

export function InvestmentFundGrid({
  methods,
  plans,
}: {
  methods: PaymentMethod[];
  plans: InvestmentPlan[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSlug = searchParams.get("fund");
  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.slug === selectedSlug) ?? null,
    [plans, selectedSlug],
  );
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"amount" | "wallet">("amount");
  const [balances, setBalances] = useState<ClientBalance[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [conversion, setConversion] = useState<CurrencyConversion | null>(null);
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [fundingQuotes, setFundingQuotes] = useState<
    Record<string, CurrencyConversion>
  >({});
  const [isLoadingFundingQuotes, setIsLoadingFundingQuotes] = useState(false);
  const [fundingQuoteError, setFundingQuoteError] = useState("");
  const investmentRequestId = useRef("");
  const activeCryptoMethods = methods.filter(
    (method) =>
      method.category === "crypto" &&
      method.status === "active" &&
      method.asset &&
      method.network &&
      method.walletAddress &&
      method.qrCodeUrl,
  );

  const amountNumber = Number(amount);
  const isValidAmount = Boolean(
    selectedPlan &&
      Number.isFinite(amountNumber) &&
      amountNumber >= selectedPlan.minimumInvestment,
  );
  const projection = selectedPlan
    ? calculatePlanProjection(
        isValidAmount ? amountNumber : selectedPlan.minimumInvestment,
        selectedPlan.dailyObjective,
        selectedPlan.horizonDays,
      )
    : null;

  useEffect(() => {
    if (!selectedPlan) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPlan]);

  function openPlan(plan: InvestmentPlan) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("fund", plan.slug);
    params.delete("step");
    params.delete("wallet");
    setAmount(String(plan.minimumInvestment));
    setStep("amount");
    setBalances([]);
    setSelectedCurrency("");
    setConversion(null);
    setWalletError("");
    setIsCreating(false);
    setFundingQuotes({});
    setFundingQuoteError("");
    investmentRequestId.current = crypto.randomUUID();
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function closePlan() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("fund");
    params.delete("step");
    params.delete("wallet");
    setAmount("");
    setStep("amount");
    setBalances([]);
    setSelectedCurrency("");
    setConversion(null);
    setWalletError("");
    setIsCreating(false);
    setFundingQuotes({});
    setFundingQuoteError("");
    investmentRequestId.current = "";
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function openAddMoney(method: PaymentMethod, quote: CurrencyConversion) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("fund");
    params.delete("step");
    params.delete("wallet");
    params.set("modal", "add-money");
    params.set("method", method.code);
    params.set("amount", quote.convertedAmount.toFixed(8));
    params.set("usdAmount", amountNumber.toFixed(2));
    params.set("investmentPlan", selectedPlan?.slug ?? "");
    setStep("amount");
    setSelectedCurrency("");
    setConversion(null);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  async function loadFundingQuotes() {
    setIsLoadingFundingQuotes(true);
    setFundingQuoteError("");
    const uniqueAssets = [
      ...new Set(
        activeCryptoMethods
          .map((method) => method.asset)
          .filter((asset): asset is string => Boolean(asset)),
      ),
    ];

    try {
      const results = await Promise.allSettled(
        uniqueAssets.map(async (asset) => ({
          asset,
          quote: await getCurrencyConversion({
            amount: amountNumber,
            from: "USD",
            to: asset,
          }),
        })),
      );
      const quotes = results.reduce<Record<string, CurrencyConversion>>(
        (current, result) => {
          if (result.status === "fulfilled") {
            current[result.value.asset] = result.value.quote;
          }
          return current;
        },
        {},
      );
      setFundingQuotes(quotes);
      if (Object.keys(quotes).length === 0) {
        setFundingQuoteError("Live payment quotes are temporarily unavailable.");
      }
    } finally {
      setIsLoadingFundingQuotes(false);
    }
  }

  async function proceedToWallet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidAmount) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("step", "wallet");
    params.delete("wallet");
    setStep("wallet");
    setSelectedCurrency("");
    setConversion(null);
    setWalletError("");
    setIsLoadingBalances(true);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    try {
      const walletBalances = await getClientWalletBalances();
      setBalances(walletBalances);
      if (!walletBalances.some((balance) => Number(balance.availableBalance) > 0)) {
        void loadFundingQuotes();
      }
    } catch (error) {
      setWalletError(
        error instanceof Error ? error.message : "Wallet balances could not be loaded.",
      );
    } finally {
      setIsLoadingBalances(false);
    }
  }

  function returnToAmount() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("step");
    params.delete("wallet");
    setStep("amount");
    setSelectedCurrency("");
    setConversion(null);
    setWalletError("");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  async function chooseWallet(balance: ClientBalance) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", "wallet");
    params.set("wallet", balance.currency.toLowerCase());
    setSelectedCurrency(balance.currency);
    setConversion(null);
    setWalletError("");
    setIsConverting(true);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    try {
      setConversion(
        await getCurrencyConversion({
          amount: amountNumber,
          from: "USD",
          to: balance.currency,
        }),
      );
    } catch (error) {
      setWalletError(
        error instanceof Error ? error.message : "The live conversion rate could not be loaded.",
      );
    } finally {
      setIsConverting(false);
    }
  }

  async function confirmInvestment() {
    if (
      !selectedPlan ||
      !selectedBalance ||
      !conversion ||
      remainingBalance === null ||
      remainingBalance < 0
    ) {
      return;
    }

    setWalletError("");
    setIsCreating(true);
    try {
      if (!investmentRequestId.current) {
        investmentRequestId.current = crypto.randomUUID();
      }
      await createClientInvestment({
        amountUsd: amountNumber,
        planId: selectedPlan.id,
        requestId: investmentRequestId.current,
        walletCurrency: selectedBalance.currency,
      });
      router.push("/my-porfolio");
      router.refresh();
    } catch (error) {
      setWalletError(
        error instanceof Error ? error.message : "The investment could not be created.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  const selectedBalance = balances.find(
    (balance) => balance.currency === selectedCurrency,
  );
  const fundedBalances = balances.filter(
    (balance) => Number(balance.availableBalance) > 0,
  );
  const remainingBalance =
    selectedBalance && conversion
      ? Number(selectedBalance.availableBalance) - conversion.convertedAmount
      : null;

  if (plans.length === 0) {
    return (
      <div className="rounded-[1.4rem] border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
        <h2 className="text-base font-extrabold text-[var(--color-ink)]">
          No investment funds available
        </h2>
        <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">
          New funds will appear here after they are published.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => {
        const Icon = planIcons[plan.icon];

        return (
          <article
            className={cn(
              "relative flex min-h-full min-w-0 flex-col overflow-hidden rounded-[1.25rem] border bg-white p-4 shadow-[0_14px_38px_rgba(18,45,72,0.055)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(18,45,72,0.09)] sm:rounded-[1.35rem] sm:p-5",
              plan.isFeatured
                ? "border-[var(--color-brand)]"
                : "border-[var(--color-border)]",
            )}
            key={plan.id}
          >
            {plan.isFeatured && (
              <span className="absolute top-0 right-5 rounded-b-lg bg-[var(--color-brand)] px-3 py-1.5 text-[0.58rem] font-extrabold tracking-[0.1em] text-white uppercase">
                {plan.badge || "Featured"}
              </span>
            )}

            <div className="flex items-center gap-3 pr-16">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
                <Icon aria-hidden="true" size={21} weight="duotone" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-base font-extrabold tracking-[-0.025em] text-[var(--color-ink)]">
                  {plan.name}
                </h2>
                <p className="mt-0.5 text-[0.66rem] font-bold text-[var(--color-text-muted)]">
                  Starts at {formatUsd(plan.minimumInvestment)}
                </p>
              </div>
            </div>

            <p className="mt-4 line-clamp-2 min-h-10 text-xs leading-5 font-medium text-[var(--color-text-muted)]">
              {plan.description}
            </p>

            <dl className="mt-4 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-[#f5f8f7] px-2 py-3 text-center">
              <div className="px-1">
                <dt className="text-[0.56rem] font-extrabold tracking-[0.07em] text-[var(--color-text-muted)] uppercase">
                  Daily
                </dt>
                <dd className="mt-1 text-xs font-extrabold text-[var(--color-brand-hover)]">
                  {plan.dailyObjective}%
                </dd>
              </div>
              <div className="px-1">
                <dt className="text-[0.56rem] font-extrabold tracking-[0.07em] text-[var(--color-text-muted)] uppercase">
                  Term
                </dt>
                <dd className="mt-1 text-xs font-extrabold text-[var(--color-ink)]">
                  {plan.horizonDays} days
                </dd>
              </div>
              <div className="px-1">
                <dt className="text-[0.56rem] font-extrabold tracking-[0.07em] text-[var(--color-text-muted)] uppercase">
                  Risk
                </dt>
                <dd className="mt-1 truncate text-xs font-extrabold text-[var(--color-ink)]">
                  {plan.risk}
                </dd>
              </div>
            </dl>

            <p className="mt-4 line-clamp-1 text-[0.66rem] font-semibold text-[var(--color-text-muted)]">
              <span className="font-extrabold text-[var(--color-ink-soft)]">
                Strategy:
              </span>{" "}
              {plan.allocation}
            </p>

            <button
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 text-xs font-extrabold text-white transition hover:bg-[var(--color-brand-hover)]"
              onClick={() => openPlan(plan)}
              type="button"
            >
              Invest
              <ArrowRight aria-hidden="true" size={16} weight="bold" />
            </button>
          </article>
        );
      })}
      </div>

      {selectedPlan && projection && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[var(--color-ink)]/55 backdrop-blur-sm sm:items-center sm:p-5">
          <button
            aria-label="Close investment fund"
            className="absolute inset-0"
            onClick={closePlan}
            type="button"
          />
          <section
            aria-labelledby="investment-modal-title"
            aria-modal="true"
            className="relative max-h-[96dvh] w-full min-w-0 max-w-3xl overflow-y-auto rounded-t-[1.5rem] bg-[#f5f8f7] shadow-2xl sm:max-h-[94vh] sm:rounded-[1.7rem]"
            role="dialog"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
              <div>
                <p className="text-[0.58rem] font-extrabold tracking-[0.15em] text-[var(--color-brand-hover)] uppercase">
                  Investment fund
                </p>
                <h2
                  className="mt-1 text-lg font-extrabold text-[var(--color-ink)]"
                  id="investment-modal-title"
                >
                  {selectedPlan.name}
                </h2>
              </div>
              <button
                aria-label="Close"
                className="grid size-10 place-items-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-ink)]"
                onClick={closePlan}
                type="button"
              >
                <X size={18} weight="bold" />
              </button>
            </header>

            <div className="grid min-w-0 gap-4 p-4 sm:p-6 lg:grid-cols-[0.82fr_1.18fr]">
              <aside className="rounded-[1.35rem] bg-[var(--color-ink)] p-5 text-white">
                <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-[#67e4a7]">
                  <Calculator size={21} weight="duotone" />
                </span>
                <p className="mt-5 text-[0.58rem] font-extrabold tracking-[0.12em] text-white/42 uppercase">
                  Plan terms
                </p>
                <dl className="mt-3 grid gap-3 text-xs">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <dt className="font-semibold text-white/52">Minimum</dt>
                    <dd className="font-extrabold">
                      {formatUsd(selectedPlan.minimumInvestment)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <dt className="font-semibold text-white/52">Daily objective</dt>
                    <dd className="font-extrabold text-[#67e4a7]">
                      {selectedPlan.dailyObjective}%
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <dt className="font-semibold text-white/52">Term</dt>
                    <dd className="font-extrabold">
                      {selectedPlan.horizonDays} days
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="font-semibold text-white/52">Risk</dt>
                    <dd className="font-extrabold">{selectedPlan.risk}</dd>
                  </div>
                </dl>
              </aside>

              {step === "amount" ? (
                <form
                  className="rounded-[1.35rem] border border-[var(--color-border)] bg-white p-5"
                  onSubmit={proceedToWallet}
                >
                  <h3 className="text-base font-extrabold text-[var(--color-ink)]">
                    Enter your investment amount
                  </h3>
                  <p className="mt-1 text-xs leading-5 font-medium text-[var(--color-text-muted)]">
                    Amounts are shown in USD and must meet this fund&apos;s minimum.
                  </p>

                  <label
                    className="mt-5 block text-xs font-extrabold text-[var(--color-ink)]"
                    htmlFor="fund-investment-amount"
                  >
                    Investment amount
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-extrabold text-[var(--color-brand-hover)]">
                      $
                    </span>
                    <input
                      aria-describedby="fund-investment-help"
                      className={cn(
                        "h-12 w-full rounded-xl border bg-[#f8faf9] pr-4 pl-9 text-sm font-extrabold outline-none",
                        amount && !isValidAmount
                          ? "border-[var(--color-danger)]"
                          : "border-[var(--color-border)] focus:border-[var(--color-brand)]",
                      )}
                      id="fund-investment-amount"
                      min={selectedPlan.minimumInvestment}
                      onChange={(event) => setAmount(event.target.value)}
                      required
                      step="0.01"
                      type="number"
                      value={amount}
                    />
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-[0.66rem] font-semibold",
                      amount && !isValidAmount
                        ? "text-[var(--color-danger)]"
                        : "text-[var(--color-text-muted)]",
                    )}
                    id="fund-investment-help"
                  >
                    {amount && !isValidAmount
                      ? `Enter at least ${formatUsd(selectedPlan.minimumInvestment)}.`
                      : `Minimum investment: ${formatUsd(selectedPlan.minimumInvestment)}.`}
                  </p>

                  <dl className="mt-5 grid gap-2 rounded-xl bg-[#f5f8f7] p-3 min-[400px]:grid-cols-2">
                    <div>
                      <dt className="text-[0.56rem] font-extrabold tracking-[0.07em] text-[var(--color-text-muted)] uppercase">
                        Projected profit
                      </dt>
                      <dd className="mt-1 text-sm font-extrabold text-[var(--color-brand-hover)]">
                        {formatUsd(projection.profit)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[0.56rem] font-extrabold tracking-[0.07em] text-[var(--color-text-muted)] uppercase">
                        Projected total
                      </dt>
                      <dd className="mt-1 text-sm font-extrabold text-[var(--color-ink)]">
                        {formatUsd(projection.total)}
                      </dd>
                    </div>
                  </dl>

                  <button
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-45"
                    disabled={!isValidAmount}
                    type="submit"
                  >
                    Proceed
                    <ArrowRight size={16} weight="bold" />
                  </button>
                </form>
              ) : (
                <section className="rounded-[1.35rem] border border-[var(--color-border)] bg-white p-5">
                  <div className="flex items-start gap-3">
                    <button
                      aria-label="Change investment amount"
                      className="grid size-9 shrink-0 place-items-center rounded-xl border border-[var(--color-border)] text-[var(--color-ink)] transition hover:border-[var(--color-brand)]"
                      onClick={returnToAmount}
                      type="button"
                    >
                      <ArrowLeft size={16} weight="bold" />
                    </button>
                    <div>
                      <h3 className="text-base font-extrabold text-[var(--color-ink)]">
                        Choose a crypto wallet
                      </h3>
                      <p className="mt-1 text-xs leading-5 font-medium text-[var(--color-text-muted)]">
                        Select the wallet that will fund this investment.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f5f8f7] px-4 py-3">
                    <span className="text-[0.62rem] font-extrabold tracking-[0.08em] text-[var(--color-text-muted)] uppercase">
                      Investment amount
                    </span>
                    <strong className="text-sm text-[var(--color-ink)]">
                      {formatUsd(amountNumber)}
                    </strong>
                  </div>

                  {isLoadingBalances ? (
                    <div className="mt-4 flex min-h-32 items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] text-xs font-bold text-[var(--color-text-muted)]">
                      <SpinnerGap className="animate-spin" size={18} weight="bold" />
                      Loading your wallets
                    </div>
                  ) : fundedBalances.length === 0 && !walletError ? (
                    <div className="mt-4 rounded-xl border border-dashed border-[var(--color-border)] p-4">
                      <Wallet className="mx-auto text-[var(--color-text-muted)]" size={24} weight="duotone" />
                      <p className="mt-2 text-center text-xs font-extrabold text-[var(--color-ink)]">
                        No crypto wallet balance available
                      </p>
                      <p className="mt-1 text-center text-[0.66rem] font-medium text-[var(--color-text-muted)]">
                        Choose how you want to fund {formatUsd(amountNumber)}.
                      </p>
                      {isLoadingFundingQuotes ? (
                        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#f5f8f7] p-4 text-xs font-bold text-[var(--color-text-muted)]">
                          <SpinnerGap className="animate-spin" size={17} weight="bold" />
                          Loading live crypto amounts
                        </div>
                      ) : (
                        <div className="mt-4 grid gap-2">
                          {activeCryptoMethods.map((method) => {
                            const quote = method.asset
                              ? fundingQuotes[method.asset]
                              : undefined;

                            return (
                              <button
                                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-white p-3 text-left transition hover:border-[var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={!quote}
                                key={method.id}
                                onClick={() => quote && openAddMoney(method, quote)}
                                type="button"
                              >
                                <span>
                                  <span className="block text-xs font-extrabold text-[var(--color-ink)]">
                                    {method.name}
                                  </span>
                                  <span className="mt-0.5 block text-[0.6rem] font-semibold text-[var(--color-text-muted)]">
                                    {method.asset} · {method.network}
                                  </span>
                                </span>
                                <span className="text-right">
                                  <span className="block text-[0.58rem] font-bold text-[var(--color-text-muted)]">
                                    {formatUsd(amountNumber)} ≈
                                  </span>
                                  <span className="mt-0.5 block font-mono text-[0.68rem] font-extrabold text-[var(--color-brand-hover)]">
                                    {quote && method.asset
                                      ? formatCryptoExact(
                                          quote.convertedAmount,
                                          method.asset,
                                        )
                                      : "Unavailable"}
                                  </span>
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {fundingQuoteError && (
                        <p className="mt-3 text-center text-[0.65rem] font-bold text-[var(--color-danger)]">
                          {fundingQuoteError}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {fundedBalances.map((balance) => (
                        <button
                          className={cn(
                            "rounded-xl border p-3 text-left transition",
                            selectedCurrency === balance.currency
                              ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                              : "border-[var(--color-border)] hover:border-[var(--color-brand)]",
                          )}
                          key={balance.currency}
                          onClick={() => chooseWallet(balance)}
                          type="button"
                        >
                          <span className="block text-xs font-extrabold text-[var(--color-ink)]">
                            {balance.currency} wallet
                          </span>
                          <span className="mt-1 block text-[0.66rem] font-semibold text-[var(--color-text-muted)]">
                            {formatCrypto(balance.availableBalance, balance.currency)} available
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {isConverting && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f5f8f7] p-3 text-xs font-bold text-[var(--color-text-muted)]">
                      <SpinnerGap className="animate-spin" size={17} weight="bold" />
                      Fetching the current {selectedCurrency} rate
                    </div>
                  )}

                  {walletError && (
                    <p className="mt-4 rounded-xl bg-red-50 p-3 text-[0.68rem] leading-5 font-bold text-[var(--color-danger)]">
                      {walletError}
                    </p>
                  )}

                  {selectedBalance && conversion && remainingBalance !== null && (
                    <div className="mt-4 rounded-xl border border-[var(--color-border)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[0.62rem] font-bold text-[var(--color-text-muted)]">
                          Current balance
                        </span>
                        <strong className="text-xs text-[var(--color-ink)]">
                          {formatCrypto(selectedBalance.availableBalance, selectedBalance.currency)}
                        </strong>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-[0.62rem] font-bold text-[var(--color-text-muted)]">
                          Wallet deduction
                        </span>
                        <strong className="text-xs text-[var(--color-brand-hover)]">
                          − {formatCrypto(conversion.convertedAmount, selectedBalance.currency)}
                        </strong>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
                        <span className="text-[0.62rem] font-extrabold text-[var(--color-ink)]">
                          Balance after investment
                        </span>
                        <strong
                          className={cn(
                            "text-xs",
                            remainingBalance < 0
                              ? "text-[var(--color-danger)]"
                              : "text-[var(--color-ink)]",
                          )}
                        >
                          {formatCrypto(remainingBalance, selectedBalance.currency)}
                        </strong>
                      </div>
                      <p className="mt-3 text-[0.6rem] leading-4 font-semibold text-[var(--color-text-muted)]">
                        Live rate: 1 USD = {formatCrypto(conversion.rate, selectedBalance.currency)}.
                        Quote provided by {conversion.source} and valid for this review only.
                      </p>
                    </div>
                  )}

                  {remainingBalance !== null && remainingBalance < 0 && (
                    <p className="mt-3 rounded-xl bg-amber-50 p-3 text-[0.68rem] leading-5 font-bold text-amber-800">
                      This wallet does not have enough available balance for the selected investment amount.
                    </p>
                  )}

                  {selectedBalance && conversion && remainingBalance !== null && (
                    <button
                      className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 text-xs font-extrabold text-white transition hover:bg-[var(--color-brand-hover)] disabled:cursor-not-allowed disabled:opacity-45"
                      disabled={remainingBalance < 0 || isCreating}
                      onClick={confirmInvestment}
                      type="button"
                    >
                      {isCreating ? (
                        <>
                          <SpinnerGap className="animate-spin" size={17} weight="bold" />
                          Creating investment
                        </>
                      ) : (
                        <>
                          <CheckCircle size={17} weight="bold" />
                          Create investment
                        </>
                      )}
                    </button>
                  )}
                </section>
              )}
            </div>
          </section>
        </div>
      )}
      <AddMoneyModal
        completionButtonLabel="Back to investment funds"
        methods={methods}
        onSubmitted={() => undefined}
      />
    </>
  );
}
