"use client";

import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  MagnifyingGlass,
  Receipt,
  SpinnerGap,
  X,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { CustomSelect, type SelectOption } from "@/components/ui/custom-select";
import type {
  ClientTransaction,
  ClientTransactionResult,
  ClientTransactionType,
} from "@/lib/api/types";
import { getClientTransactions } from "@/services/client-transaction.service";

const typeLabels: Record<ClientTransactionType, string> = {
  adjustment: "Adjustment",
  capital_return: "Capital return",
  deposit: "Deposit",
  investment: "Investment",
  profit_withdrawal: "Profit withdrawal",
  withdrawal: "Withdrawal",
};
const typeOptions: readonly SelectOption[] = [
  { label: "All transaction types", value: "all" },
  { label: "Deposits", value: "deposit" },
  { label: "Investments", value: "investment" },
  { label: "Profit withdrawals", value: "profit_withdrawal" },
  { label: "Capital returns", value: "capital_return" },
  { label: "Withdrawals", value: "withdrawal" },
  { label: "Adjustments", value: "adjustment" },
];
const directionOptions: readonly SelectOption[] = [
  { label: "Credits and debits", value: "all" },
  { label: "Money in · Credits", value: "credit" },
  { label: "Money out · Debits", value: "debit" },
];
const sortOptions: readonly SelectOption[] = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
];

function formatAmount(value: string) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 8,
    minimumFractionDigits: 2,
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function typeClasses(type: ClientTransactionType) {
  if (type === "deposit") return "bg-emerald-50 text-emerald-700";
  if (type === "investment") return "bg-sky-50 text-sky-700";
  if (type === "profit_withdrawal") return "bg-amber-50 text-amber-700";
  if (type === "capital_return") return "bg-violet-50 text-violet-700";
  if (type === "withdrawal") return "bg-rose-50 text-rose-700";
  return "bg-slate-100 text-slate-600";
}

export function ClientTransactionHistory({
  initialData,
}: {
  initialData: ClientTransactionResult;
}) {
  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [type, setType] = useState("all");
  const [direction, setDirection] = useState("all");
  const [currency, setCurrency] = useState("all");
  const [sort, setSort] = useState("newest");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    let ignore = false;
    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      setError("");
      getClientTransactions({
        currency: currency === "all" ? undefined : currency,
        direction:
          direction === "all" ? undefined : (direction as "credit" | "debit"),
        from: from || undefined,
        limit: 10,
        page,
        query: debouncedQuery,
        sort: sort as "newest" | "oldest",
        to: to || undefined,
        type: type === "all" ? undefined : (type as ClientTransactionType),
      })
        .then((result) => {
          if (!ignore) setData(result);
        })
        .catch((requestError) => {
          if (!ignore) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : "Transactions could not be loaded.",
            );
          }
        })
        .finally(() => {
          if (!ignore) setIsLoading(false);
        });
    }, 0);

    return () => {
      ignore = true;
      window.clearTimeout(timeout);
    };
  }, [currency, debouncedQuery, direction, from, page, sort, to, type]);

  const currencyOptions: readonly SelectOption[] = [
    { label: "All cryptocurrencies", value: "all" },
    ...data.currencies.map((item) => ({ label: item, value: item })),
  ];
  const hasFilters = Boolean(
    query || type !== "all" || direction !== "all" || currency !== "all" || from || to,
  );

  function resetFilters() {
    setQuery("");
    setDebouncedQuery("");
    setType("all");
    setDirection("all");
    setCurrency("all");
    setSort("newest");
    setFrom("");
    setTo("");
    setPage(1);
  }

  return (
    <>
      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ["All transactions", data.summary.total],
          ["Money in", data.summary.credits],
          ["Money out", data.summary.debits],
        ].map(([label, value], index) => (
          <article
            className={`rounded-[1.25rem] border p-4 ${
              index === 0
                ? "border-[var(--color-brand)] bg-[var(--color-brand-soft)]"
                : "border-[var(--color-border)] bg-white"
            }`}
            key={label}
          >
            <p className="text-[0.58rem] font-extrabold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
              {label}
            </p>
            <p className="mt-2 text-xl font-extrabold text-[var(--color-ink)]">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-[1.5rem] border border-[var(--color-border)] bg-white shadow-[0_18px_55px_rgba(18,45,72,0.055)]">
        <div className="relative z-20 rounded-t-[1.5rem] border-b border-[var(--color-border)] bg-white p-3 sm:p-4">
          <div className="relative">
            <MagnifyingGlass
              className="absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-text-muted)]"
              size={18}
            />
            <input
              className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] pr-10 pl-11 text-sm font-semibold outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search transactions"
              type="search"
              value={query}
            />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <CustomSelect
              id="transaction-type"
              label="Transaction type"
              onChange={(value) => {
                setType(value);
                setPage(1);
              }}
              options={typeOptions}
              placeholder="All types"
              value={type}
            />
            <CustomSelect
              id="transaction-direction"
              label="Direction"
              onChange={(value) => {
                setDirection(value);
                setPage(1);
              }}
              options={directionOptions}
              placeholder="Credits and debits"
              value={direction}
            />
            <CustomSelect
              id="transaction-currency"
              label="Cryptocurrency"
              onChange={(value) => {
                setCurrency(value);
                setPage(1);
              }}
              options={currencyOptions}
              placeholder="All cryptocurrencies"
              value={currency}
            />
            <CustomSelect
              id="transaction-sort"
              label="Sort"
              onChange={(value) => {
                setSort(value);
                setPage(1);
              }}
              options={sortOptions}
              placeholder="Newest first"
              value={sort}
            />
          </div>

          <div className="mt-3 grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
            <label className="text-sm font-extrabold text-[var(--color-ink)]">
              From date
              <input
                className="mt-2.5 h-12 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] px-4 text-sm font-semibold outline-none focus:border-[var(--color-brand)]"
                onChange={(event) => {
                  setFrom(event.target.value);
                  setPage(1);
                }}
                type="date"
                value={from}
              />
            </label>
            <label className="text-sm font-extrabold text-[var(--color-ink)]">
              To date
              <input
                className="mt-2.5 h-12 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] px-4 text-sm font-semibold outline-none focus:border-[var(--color-brand)]"
                onChange={(event) => {
                  setTo(event.target.value);
                  setPage(1);
                }}
                type="date"
                value={to}
              />
            </label>
            <button
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 text-xs font-extrabold text-[var(--color-ink)] disabled:opacity-40 sm:col-span-2 xl:col-span-1 xl:w-auto"
              disabled={!hasFilters}
              onClick={resetFilters}
              type="button"
            >
              <X size={15} /> Clear filters
            </button>
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-xl bg-red-50 p-3 text-xs font-bold text-[var(--color-danger)]">
            {error}
          </div>
        )}

        <div className="relative min-h-40 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-white/75 backdrop-blur-[1px]">
              <SpinnerGap className="animate-spin text-[var(--color-brand-hover)]" size={25} />
            </div>
          )}
          <table className="hidden w-full min-w-[60rem] border-collapse text-left lg:table">
            <thead className="bg-[#f5f8f7]">
              <tr className="text-[0.58rem] font-extrabold tracking-[0.08em] text-[var(--color-text-muted)] uppercase">
                <th className="px-4 py-3">Transaction</th>
                <th className="px-4 py-3">Money flow</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Balance movement</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.transactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </tbody>
          </table>

          <div className="divide-y divide-[var(--color-border)] lg:hidden">
            {data.transactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>

          {!isLoading && data.transactions.length === 0 && (
            <div className="grid min-h-56 place-items-center p-8 text-center">
              <div>
                <Receipt
                  className="mx-auto text-[var(--color-brand-hover)]"
                  size={30}
                  weight="duotone"
                />
                <h2 className="mt-3 text-base font-extrabold text-[var(--color-ink)]">
                  No transactions found
                </h2>
                <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">
                  Adjust the filters to review a different part of your history.
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="flex flex-col gap-3 rounded-b-[1.5rem] border-t border-[var(--color-border)] bg-white px-3 py-3 text-xs font-semibold text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <span className="text-center sm:text-left">
            Showing {data.transactions.length} of {data.pagination.total} transactions
          </span>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex">
            <button
              className="min-h-10 rounded-lg border border-[var(--color-border)] px-3 font-extrabold text-[var(--color-ink)] disabled:opacity-40"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              type="button"
            >
              Previous
            </button>
            <span className="px-1 text-center whitespace-nowrap sm:px-2">
              Page {data.pagination.page} of {data.pagination.pages}
            </span>
            <button
              className="min-h-10 rounded-lg border border-[var(--color-border)] px-3 font-extrabold text-[var(--color-ink)] disabled:opacity-40"
              disabled={page >= data.pagination.pages || isLoading}
              onClick={() => setPage((current) => current + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </footer>
      </section>
    </>
  );
}

function TransactionCard({ transaction }: { transaction: ClientTransaction }) {
  const isCredit = transaction.direction === "credit";
  const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;

  return (
    <article className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span
          className={`grid size-10 shrink-0 place-items-center rounded-xl ${
            isCredit
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          <Icon size={18} weight="bold" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-[0.52rem] font-extrabold uppercase ${typeClasses(transaction.type)}`}
              >
                {typeLabels[transaction.type]}
              </span>
              <p className="mt-1.5 text-xs font-bold text-[var(--color-ink)]">
                {transaction.description}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <strong
                className={`block text-sm ${isCredit ? "text-emerald-700" : "text-rose-700"}`}
              >
                {isCredit ? "+" : "−"}
                {formatAmount(transaction.amount)} {transaction.currency}
              </strong>
              {transaction.amountUsd && (
                <span className="mt-0.5 block text-[0.56rem] font-semibold text-[var(--color-text-muted)]">
                  ${Number(transaction.amountUsd).toFixed(2)} USD
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 flex min-w-0 items-center gap-2 rounded-xl bg-[#f5f8f7] px-3 py-2.5 text-[0.64rem] font-bold text-[var(--color-ink-soft)]">
            <span className="min-w-0 truncate">{transaction.source}</span>
            <ArrowRight
              className="shrink-0 text-[var(--color-text-muted)]"
              size={14}
            />
            <span className="min-w-0 truncate">{transaction.destination}</span>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-[var(--color-border)] p-2.5">
              <dt className="text-[0.52rem] font-extrabold tracking-[0.07em] text-[var(--color-text-muted)] uppercase">
                Balance before
              </dt>
              <dd className="mt-1 text-[0.66rem] font-extrabold text-[var(--color-ink)]">
                {formatAmount(transaction.balanceBefore)} {transaction.currency}
              </dd>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] p-2.5">
              <dt className="text-[0.52rem] font-extrabold tracking-[0.07em] text-[var(--color-text-muted)] uppercase">
                Balance after
              </dt>
              <dd className="mt-1 text-[0.66rem] font-extrabold text-[var(--color-ink)]">
                {formatAmount(transaction.balanceAfter)} {transaction.currency}
              </dd>
            </div>
          </dl>

          <div className="mt-3 flex flex-col gap-1 text-[0.56rem] font-semibold text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
            <span>{formatDate(transaction.createdAt)}</span>
            <span className="max-w-full truncate font-mono">
              Ref: {transaction.reference}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function TransactionRow({ transaction }: { transaction: ClientTransaction }) {
  const isCredit = transaction.direction === "credit";
  const Icon = isCredit ? ArrowDownLeft : ArrowUpRight;

  return (
    <tr className="border-t border-[var(--color-border)] align-top first:border-t-0">
      <td className="px-4 py-4">
        <div className="flex items-start gap-3">
          <span
            className={`grid size-9 shrink-0 place-items-center rounded-xl ${
              isCredit
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            <Icon size={17} weight="bold" />
          </span>
          <div>
            <span
              className={`inline-flex rounded-full px-2 py-1 text-[0.55rem] font-extrabold uppercase ${typeClasses(transaction.type)}`}
            >
              {typeLabels[transaction.type]}
            </span>
            <p className="mt-1.5 max-w-56 text-xs font-bold text-[var(--color-ink)]">
              {transaction.description}
            </p>
            <p className="mt-1 max-w-52 truncate font-mono text-[0.55rem] text-[var(--color-text-muted)]">
              Ref: {transaction.reference}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex max-w-64 items-center gap-2 text-xs font-bold text-[var(--color-ink-soft)]">
          <span>{transaction.source}</span>
          <ArrowRight className="shrink-0 text-[var(--color-text-muted)]" size={15} />
          <span>{transaction.destination}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <strong className={`text-sm ${isCredit ? "text-emerald-700" : "text-rose-700"}`}>
          {isCredit ? "+" : "−"}
          {formatAmount(transaction.amount)} {transaction.currency}
        </strong>
        {transaction.amountUsd && (
          <p className="mt-1 text-[0.58rem] font-semibold text-[var(--color-text-muted)]">
            ${Number(transaction.amountUsd).toFixed(2)} USD
          </p>
        )}
      </td>
      <td className="px-4 py-4 text-xs font-bold text-[var(--color-ink-soft)]">
        {formatAmount(transaction.balanceBefore)}
        <ArrowRight className="mx-2 inline text-[var(--color-text-muted)]" size={14} />
        {formatAmount(transaction.balanceAfter)} {transaction.currency}
      </td>
      <td className="px-4 py-4 text-xs font-semibold whitespace-nowrap text-[var(--color-text-muted)]">
        {formatDate(transaction.createdAt)}
      </td>
    </tr>
  );
}
