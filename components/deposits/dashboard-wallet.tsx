"use client";

import { ArrowDown, Plus, Wallet } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AddMoneyModal } from "@/components/deposits/add-money-modal";
import { DepositHistory } from "@/components/deposits/deposit-history";
import type { ClientBalance, Deposit, PaymentMethod } from "@/lib/api/types";

export function DashboardWallet({
  balance,
  deposits: initialDeposits,
  methods,
}: {
  balance: ClientBalance;
  deposits: Deposit[];
  methods: PaymentMethod[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deposits, setDeposits] = useState(initialDeposits);

  function openAddMoney() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "add-money");
    params.delete("method");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      <section className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="relative overflow-hidden rounded-[1.7rem] bg-[var(--color-ink)] p-7 text-white shadow-[0_24px_65px_rgba(3,26,59,0.14)] sm:p-8">
          <div aria-hidden="true" className="absolute -top-20 -right-14 size-60 rounded-full bg-[var(--color-brand)]/22 blur-3xl" />
          <div className="relative flex items-start justify-between gap-5">
            <div>
              <p className="text-xs font-extrabold tracking-[0.16em] text-[#67e4a7] uppercase">Available balance</p>
              <p className="mt-4 text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold tracking-[-0.05em]">{balance.availableBalance} <span className="text-lg text-white/55">USDT</span></p>
              <p className="mt-2 text-xs font-semibold text-white/48">Approved funds available in your TradeUply account</p>
            </div>
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/8 text-[#67e4a7]"><Wallet size={26} weight="duotone" /></span>
          </div>
          <button className="relative mt-7 inline-flex min-h-13 items-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-sm font-extrabold text-white transition hover:bg-[var(--color-brand-hover)]" onClick={openAddMoney} type="button"><Plus size={18} weight="bold" />Add Money</button>
        </article>

        <article className="rounded-[1.7rem] border border-[var(--color-border)] bg-white p-7 shadow-[0_18px_55px_rgba(18,45,72,0.07)] sm:p-8">
          <span className="grid size-11 place-items-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"><ArrowDown size={23} weight="duotone" /></span>
          <p className="mt-6 text-xs font-extrabold tracking-[0.14em] text-[var(--color-text-muted)] uppercase">Total approved deposits</p>
          <p className="mt-2 text-2xl font-extrabold text-[var(--color-ink)]">{balance.totalDeposited} USDT</p>
          <p className="mt-4 text-xs leading-5 font-medium text-[var(--color-text-muted)]">Pending submissions are not included until an administrator verifies them.</p>
        </article>
      </section>

      <DepositHistory deposits={deposits} />
      <AddMoneyModal methods={methods} onSubmitted={(deposit) => setDeposits((current) => [deposit, ...current])} />
    </>
  );
}
