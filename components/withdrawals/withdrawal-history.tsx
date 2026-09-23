import type { Withdrawal } from "@/lib/api/types";

export function WithdrawalHistory({ withdrawals }: { withdrawals: Withdrawal[] }) {
  if (!withdrawals.length) return null;
  return <section className="mt-6 rounded-[1.6rem] border border-[var(--color-border)] bg-white p-5 shadow-[0_18px_55px_rgba(18,45,72,0.06)] sm:p-6">
    <p className="text-xs font-extrabold tracking-[0.15em] text-[var(--color-brand-hover)] uppercase">Withdrawal activity</p>
    <h2 className="mt-2 text-xl font-extrabold text-[var(--color-ink)]">Your withdrawal requests</h2>
    <div className="mt-4 divide-y divide-[var(--color-border)]">
      {withdrawals.slice(0, 5).map((item) => <div className="flex flex-wrap items-center justify-between gap-3 py-4" key={item.id}><div><p className="text-sm font-extrabold text-[var(--color-ink)]">{item.amount} {item.asset}</p><p className="mt-1 text-xs font-semibold text-[var(--color-text-muted)]">To {item.destinationLabel} · {item.destinationNetwork}</p></div><span className={`rounded-full px-3 py-1.5 text-[0.65rem] font-extrabold capitalize ${item.status === "approved" ? "bg-[#e8f8ef] text-[#008d4d]" : item.status === "rejected" ? "bg-[#fff0ec] text-[#b74c39]" : "bg-[#fff6df] text-[#946515]"}`}>{item.status}</span></div>)}
    </div>
  </section>;
}
