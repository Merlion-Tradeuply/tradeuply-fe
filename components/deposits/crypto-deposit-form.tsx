"use client";

import {
  Check,
  ClockCountdown,
  Copy,
  ArrowsClockwise,
  SpinnerGap,
  WarningCircle,
} from "@phosphor-icons/react";
import { useEffect, useState, type FormEvent } from "react";

import { WalletQrCode } from "@/components/deposits/wallet-qr-code";
import type { CurrencyConversion, Deposit, PaymentMethod } from "@/lib/api/types";
import { getCurrencyConversion } from "@/services/currency.service";
import { submitDeposit } from "@/services/deposit.service";

type DepositForm = {
  amount: string;
  amountUsd: string;
  notes: string;
  senderWalletAddress: string;
  transactionHash: string;
};

const initialForm: DepositForm = {
  amount: "",
  amountUsd: "",
  notes: "",
  senderWalletAddress: "",
  transactionHash: "",
};

export function CryptoDepositForm({
  countdown,
  countdownUrgent = false,
  initialAmount = "",
  method,
  onSubmitted,
  referenceUsdAmount,
}: {
  countdown: string;
  countdownUrgent?: boolean;
  initialAmount?: string;
  method: PaymentMethod;
  onSubmitted: (deposit: Deposit) => void;
  referenceUsdAmount?: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    ...initialForm,
    amount: initialAmount,
    amountUsd: referenceUsdAmount ?? "",
  });
  const [conversion, setConversion] = useState<CurrencyConversion | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(Boolean(referenceUsdAmount));
  const [quoteError, setQuoteError] = useState("");
  const [quoteRefreshCounter, setQuoteRefreshCounter] = useState(0);
  const [quoteSecondsRemaining, setQuoteSecondsRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const asset = method.asset ?? "Crypto";
  const walletAddress = method.walletAddress ?? "";
  const isUpi = method.category === "wallet";

  useEffect(() => {
    const amountUsd = Number(form.amountUsd);
    if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
      return;
    }

    let active = true;
    const timer = window.setTimeout(() => {
      void getCurrencyConversion({ amount: amountUsd, from: "USD", to: asset })
        .then((quote) => {
          if (!active) return;
          setConversion(quote);
          setQuoteSecondsRemaining(Math.max(0, Math.ceil((new Date(quote.quoteExpiresAt).getTime() - Date.now()) / 1000)));
          setForm((current) => ({
            ...current,
            amount: isUpi
              ? quote.convertedAmount.toFixed(2)
              : quote.convertedAmount.toFixed(8),
          }));
        })
        .catch((reason: unknown) => {
          if (!active) return;
          setConversion(null);
          setQuoteSecondsRemaining(0);
          setForm((current) => ({ ...current, amount: "" }));
          setQuoteError(reason instanceof Error ? reason.message : "The live USD quote is unavailable.");
        })
        .finally(() => {
          if (active) setIsLoadingQuote(false);
        });
    }, 350);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [asset, form.amountUsd, isUpi, quoteRefreshCounter]);

  useEffect(() => {
    if (!conversion) return;
    const updateCountdown = () => {
      const seconds = Math.max(0, Math.ceil((new Date(conversion.quoteExpiresAt).getTime() - Date.now()) / 1000));
      setQuoteSecondsRemaining(seconds);
      if (seconds === 0) {
        setConversion(null);
        setIsLoadingQuote(true);
        setQuoteRefreshCounter((current) => current + 1);
      }
    };
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, [conversion]);

  function updateField(field: keyof DepositForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function updateUsdAmount(value: string) {
    setForm((current) => ({ ...current, amount: "", amountUsd: value }));
    setConversion(null);
    setQuoteSecondsRemaining(0);
    setQuoteError("");
    setError("");
    setIsLoadingQuote(Number(value) > 0);
  }

  function refreshQuote() {
    setConversion(null);
    setQuoteSecondsRemaining(0);
    setQuoteError("");
    setIsLoadingQuote(true);
    setQuoteRefreshCounter((current) => current + 1);
  }

  async function copyWalletAddress() {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    setIsSubmitting(true);

    try {
      const deposit = await submitDeposit({
        amount: Number(form.amount),
        amountUsd: Number(form.amountUsd),
        notes: form.notes,
        paymentMethodId: method.id,
        senderWalletAddress: form.senderWalletAddress,
        transactionHash: form.transactionHash,
      });

      setForm(initialForm);
      setConversion(null);
      setQuoteSecondsRemaining(0);
      onSubmitted(deposit);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The deposit service is unavailable. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <section className="min-w-0 overflow-hidden rounded-[1.25rem] bg-[var(--color-ink)] p-4 text-white sm:rounded-[1.5rem] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.65rem] font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">
            {isUpi ? "TradeUply UPI" : "TradeUply Receiving Wallet"}
          </p>
          <div
            aria-live="polite"
            className={`flex min-h-9 shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-extrabold ${
              countdownUrgent
                ? "border-amber-300/60 bg-amber-300/14 text-[#ffe1a3]"
                : "border-white/12 bg-white/[0.07] text-white"
            }`}
            title="This payment window closes automatically when the timer expires."
          >
            <ClockCountdown size={16} weight="duotone" />
            <span>{countdown}</span>
          </div>
        </div>
        <div className="mt-5 flex min-w-0 justify-center overflow-hidden rounded-2xl bg-white p-3 sm:p-4">
          <WalletQrCode asset={asset} imageUrl={method.qrCodeUrl ?? ""} />
        </div>
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.06] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-extrabold text-white/55">
              {isUpi ? "Payment rail" : "Network"}
            </span>
            <span className="rounded-full bg-[#67e4a7]/12 px-3 py-1 text-xs font-extrabold text-[#67e4a7]">
              {method.network}
            </span>
          </div>
          <p className="mt-4 break-all text-xs leading-5 font-semibold text-white/78">
            {walletAddress}
          </p>
          <button
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-white/8"
            onClick={copyWalletAddress}
            type="button"
          >
            {copied ? <Check size={16} weight="bold" /> : <Copy size={16} />}
            {copied ? (isUpi ? "UPI ID copied" : "Wallet copied") : (isUpi ? "Copy UPI ID" : "Copy wallet address")}
          </button>
        </div>
        <div className="mt-4 flex gap-3 rounded-xl bg-[#e6b75f]/12 p-4 text-[#ffe1a3]">
          <WarningCircle
            className="mt-0.5 shrink-0"
            size={19}
            weight="duotone"
          />
          <p className="text-[0.68rem] leading-5 font-semibold">
            {method.instructions || (isUpi
              ? "Pay the exact INR amount to the displayed UPI ID and retain the UPI transaction ID / UTR for verification."
              : `Send only ${asset} through ${method.network}. Using another asset or network can permanently lose your funds.`)}
          </p>
        </div>
      </section>

      <form
        className="min-w-0 rounded-[1.25rem] border border-[var(--color-border)] bg-white p-4 sm:rounded-[1.5rem] sm:p-6"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-extrabold text-[var(--color-ink)]">
          Submit transaction details
        </h3>
        <p className="mt-2 text-xs leading-5 font-medium text-[var(--color-text-muted)]">
          {isUpi
            ? "Complete the UPI payment first, then provide the payment details below."
            : "Complete the transfer first, then provide the blockchain details below."}
        </p>

        {referenceUsdAmount && (
          <div className="mt-5 rounded-xl bg-[var(--color-brand-soft)] p-3">
            <p className="text-[0.58rem] font-extrabold tracking-[0.08em] text-[var(--color-brand-hover)] uppercase">
              Investment funding amount
            </p>
            <p className="mt-1 break-words text-sm font-extrabold text-[var(--color-ink)]">
              ${Number(referenceUsdAmount).toFixed(2)} USD · fixed by the selected investment plan
            </p>
          </div>
        )}

        <label
          className="mt-6 block text-xs font-extrabold text-[var(--color-ink)]"
          htmlFor="deposit-usd-amount"
        >
          Amount in USD
        </label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-extrabold text-[var(--color-text-muted)]">$</span>
          <input
            className="h-13 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] pr-4 pl-8 text-sm font-bold outline-none focus:border-[var(--color-brand)] read-only:cursor-not-allowed read-only:bg-slate-100"
            id="deposit-usd-amount"
            min="0.01"
            onChange={(event) => updateUsdAmount(event.target.value)}
            readOnly={Boolean(referenceUsdAmount)}
            required
            step="0.01"
            type="number"
            value={form.amountUsd}
          />
        </div>

        <label className="mt-4 block text-xs font-extrabold text-[var(--color-ink)]" htmlFor="deposit-amount">
          {isUpi ? `Amount to pay in ${asset}` : `Amount to send in ${asset}`}
        </label>
        <input
          className="mt-2 h-13 w-full cursor-not-allowed rounded-xl border border-[var(--color-border)] bg-slate-100 px-4 text-sm font-bold outline-none"
          id="deposit-amount"
          readOnly
          required
          type="text"
          value={form.amount}
        />

        <div aria-live="polite" className="mt-3 min-h-12">
          {isLoadingQuote ? (
            <p className="flex items-center gap-2 rounded-xl bg-[#f4f8f6] p-3 text-xs font-bold text-[var(--color-text-muted)]"><SpinnerGap className="animate-spin" size={16} />Calculating live USD conversion…</p>
          ) : conversion ? (
            <div className="rounded-xl border border-[var(--color-brand)]/20 bg-[var(--color-brand-soft)] p-3">
              <p className="text-sm font-extrabold text-[var(--color-ink)]">
                ${Number(form.amountUsd).toFixed(2)} USD ≈ {isUpi ? Number(form.amount).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : form.amount} {asset}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-1 text-[0.66rem] font-semibold text-[var(--color-text-muted)]">
                1 USD = {conversion.rate.toFixed(isUpi ? 4 : 10)} {asset} · {conversion.source} · refreshes in {Math.floor(quoteSecondsRemaining / 60)}:{String(quoteSecondsRemaining % 60).padStart(2, "0")}
              </p>
            </div>
          ) : quoteError ? (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#fff3ef] p-3 text-xs font-bold text-[#b74c39]">
              <span>{quoteError}</span>
              <button aria-label="Retry conversion quote" className="shrink-0" onClick={refreshQuote} type="button"><ArrowsClockwise size={18} weight="bold" /></button>
            </div>
          ) : null}
        </div>

        <label
          className="mt-4 block text-xs font-extrabold text-[var(--color-ink)]"
          htmlFor="sender-wallet"
        >
          {isUpi ? "Payer UPI ID" : "Sender wallet address"}
        </label>
        <input
          className="mt-2 h-13 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] px-4 text-sm font-bold outline-none focus:border-[var(--color-brand)]"
          id="sender-wallet"
          onChange={(event) =>
            updateField("senderWalletAddress", event.target.value)
          }
          required
          value={form.senderWalletAddress}
        />

        <label
          className="mt-4 block text-xs font-extrabold text-[var(--color-ink)]"
          htmlFor="transaction-hash"
        >
          {isUpi ? "UPI transaction ID / UTR" : "Blockchain transaction ID / hash"}
        </label>
        <input
          className="mt-2 h-13 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] px-4 text-sm font-bold outline-none focus:border-[var(--color-brand)]"
          id="transaction-hash"
          onChange={(event) =>
            updateField("transactionHash", event.target.value)
          }
          required
          value={form.transactionHash}
        />
        <p className="mt-2 text-[0.68rem] leading-5 font-medium text-[var(--color-text-muted)]">
          {isUpi
            ? "Enter the UPI transaction ID or UTR generated after completing the payment."
            : "Enter the transaction ID generated by your wallet after sending funds to the TradeUply receiving wallet."}
        </p>

        <label
          className="mt-4 block text-xs font-extrabold text-[var(--color-ink)]"
          htmlFor="deposit-notes"
        >
          Notes{" "}
          <span className="font-medium text-[var(--color-text-muted)]">
            (optional)
          </span>
        </label>
        <textarea
          className="mt-2 min-h-24 w-full resize-y rounded-xl border border-[var(--color-border)] bg-[#f8faf9] p-4 text-sm font-medium outline-none focus:border-[var(--color-brand)]"
          id="deposit-notes"
          maxLength={1000}
          onChange={(event) => updateField("notes", event.target.value)}
          value={form.notes}
        />

        {error && (
          <p className="mt-4 rounded-xl bg-[#fff3ef] p-3 text-xs font-bold text-[#b74c39]">
            {error}
          </p>
        )}

        <button
          className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-extrabold text-white transition hover:bg-[var(--color-brand-hover)] disabled:opacity-65"
          disabled={isSubmitting || isLoadingQuote || !conversion || quoteSecondsRemaining <= 0}
          type="submit"
        >
          {isSubmitting && <SpinnerGap className="animate-spin" size={18} />}
          {isSubmitting ? "Submitting for verification…" : "Submit Deposit"}
        </button>
      </form>
    </div>
  );
}
