"use client";

import {
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
  const depositMethods = methods.filter((method) =>
    ["crypto", "wallet"].includes(method.category),
  );

  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
      {depositMethods.map((method) => {
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
              "relative flex min-h-24 min-w-0 items-center gap-3 overflow-hidden rounded-2xl border p-4 text-left transition sm:gap-4",
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
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold text-[var(--color-ink)]">{method.name}</span>
              <span className="mt-1 block text-[0.68rem] font-bold text-[var(--color-text-muted)]">
                {isAvailable
                  ? `${method.category === "wallet" ? "Digital Wallet" : method.asset} · ${method.network} · Available`
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
