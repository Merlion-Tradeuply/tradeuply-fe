"use client";

import {
  Bank,
  CreditCard,
  CurrencyBtc,
  DeviceMobile,
  QrCode,
  Wallet,
} from "@phosphor-icons/react";

import type { PaymentMethod } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const icons = {
  "apple-pay": DeviceMobile,
  bitcoin: CurrencyBtc,
  "credit-card": CreditCard,
  "debit-card": CreditCard,
  "google-pay": Wallet,
  "upi-qr": QrCode,
  usdt: Bank,
} as const;

export function PaymentMethodGrid({
  methods,
  onSelect,
  selectedCode,
}: {
  methods: PaymentMethod[];
  onSelect: (method: PaymentMethod) => void;
  selectedCode: string | null;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {methods.map((method) => {
        const Icon = icons[method.code as keyof typeof icons] ?? Wallet;
        const isAvailable =
          method.status === "active" &&
          Boolean(method.walletAddress) &&
          Boolean(method.network) &&
          Boolean(method.qrCodeUrl);
        const isSelected = selectedCode === method.code;

        return (
          <button
            className={cn(
              "relative flex min-h-24 items-center gap-4 rounded-2xl border p-4 text-left transition",
              isSelected
                ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)] shadow-[0_10px_30px_rgba(6,184,102,0.1)]"
                : "border-[var(--color-border)] bg-white",
              isAvailable
                ? "hover:-translate-y-0.5 hover:border-[var(--color-brand)]/45"
                : "cursor-not-allowed opacity-58",
            )}
            disabled={!isAvailable}
            key={method.id}
            onClick={() => onSelect(method)}
            type="button"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#edf5f1] text-[var(--color-brand-hover)]">
              <Icon aria-hidden="true" size={23} weight="duotone" />
            </span>
            <span>
              <span className="block text-sm font-extrabold text-[var(--color-ink)]">{method.name}</span>
              <span className="mt-1 block text-[0.68rem] font-bold text-[var(--color-text-muted)]">
                {isAvailable
                  ? `${method.network} · Available`
                  : method.status === "active"
                    ? "Configuration required"
                    : "Coming soon"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
