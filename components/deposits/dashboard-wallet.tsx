"use client";

import { ArrowDown, ArrowUp, Plus, Wallet } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AddMoneyModal } from "@/components/deposits/add-money-modal";
import { DepositHistory } from "@/components/deposits/deposit-history";
import { WithdrawModal } from "@/components/withdrawals/withdraw-modal";
import { WithdrawalHistory } from "@/components/withdrawals/withdrawal-history";
import type { ClientBalance, ClientWalletPaymentMethod, Deposit, PaymentMethod, Withdrawal } from "@/lib/api/types";
import { getCurrencyConversion } from "@/services/currency.service";

type UsdEstimate = {
  amount?: number;
  sourceAmount: number;
  status: "loading" | "ready" | "unavailable";
};

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

export function DashboardWallet({
  balances,
  deposits: initialDeposits,
  methods,
  withdrawalMethods,
  withdrawals: initialWithdrawals,
}: {
  balances: ClientBalance[];
  deposits: Deposit[];
  methods: PaymentMethod[];
  withdrawalMethods: ClientWalletPaymentMethod[];
  withdrawals: Withdrawal[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deposits, setDeposits] = useState(initialDeposits);
  const [usdEstimates, setUsdEstimates] = useState<Record<string, UsdEstimate>>(() =>
    Object.fromEntries(
      balances
        .filter(
          (balance) =>
            Number(balance.availableBalance) > 0 ||
            Number(balance.lockedBalance) > 0 ||
            Number(balance.totalDeposited) > 0,
        )
        .map((balance) => [
          balance.currency,
          {
            amount: 0,
            sourceAmount: Number(balance.availableBalance),
            status: Number(balance.availableBalance) === 0 ? "ready" : "loading",
          },
        ]),
    ),
  );
  const [walletBalances, setWalletBalances] = useState(balances);
  const [withdrawals, setWithdrawals] = useState(initialWithdrawals);
  const fundedBalances = walletBalances.filter(
    (balance) =>
      Number(balance.availableBalance) > 0 ||
      Number(balance.lockedBalance) > 0 ||
      Number(balance.totalDeposited) > 0,
  );
  const fundedCurrencies = fundedBalances.map((balance) => balance.currency);
  const estimatesLoading = fundedBalances.some(
    (balance) =>
      !usdEstimates[balance.currency] ||
      usdEstimates[balance.currency].sourceAmount !== Number(balance.availableBalance) ||
      usdEstimates[balance.currency].status === "loading",
  );
  const estimatesUnavailable = fundedBalances.some(
    (balance) =>
      usdEstimates[balance.currency]?.sourceAmount === Number(balance.availableBalance) &&
      usdEstimates[balance.currency]?.status === "unavailable",
  );
  const estimatedTotalUsd = fundedBalances.reduce(
    (total, balance) => {
      const estimate = usdEstimates[balance.currency];
      return total + (estimate?.sourceAmount === Number(balance.availableBalance) ? estimate.amount ?? 0 : 0);
    },
    0,
  );

  useEffect(() => {
    const eligibleBalances = walletBalances.filter(
      (balance) =>
        Number(balance.availableBalance) > 0 ||
        Number(balance.lockedBalance) > 0 ||
        Number(balance.totalDeposited) > 0,
    );
    let cancelled = false;

    void Promise.all(
      eligibleBalances.map(async (balance) => {
        const availableBalance = Number(balance.availableBalance);
        if (availableBalance === 0) {
          return [balance.currency, { amount: 0, sourceAmount: availableBalance, status: "ready" }] as const;
        }

        try {
          const conversion = await getCurrencyConversion({
            amount: availableBalance,
            from: balance.currency,
            to: "USD",
          });
          return [
            balance.currency,
            { amount: conversion.convertedAmount, sourceAmount: availableBalance, status: "ready" },
          ] as const;
        } catch {
          return [balance.currency, { sourceAmount: availableBalance, status: "unavailable" }] as const;
        }
      }),
    ).then((estimates) => {
      if (!cancelled) setUsdEstimates(Object.fromEntries(estimates));
    });

    return () => {
      cancelled = true;
    };
  }, [walletBalances]);

  function openAddMoney() {
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "add-money");
    params.delete("method");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function openWithdraw() {
    if (withdrawalMethods.length === 0) {
      router.push("/payment-methods?action=add");
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("modal", "withdraw");
    params.delete("method");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleWithdrawalSubmitted(withdrawal: Withdrawal) {
    setWithdrawals((current) => [withdrawal, ...current]);
    setWalletBalances((current) => current.map((balance) => balance.currency === withdrawal.asset ? {
      ...balance,
      availableBalance: (Number(balance.availableBalance) - Number(withdrawal.amount)).toFixed(8).replace(/\.?0+$/, ""),
      lockedBalance: (Number(balance.lockedBalance) + Number(withdrawal.amount)).toFixed(8).replace(/\.?0+$/, ""),
    } : balance));
    router.refresh();
  }

  return (
    <>
      <section className="grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="relative min-w-0 overflow-hidden rounded-[1.35rem] bg-[var(--color-ink)] p-5 text-white shadow-[0_24px_65px_rgba(3,26,59,0.14)] sm:rounded-[1.7rem] sm:p-8">
          <div aria-hidden="true" className="absolute -top-20 -right-14 size-60 rounded-full bg-[var(--color-brand)]/22 blur-3xl" />
          <div className="relative flex min-w-0 items-start justify-between gap-3 sm:gap-5">
            <div className="min-w-0">
              <p className="text-xs font-extrabold tracking-[0.16em] text-[#67e4a7] uppercase">Wallet balances</p>
              <h2 className="mt-3 text-xl font-extrabold tracking-[-0.035em] sm:text-2xl">Approved crypto funds</h2>
              <p className="mt-2 text-xs font-semibold text-white/48">Each cryptocurrency is tracked in its own wallet balance.</p>
              {fundedCurrencies.length > 0 && (
                <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.065] px-3 py-2">
                  <span className="text-[0.62rem] font-bold text-white/48">Estimated wallet value</span>
                  <strong className="text-sm font-extrabold text-[#67e4a7]">
                    {estimatesLoading
                      ? "Calculating…"
                      : estimatesUnavailable
                        ? "USD total unavailable"
                        : `${formatUsd(estimatedTotalUsd)} USD`}
                  </strong>
                </div>
              )}
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/8 text-[#67e4a7] sm:size-12 sm:rounded-2xl"><Wallet size={24} weight="duotone" /></span>
          </div>
          {fundedBalances.length > 0 ? (
            <div className="relative mt-7 grid gap-3 sm:grid-cols-2">
              {fundedBalances.map((balance) => {
                const estimate = usdEstimates[balance.currency];
                const estimateIsCurrent =
                  estimate?.sourceAmount === Number(balance.availableBalance);
                return (
                  <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.065] p-4" key={balance.currency}>
                    <p className="text-[0.65rem] font-extrabold tracking-[0.12em] text-white/45 uppercase">{balance.currency}</p>
                    <p className="mt-2 break-all text-xl font-extrabold tracking-[-0.035em] sm:text-2xl">
                      {balance.availableBalance} <span className="text-sm text-white/55">{balance.currency}</span>
                    </p>
                    <p className="mt-1 text-[0.65rem] font-semibold text-white/42">Available balance</p>
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="text-[0.58rem] font-bold tracking-[0.08em] text-white/38 uppercase">
                        Current USD estimate
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-[#67e4a7]">
                        {!estimate || !estimateIsCurrent || estimate.status === "loading"
                          ? "Calculating USD value…"
                          : estimate.status === "unavailable"
                            ? "USD value unavailable"
                            : `≈ ${formatUsd(estimate.amount ?? 0)} USD`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="relative mt-7 rounded-2xl border border-white/10 bg-white/[0.055] p-5 text-sm font-semibold text-white/62">
              No approved wallet balance yet. Add funds to create your first crypto wallet.
            </p>
          )}
          <div className="relative mt-7 grid gap-3 sm:flex sm:flex-wrap">
            <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-extrabold text-white transition hover:bg-[var(--color-brand-hover)] sm:min-h-13 sm:w-auto sm:px-6" onClick={openAddMoney} type="button"><Plus size={18} weight="bold" />Add Money</button>
            <button className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/18 bg-white/8 px-5 text-sm font-extrabold text-white transition hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-45 sm:min-h-13 sm:w-auto sm:px-6" disabled={fundedBalances.length === 0} onClick={openWithdraw} type="button"><ArrowUp size={18} weight="bold" />Withdraw</button>
          </div>
        </article>

        <article className="min-w-0 rounded-[1.35rem] border border-[var(--color-border)] bg-white p-5 shadow-[0_18px_55px_rgba(18,45,72,0.07)] sm:rounded-[1.7rem] sm:p-8">
          <span className="grid size-11 place-items-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"><ArrowDown size={23} weight="duotone" /></span>
          <p className="mt-6 text-xs font-extrabold tracking-[0.14em] text-[var(--color-text-muted)] uppercase">Approved deposits by asset</p>
          {fundedBalances.length > 0 ? (
            <dl className="mt-4 grid gap-3">
              {fundedBalances.map((balance) => (
                <div className="flex items-center justify-between rounded-xl bg-[#f5f8f7] px-4 py-3" key={balance.currency}>
                  <dt className="text-xs font-extrabold text-[var(--color-text-muted)]">{balance.currency}</dt>
                  <dd className="text-sm font-extrabold text-[var(--color-ink)]">{balance.totalDeposited}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-sm font-extrabold text-[var(--color-ink)]">No approved deposits</p>
          )}
          <p className="mt-4 text-xs leading-5 font-medium text-[var(--color-text-muted)]">Pending submissions are not included until an administrator verifies them.</p>
        </article>
      </section>

      <DepositHistory deposits={deposits} />
      <WithdrawalHistory withdrawals={withdrawals} />
      <AddMoneyModal methods={methods} onSubmitted={(deposit) => setDeposits((current) => [deposit, ...current])} />
      <WithdrawModal balances={walletBalances} methods={withdrawalMethods} onSubmitted={handleWithdrawalSubmitted} />
    </>
  );
}
