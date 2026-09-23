"use client";

import { ArrowUp, SpinnerGap, WarningCircle, X } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { CustomSelect, type SelectOption } from "@/components/ui/custom-select";
import type { ClientBalance, ClientWalletPaymentMethod, Withdrawal } from "@/lib/api/types";
import { submitWithdrawal } from "@/services/withdrawal.service";

export function WithdrawModal({ balances, methods, onSubmitted }: { balances: ClientBalance[]; methods: ClientWalletPaymentMethod[]; onSubmitted: (withdrawal: Withdrawal) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get("modal") === "withdraw";
  const funded = balances.filter((item) => Number(item.availableBalance) > 0);
  const [asset, setAsset] = useState(funded[0]?.currency ?? "");
  const [methodId, setMethodId] = useState("");
  const [amount, setAmount] = useState(funded[0]?.availableBalance ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const balance = funded.find((item) => item.currency === asset);
  const matchingMethods = useMemo(() => methods.filter((method) => method.asset === asset), [asset, methods]);
  const assetOptions: SelectOption[] = funded.map((item) => ({ label: `${item.currency} · ${item.availableBalance} available`, value: item.currency }));
  const methodOptions: SelectOption[] = matchingMethods.map((method) => ({ label: `${method.label} · ${method.network}`, value: method.id }));

  function close() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
  }
  function changeAsset(value: string) {
    const selectedBalance = funded.find((item) => item.currency === value);
    setAsset(value);
    setMethodId("");
    setAmount(selectedBalance?.availableBalance ?? "");
    setError("");
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!balance || !Number.isFinite(numericAmount) || numericAmount <= 0) return setError("Enter a valid withdrawal amount.");
    if (numericAmount > Number(balance.availableBalance)) return setError(`You can withdraw no more than ${balance.availableBalance} ${asset}.`);
    if (!methodId) return setError(`Select a saved ${asset} wallet.`);
    setSaving(true); setError("");
    try {
      const withdrawal = await submitWithdrawal({ amount: numericAmount, paymentMethodId: methodId, requestId: crypto.randomUUID() });
      onSubmitted(withdrawal);
      setAmount((Number(balance.availableBalance) - numericAmount).toFixed(8).replace(/\.?0+$/, ""));
      close();
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "The withdrawal could not be submitted."); }
    finally { setSaving(false); }
  }

  if (!isOpen) return null;
  return <div className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-[#031a3b]/55 p-0 backdrop-blur-sm sm:grid sm:place-items-center sm:p-6">
    <section aria-modal="true" className="w-full min-w-0 max-w-xl overflow-hidden rounded-t-[1.6rem] bg-[#f4f8f6] shadow-2xl sm:my-auto sm:rounded-[1.6rem]" role="dialog">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-white px-5 py-4 sm:px-6">
        <div><p className="text-[0.62rem] font-extrabold tracking-[0.15em] text-[var(--color-brand-hover)] uppercase">Wallet withdrawal</p><h2 className="mt-1 text-xl font-extrabold text-[var(--color-ink)]">Request withdrawal</h2></div>
        <button aria-label="Close withdrawal" className="grid size-10 place-items-center rounded-xl border border-[var(--color-border)]" disabled={saving} onClick={close} type="button"><X size={19} /></button>
      </header>
      <form className="max-h-[calc(100dvh-5.5rem)] overflow-y-auto p-4 sm:max-h-none sm:p-6" onSubmit={submit}>
        {error && <p className="mb-4 flex items-center gap-2 rounded-xl bg-[#fff0ec] p-3 text-xs font-bold text-[#b74c39]"><WarningCircle size={18} />{error}</p>}
        <CustomSelect id="withdraw-asset" label="Wallet balance" onChange={changeAsset} options={assetOptions} placeholder="Select balance" value={asset} />
        <label className="mt-4 block text-sm font-extrabold text-[var(--color-ink)]">Amount in {asset || "crypto"}<input className="mt-2 h-13 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm font-bold outline-none focus:border-[var(--color-brand)]" inputMode="decimal" max={balance?.availableBalance} min="0.00000001" onChange={(event) => setAmount(event.target.value)} placeholder="0.00000000" step="0.00000001" type="number" value={amount} /></label>
        {balance && <p className="mt-2 text-xs font-semibold text-[var(--color-text-muted)]">Available: {balance.availableBalance} {asset}</p>}
        <div className="mt-4"><CustomSelect id="withdraw-method" label="Destination payment method" onChange={setMethodId} options={methodOptions} placeholder={matchingMethods.length ? `Select ${asset} wallet` : `No ${asset} wallet saved`} value={methodId} /></div>
        <div className="mt-4 rounded-xl border border-[#efd798] bg-[#fff8e8] p-4 text-xs leading-5 font-semibold text-[#7c5915]"><strong className="block">Only send to a matching wallet.</strong>Select a personal {asset} wallet on the correct network. Transfers to a different asset or incompatible network may be permanently lost.</div>
        {matchingMethods.length === 0 && <Link className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-[var(--color-brand)] px-4 text-xs font-extrabold text-[var(--color-brand-hover)]" href="/payment-methods?action=add">Add {asset || "crypto"} payment method</Link>}
        <button className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-extrabold text-white disabled:opacity-50" disabled={saving || !balance || !methodId} type="submit">{saving ? <SpinnerGap className="animate-spin" size={18} /> : <ArrowUp size={18} weight="bold" />}{saving ? "Submitting request..." : "Request Withdrawal"}</button>
      </form>
    </section>
  </div>;
}
