"use client";

import {
  Check,
  CheckCircle,
  Copy,
  PencilSimple,
  Plus,
  SpinnerGap,
  Star,
  Trash,
  Wallet,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

import { CustomSelect, type SelectOption } from "@/components/ui/custom-select";
import type { ClientWalletPaymentMethod } from "@/lib/api/types";
import {
  deleteClientWallet,
  saveClientWallet,
  type ClientWalletPayload,
} from "@/services/client-wallet.service";

const assetOptions: readonly SelectOption[] = [
  { label: "Bitcoin (BTC)", value: "BTC" },
  { label: "Ethereum (ETH)", value: "ETH" },
  { label: "Solana (SOL)", value: "SOL" },
  { label: "BNB (BNB)", value: "BNB" },
  { label: "Tether (USDT)", value: "USDT" },
];
const networksByAsset: Record<string, readonly SelectOption[]> = {
  BTC: [{ label: "Bitcoin", value: "Bitcoin" }],
  ETH: [{ label: "Ethereum (ERC20)", value: "Ethereum" }],
  SOL: [{ label: "Solana", value: "Solana" }],
  BNB: [{ label: "BNB Smart Chain (BEP20)", value: "BNB Smart Chain" }],
  USDT: [
    { label: "Tron (TRC20)", value: "TRC20" },
    { label: "Ethereum (ERC20)", value: "ERC20" },
    { label: "BNB Smart Chain (BEP20)", value: "BEP20" },
  ],
};

type FormState = ClientWalletPayload;

const emptyForm: FormState = {
  asset: "",
  isDefault: false,
  label: "",
  network: "",
  walletAddress: "",
};

function getInitials(asset: string) {
  return asset.slice(0, 3).toUpperCase();
}

export function ClientPaymentMethods({
  initialMethods,
}: {
  initialMethods: ClientWalletPaymentMethod[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEditId = searchParams.get("edit");
  const initialEditingMethod = initialMethods.find(
    (method) => method.id === initialEditId,
  );
  const [methods, setMethods] = useState(initialMethods);
  const [form, setForm] = useState<FormState>(() =>
    initialEditingMethod
      ? {
          asset: initialEditingMethod.asset,
          isDefault: initialEditingMethod.isDefault,
          label: initialEditingMethod.label,
          network: initialEditingMethod.network,
          walletAddress: initialEditingMethod.walletAddress,
        }
      : emptyForm,
  );
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const editId = searchParams.get("edit");
  const isAdding = searchParams.get("action") === "add";
  const editingMethod = useMemo(
    () => methods.find((method) => method.id === editId) ?? null,
    [editId, methods],
  );
  const isOpen = isAdding || Boolean(editingMethod);
  const networkOptions = networksByAsset[form.asset] ?? [];

  function changeRoute(parameters: Record<string, string> = {}) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("edit");
    Object.entries(parameters).forEach(([key, value]) => params.set(key, value));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function updateForm<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openAddForm() {
    setForm(emptyForm);
    setError("");
    setMessage("");
    changeRoute({ action: "add" });
  }

  function openEditForm(method: ClientWalletPaymentMethod) {
    setForm({
      asset: method.asset,
      isDefault: method.isDefault,
      label: method.label,
      network: method.network,
      walletAddress: method.walletAddress,
    });
    setError("");
    setMessage("");
    changeRoute({ edit: method.id });
  }

  function selectAsset(asset: string) {
    const networks = networksByAsset[asset] ?? [];
    setForm((current) => ({
      ...current,
      asset,
      network: networks.length === 1 ? networks[0].value : "",
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.asset || !form.network || !form.label.trim() || !form.walletAddress.trim()) {
      setError("Complete the asset, network, wallet label, and wallet address.");
      return;
    }
    setIsSaving(true);
    try {
      const saved = await saveClientWallet(
        {
          ...form,
          label: form.label.trim(),
          walletAddress: form.walletAddress.trim(),
        },
        editingMethod?.id,
      );

      setMethods((current) => {
        const next = current.some((method) => method.id === saved.id)
          ? current.map((method) => (method.id === saved.id ? saved : method))
          : [saved, ...current];
        return saved.isDefault
          ? next.map((method) => ({ ...method, isDefault: method.id === saved.id }))
          : next;
      });
      setMessage(editingMethod ? "Payment method updated." : "Payment method added.");
      router.refresh();
      window.setTimeout(() => changeRoute(), 450);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The payment method could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(methodId: string) {
    setDeletingId(methodId);
    setError("");
    try {
      await deleteClientWallet(methodId);
      setMethods((current) => current.filter((method) => method.id !== methodId));
      setConfirmDeleteId(null);
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "The payment method could not be deleted.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function copyAddress(address: string) {
    await navigator.clipboard.writeText(address);
    setMessage("Wallet address copied.");
    window.setTimeout(() => setMessage(""), 1800);
  }

  return (
    <>
      <section className="rounded-[1.5rem] border border-[var(--color-border)] bg-white p-4 shadow-[0_18px_55px_rgba(18,45,72,0.055)] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-extrabold text-[var(--color-ink)]">Your crypto wallets</p>
            <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">
              {methods.length} saved {methods.length === 1 ? "wallet" : "wallets"}
            </p>
          </div>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-4 text-xs font-extrabold text-white transition hover:bg-[var(--color-brand-hover)]"
            onClick={openAddForm}
            type="button"
          >
            <Plus size={17} weight="bold" /> Add payment method
          </button>
        </div>
      </section>

      {error && !isOpen && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#fff1ed] p-4 text-xs font-bold text-[#b94f32]">
          <WarningCircle size={18} /> {error}
        </div>
      )}
      {message && !isOpen && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--color-brand-soft)] p-4 text-xs font-bold text-[var(--color-brand-hover)]">
          <CheckCircle size={18} weight="fill" /> {message}
        </div>
      )}

      {methods.length === 0 ? (
        <section className="mt-5 grid min-h-72 place-items-center rounded-[1.5rem] border border-dashed border-[var(--color-border)] bg-white p-8 text-center">
          <div>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
              <Wallet size={25} weight="duotone" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold text-[var(--color-ink)]">No wallets saved</h2>
            <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">
              Add your first crypto wallet address for future withdrawals.
            </p>
          </div>
        </section>
      ) : (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {methods.map((method) => (
            <article
              className="rounded-[1.5rem] border border-[var(--color-border)] bg-white p-4 shadow-[0_16px_45px_rgba(18,45,72,0.05)] sm:p-5"
              key={method.id}
            >
              <div className="flex items-start gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--color-ink)] text-xs font-black text-[#67e4a7]">
                  {getInitials(method.asset)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-base font-extrabold text-[var(--color-ink)]">
                      {method.label}
                    </h2>
                    {method.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand-soft)] px-2 py-1 text-[0.62rem] font-extrabold text-[var(--color-brand-hover)] uppercase">
                        <Star size={11} weight="fill" /> Default
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs font-bold text-[var(--color-text-muted)]">
                    {method.asset} · {method.network}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#f4f8f6] p-3">
                <p className="min-w-0 flex-1 truncate font-mono text-xs font-bold text-[var(--color-ink-soft)]">
                  {method.walletAddress}
                </p>
                <button
                  aria-label="Copy wallet address"
                  className="grid size-9 shrink-0 place-items-center rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-ink)]"
                  onClick={() => void copyAddress(method.walletAddress)}
                  type="button"
                >
                  <Copy size={16} />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 border-t border-[var(--color-border)] pt-4">
                {confirmDeleteId === method.id ? (
                  <>
                    <span className="mr-auto text-xs font-bold text-[#b94f32]">Delete this wallet?</span>
                    <button
                      className="min-h-9 rounded-lg px-3 text-xs font-extrabold text-[var(--color-text-muted)]"
                      onClick={() => setConfirmDeleteId(null)}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#b94f32] px-3 text-xs font-extrabold text-white"
                      disabled={deletingId === method.id}
                      onClick={() => void handleDelete(method.id)}
                      type="button"
                    >
                      {deletingId === method.id && <SpinnerGap className="animate-spin" size={15} />}
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[var(--color-border)] px-3 text-xs font-extrabold text-[var(--color-ink)]"
                      onClick={() => openEditForm(method)}
                      type="button"
                    >
                      <PencilSimple size={15} /> Edit
                    </button>
                    <button
                      aria-label={`Delete ${method.label}`}
                      className="grid size-9 place-items-center rounded-lg border border-[#f2c6bb] text-[#b94f32]"
                      onClick={() => setConfirmDeleteId(method.id)}
                      type="button"
                    >
                      <Trash size={16} />
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#031a3b]/55 p-3 backdrop-blur-sm sm:p-6">
          <section
            aria-labelledby="wallet-form-title"
            aria-modal="true"
            className="my-auto w-full max-w-2xl overflow-hidden rounded-[1.5rem] bg-[#f4f8f6] shadow-[0_35px_100px_rgba(3,26,59,0.3)]"
            role="dialog"
          >
            <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-[0.6rem] font-extrabold tracking-[0.16em] text-[var(--color-brand-hover)] uppercase">
                  Personal crypto wallet
                </p>
                <h2 className="mt-1 text-lg font-extrabold text-[var(--color-ink)]" id="wallet-form-title">
                  {editingMethod ? "Edit payment method" : "Add payment method"}
                </h2>
              </div>
              <button
                aria-label="Close"
                className="grid size-10 place-items-center rounded-xl border border-[var(--color-border)] text-[var(--color-ink)]"
                disabled={isSaving}
                onClick={() => changeRoute()}
                type="button"
              >
                <X size={20} />
              </button>
            </header>

            <form className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5 sm:p-6" onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-[#fff1ed] p-3 text-xs font-bold text-[#b94f32]">
                  <WarningCircle className="shrink-0" size={18} /> {error}
                </div>
              )}
              {message && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-[var(--color-brand-soft)] p-3 text-xs font-bold text-[var(--color-brand-hover)]">
                  <CheckCircle size={18} weight="fill" /> {message}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <CustomSelect
                  id="wallet-asset"
                  label="Cryptocurrency"
                  onChange={selectAsset}
                  options={assetOptions}
                  placeholder="Select asset"
                  value={form.asset}
                />
                <CustomSelect
                  id="wallet-network"
                  label="Network"
                  onChange={(value) => updateForm("network", value)}
                  options={networkOptions}
                  placeholder={form.asset ? "Select network" : "Select asset first"}
                  value={form.network}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-extrabold text-[var(--color-ink)]">
                  Wallet label
                  <input
                    className="mt-2.5 h-13 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] px-4 text-sm font-bold outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10"
                    maxLength={80}
                    onChange={(event) => updateForm("label", event.target.value)}
                    placeholder="Example: My Binance wallet"
                    value={form.label}
                  />
                </label>
                <label className="text-sm font-extrabold text-[var(--color-ink)]">
                  Wallet address
                  <input
                    className="mt-2.5 h-13 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] px-4 font-mono text-xs font-bold outline-none focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10"
                    maxLength={200}
                    onChange={(event) => updateForm("walletAddress", event.target.value)}
                    placeholder="Paste your wallet address"
                    value={form.walletAddress}
                  />
                </label>
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--color-border)] bg-white p-4">
                <button
                  aria-checked={form.isDefault}
                  className={`grid size-5 shrink-0 place-items-center rounded border ${
                    form.isDefault
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-white"
                      : "border-[var(--color-border)] bg-white"
                  }`}
                  onClick={() => updateForm("isDefault", !form.isDefault)}
                  role="checkbox"
                  type="button"
                >
                  {form.isDefault && <Check size={13} weight="bold" />}
                </button>
                <span>
                  <strong className="block text-xs font-extrabold text-[var(--color-ink)]">Use as default wallet</strong>
                  <span className="mt-1 block text-xs font-medium text-[var(--color-text-muted)]">
                    Your first saved wallet is automatically set as default.
                  </span>
                </span>
              </label>

              <button
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-extrabold text-white transition hover:bg-[var(--color-brand-hover)] disabled:cursor-not-allowed disabled:opacity-65"
                disabled={isSaving}
                type="submit"
              >
                {isSaving ? <SpinnerGap className="animate-spin" size={19} /> : <Wallet size={19} weight="duotone" />}
                {isSaving ? "Saving payment method..." : editingMethod ? "Save changes" : "Add payment method"}
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
