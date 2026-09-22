"use client";

import {
  Check,
  Copy,
  ImageSquare,
  SpinnerGap,
  Trash,
  UploadSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";

import { WalletQrCode } from "@/components/deposits/wallet-qr-code";
import type { Deposit, PaymentMethod } from "@/lib/api/types";
import { submitDepositWithProof } from "@/services/deposit.service";

const maximumPaymentProofBytes = 5 * 1024 * 1024;

type DepositForm = {
  amount: string;
  notes: string;
  senderWalletAddress: string;
  transactionHash: string;
};

const initialForm: DepositForm = {
  amount: "",
  notes: "",
  senderWalletAddress: "",
  transactionHash: "",
};

export function UsdtDepositForm({
  method,
  onSubmitted,
}: {
  method: PaymentMethod;
  onSubmitted: (deposit: Deposit) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const walletAddress = method.walletAddress ?? "";

  useEffect(() => {
    return () => {
      if (paymentProofPreview) URL.revokeObjectURL(paymentProofPreview);
    };
  }, [paymentProofPreview]);

  function updateField(field: keyof DepositForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  async function copyWalletAddress() {
    await navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!paymentProof) {
      setError("Upload a screenshot of your completed payment.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const deposit = await submitDepositWithProof({
        onProgress: setUploadProgress,
        paymentProof,
        payload: {
          amount: Number(form.amount),
          notes: form.notes,
          paymentMethodId: method.id,
          senderWalletAddress: form.senderWalletAddress,
          transactionHash: form.transactionHash,
        },
      });

      setForm(initialForm);
      setPaymentProof(null);
      setPaymentProofPreview("");
      onSubmitted(deposit);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The deposit service is unavailable. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  }

  function selectPaymentProof(file?: File) {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Select a PNG, JPEG, or WebP payment screenshot.");
      return;
    }

    if (file.size > maximumPaymentProofBytes) {
      setError("The payment screenshot must be 5 MB or smaller.");
      return;
    }

    setPaymentProof(file);
    setPaymentProofPreview(URL.createObjectURL(file));
    setError("");
  }

  function removePaymentProof() {
    setPaymentProof(null);
    setPaymentProofPreview("");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
      <section className="rounded-[1.5rem] bg-[var(--color-ink)] p-6 text-white">
        <p className="text-[0.65rem] font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">
          TradeUply Receiving Wallet
        </p>
        <div className="mt-5 flex justify-center rounded-2xl bg-white p-4">
          <WalletQrCode imageUrl={method.qrCodeUrl ?? ""} />
        </div>
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.06] p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-extrabold text-white/55">
              Network
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
            {copied ? "Wallet copied" : "Copy wallet address"}
          </button>
        </div>
        <div className="mt-4 flex gap-3 rounded-xl bg-[#e6b75f]/12 p-4 text-[#ffe1a3]">
          <WarningCircle
            className="mt-0.5 shrink-0"
            size={19}
            weight="duotone"
          />
          <p className="text-[0.68rem] leading-5 font-semibold">
            Send only USDT through {method.network}. Using another network can
            permanently lose your funds.
          </p>
        </div>
      </section>

      <form
        className="rounded-[1.5rem] border border-[var(--color-border)] bg-white p-6"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-extrabold text-[var(--color-ink)]">
          Submit transaction details
        </h3>
        <p className="mt-2 text-xs leading-5 font-medium text-[var(--color-text-muted)]">
          Complete the transfer first, then provide the blockchain details
          below.
        </p>

        <label
          className="mt-6 block text-xs font-extrabold text-[var(--color-ink)]"
          htmlFor="deposit-amount"
        >
          Amount in USDT
        </label>
        <input
          className="mt-2 h-13 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] px-4 text-sm font-bold outline-none focus:border-[var(--color-brand)]"
          id="deposit-amount"
          min={method.minimumAmount ?? "0.00000001"}
          onChange={(event) => updateField("amount", event.target.value)}
          required
          step="0.00000001"
          type="number"
          value={form.amount}
        />

        <label
          className="mt-4 block text-xs font-extrabold text-[var(--color-ink)]"
          htmlFor="sender-wallet"
        >
          Sender wallet address
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
          Transaction ID / hash
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

        <div className="mt-4">
          <p className="text-xs font-extrabold text-[var(--color-ink)]">
            Payment screenshot
          </p>
          <p className="mt-1 text-[0.68rem] leading-5 font-medium text-[var(--color-text-muted)]">
            Upload the confirmation screen showing the completed amount and
            transaction.
          </p>

          {paymentProofPreview ? (
            <div className="mt-3 flex items-center gap-4 rounded-2xl border border-[var(--color-brand)]/30 bg-[var(--color-brand-soft)] p-3">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-white bg-white">
                <Image
                  alt="Selected payment screenshot"
                  className="size-full object-cover"
                  fill
                  sizes="80px"
                  src={paymentProofPreview}
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-extrabold text-[var(--color-ink)]">
                  {paymentProof?.name}
                </p>
                <p className="mt-1 text-[0.66rem] font-semibold text-[var(--color-text-muted)]">
                  {paymentProof
                    ? `${(paymentProof.size / 1024 / 1024).toFixed(2)} MB`
                    : ""}
                </p>
                <div className="mt-2 flex gap-2">
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[0.65rem] font-extrabold text-[var(--color-brand-hover)]">
                    <UploadSimple size={14} weight="bold" /> Replace
                    <input
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      disabled={isSubmitting}
                      onChange={(event) => {
                        selectPaymentProof(event.target.files?.[0]);
                        event.target.value = "";
                      }}
                      type="file"
                    />
                  </label>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[0.65rem] font-extrabold text-[#b74c39]"
                    disabled={isSubmitting}
                    onClick={removePaymentProof}
                    type="button"
                  >
                    <Trash size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label className="mt-3 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[#f8faf9] px-5 text-center transition hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]">
              <span className="grid size-10 place-items-center rounded-xl bg-white text-[var(--color-brand-hover)] shadow-sm">
                <ImageSquare size={21} weight="duotone" />
              </span>
              <span className="mt-3 text-xs font-extrabold text-[var(--color-ink)]">
                Choose payment screenshot
              </span>
              <span className="mt-1 text-[0.65rem] font-semibold text-[var(--color-text-muted)]">
                PNG, JPEG, or WebP · maximum 5 MB
              </span>
              <input
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                disabled={isSubmitting}
                onChange={(event) => {
                  selectPaymentProof(event.target.files?.[0]);
                  event.target.value = "";
                }}
                required
                type="file"
              />
            </label>
          )}
        </div>

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

        {isSubmitting && (
          <div className="mt-4" aria-live="polite">
            <div className="flex items-center justify-between text-[0.68rem] font-bold text-[var(--color-text-muted)]">
              <span>
                {uploadProgress < 100
                  ? `Uploading payment proof ${uploadProgress}%`
                  : "Securing your submission…"}
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div
              aria-label="Deposit submission progress"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={uploadProgress}
              className="mt-2 h-2 overflow-hidden rounded-full bg-[#dce8e2]"
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-[var(--color-brand)] transition-[width]"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <button
          className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-extrabold text-white transition hover:bg-[var(--color-brand-hover)] disabled:opacity-65"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting && <SpinnerGap className="animate-spin" size={18} />}
          {isSubmitting
            ? "Submitting for verification…"
            : "Submit Deposit & Proof"}
        </button>
      </form>
    </div>
  );
}
