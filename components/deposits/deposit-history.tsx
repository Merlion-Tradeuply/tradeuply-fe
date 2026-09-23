"use client";

import { CaretRight, ClockCounterClockwise, X } from "@phosphor-icons/react";
import { useState } from "react";

import type { Deposit } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const statusStyles = {
  approved: "bg-[#e8f8ef] text-[#008d4d]",
  pending: "bg-[#fff6df] text-[#946515]",
  rejected: "bg-[#fff0ec] text-[#b74c39]",
};

function activityLabel(event: string) {
  return event.replaceAll("_", " ");
}

export function DepositHistory({ deposits }: { deposits: Deposit[] }) {
  const [selected, setSelected] = useState<Deposit | null>(null);

  async function showDetails(deposit: Deposit) {
    const response = await fetch(`/api/client/deposits/${deposit.id}`);

    if (response.ok) {
      const result = (await response.json()) as { data: { deposit: Deposit } };
      setSelected(result.data.deposit);
      return;
    }

    setSelected(deposit);
  }

  return (
    <section className="mt-6 min-w-0 overflow-hidden rounded-[1.3rem] border border-[var(--color-border)] bg-white p-4 shadow-[0_18px_55px_rgba(18,45,72,0.07)] sm:mt-7 sm:rounded-[1.6rem] sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--color-brand-hover)] uppercase">Deposit activity</p>
          <h2 className="mt-2 text-xl font-extrabold text-[var(--color-ink)]">Your deposit history</h2>
        </div>
        <ClockCounterClockwise className="text-[var(--color-brand-hover)]" size={27} weight="duotone" />
      </div>

      {deposits.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-[#f5f8f7] p-5 text-sm font-semibold text-[var(--color-text-muted)]">No deposits have been submitted yet.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--color-border)]">
          {deposits.map((deposit) => (
            <button
              className="flex min-w-0 w-full items-center justify-between gap-3 border-b border-[var(--color-border)] p-3 text-left transition last:border-0 hover:bg-[#f8faf9] sm:gap-4 sm:p-5"
              key={deposit.id}
              onClick={() => showDetails(deposit)}
              type="button"
            >
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-[var(--color-ink)]">{deposit.asset === "INR" ? `₹${Number(deposit.amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : `${deposit.amount} ${deposit.asset}`}</span>
                <span className="mt-1 block truncate text-xs font-semibold text-[var(--color-text-muted)]">{deposit.transactionHash}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2 sm:gap-3">
                <span className={cn("rounded-full px-3 py-1.5 text-[0.65rem] font-extrabold capitalize", statusStyles[deposit.status])}>{deposit.status}</span>
                <CaretRight size={16} weight="bold" />
              </span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[var(--color-ink)]/45 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <button aria-label="Close deposit activity" className="absolute inset-0" onClick={() => setSelected(null)} type="button" />
          <section className="relative max-h-[94dvh] w-full min-w-0 max-w-xl overflow-y-auto rounded-t-[1.5rem] bg-white p-4 shadow-2xl sm:max-h-[88vh] sm:rounded-[2rem] sm:p-8">
            <button aria-label="Close" className="absolute top-5 right-5 grid size-10 place-items-center rounded-xl bg-slate-100" onClick={() => setSelected(null)} type="button"><X size={19} weight="bold" /></button>
            <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--color-brand-hover)] uppercase">Transaction activity</p>
            <h3 className="mt-2 text-xl font-extrabold text-[var(--color-ink)]">{selected.asset === "INR" ? `₹${Number(selected.amount).toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : `${selected.amount} ${selected.asset}`}</h3>
            <p className="mt-2 break-all text-xs font-semibold text-[var(--color-text-muted)]">{selected.transactionHash}</p>
            {selected.convertedAsset && selected.convertedAmount && (
              <div className="mt-4 rounded-xl bg-[var(--color-brand-soft)] p-4">
                <p className="text-[0.6rem] font-extrabold tracking-[0.08em] text-[var(--color-brand-hover)] uppercase">Crypto wallet credited</p>
                <p className="mt-1 text-sm font-extrabold text-[var(--color-ink)]">{Number(selected.convertedAmount).toFixed(8)} {selected.convertedAsset}</p>
                {selected.exchangeRate && <p className="mt-1 text-[0.65rem] font-semibold text-[var(--color-text-muted)]">Rate: 1 {selected.asset} = {selected.exchangeRate} {selected.convertedAsset}</p>}
              </div>
            )}
            <ol className="mt-7 space-y-5 border-l border-[var(--color-border)] pl-6">
              {selected.activities.map((activity) => (
                <li className="relative" key={activity.id}>
                  <span className="absolute top-1 -left-[1.82rem] size-3 rounded-full border-2 border-white bg-[var(--color-brand)] shadow" />
                  <p className="text-sm font-extrabold capitalize text-[var(--color-ink)]">{activityLabel(activity.event)}</p>
                  <p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">{activity.actorLabel} · {new Date(activity.createdAt).toLocaleString()}</p>
                  {typeof activity.metadata.notes === "string" && activity.metadata.notes && <p className="mt-2 rounded-xl bg-[#f5f8f7] p-3 text-xs leading-5 font-medium text-[var(--color-ink-soft)]">{activity.metadata.notes}</p>}
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </section>
  );
}
