"use client";

import { ArrowLeft, CheckCircle, X } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { PaymentMethodGrid } from "@/components/deposits/payment-method-grid";
import { UsdtDepositForm } from "@/components/deposits/usdt-deposit-form";
import type { Deposit, PaymentMethod } from "@/lib/api/types";

export function AddMoneyModal({
  methods,
  onSubmitted,
}: {
  methods: PaymentMethod[];
  onSubmitted: (deposit: Deposit) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("modal") === "add-money";
  const selectedCode = searchParams.get("method");
  const [submittedDeposit, setSubmittedDeposit] = useState<Deposit | null>(null);
  const selectedMethod = useMemo(
    () => methods.find((method) => method.code === selectedCode) ?? null,
    [methods, selectedCode],
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function updateUrl(methodCode?: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "add-money");
    if (methodCode) params.set("method", methodCode);
    else params.delete("method");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function closeModal() {
    setSubmittedDeposit(null);
    router.replace(pathname, { scroll: false });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[75] flex items-end justify-center bg-[var(--color-ink)]/52 backdrop-blur-sm sm:items-center sm:p-5">
      <button aria-label="Close add money" className="absolute inset-0" onClick={closeModal} type="button" />
      <section aria-modal="true" className="relative max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-[2rem] bg-[#f5f8f7] shadow-2xl sm:rounded-[2rem]" role="dialog">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--color-border)] bg-white/94 px-5 py-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            {selectedMethod && !submittedDeposit && (
              <button aria-label="Choose another payment method" className="grid size-10 place-items-center rounded-xl border border-[var(--color-border)]" onClick={() => updateUrl()} type="button"><ArrowLeft size={18} weight="bold" /></button>
            )}
            <div>
              <p className="text-[0.62rem] font-extrabold tracking-[0.17em] text-[var(--color-brand-hover)] uppercase">Fund your account</p>
              <h2 className="mt-1 text-lg font-extrabold text-[var(--color-ink)]">{selectedMethod ? selectedMethod.name : "Choose a payment method"}</h2>
            </div>
          </div>
          <button aria-label="Close" className="grid size-10 place-items-center rounded-xl border border-[var(--color-border)] bg-white" onClick={closeModal} type="button"><X size={19} weight="bold" /></button>
        </header>

        <div className="p-5 sm:p-8">
          {submittedDeposit ? (
            <div className="mx-auto max-w-xl py-10 text-center">
              <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"><CheckCircle size={34} weight="duotone" /></span>
              <h3 className="mt-6 text-2xl font-extrabold text-[var(--color-ink)]">Deposit submitted</h3>
              <p className="mt-3 text-sm leading-7 font-medium text-[var(--color-text-muted)]">Your {submittedDeposit.amount} USDT transaction is pending administrator verification. Your balance will update only after approval.</p>
              <button className="mt-7 rounded-xl bg-[var(--color-brand)] px-7 py-3 text-sm font-extrabold text-white" onClick={closeModal} type="button">View dashboard</button>
            </div>
          ) : selectedMethod?.code === "usdt" &&
            selectedMethod.walletAddress &&
            selectedMethod.network &&
            selectedMethod.qrCodeUrl ? (
            <UsdtDepositForm
              method={selectedMethod}
              onSubmitted={(deposit) => {
                setSubmittedDeposit(deposit);
                onSubmitted(deposit);
              }}
            />
          ) : (
            <PaymentMethodGrid methods={methods} onSelect={(method) => updateUrl(method.code)} selectedCode={selectedCode} />
          )}
        </div>
      </section>
    </div>
  );
}
