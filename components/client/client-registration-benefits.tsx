import {
  Calculator,
  ChartLineUp,
  CheckCircle,
  ClipboardText,
  Headset,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

const benefits = [
  { icon: ClipboardText, label: "Six clearly structured investment plans" },
  { icon: Calculator, label: "Transparent daily-profit calculations" },
  { icon: ChartLineUp, label: "Access to multiple market categories" },
  { icon: CheckCircle, label: "Clear duration and risk information" },
  { icon: ShieldCheck, label: "Account and activity visibility" },
  { icon: Headset, label: "Support when you need guidance" },
] as const;

export function ClientRegistrationBenefits() {
  return (
    <aside className="relative order-2 overflow-hidden rounded-[2rem] bg-[var(--color-ink)] p-6 text-white shadow-[0_30px_80px_rgba(3,26,59,0.18)] sm:p-9 lg:order-1 lg:sticky lg:top-8 lg:p-11">
      <div aria-hidden="true" className="absolute -top-36 -right-28 size-80 rounded-full bg-[var(--color-brand)]/25 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-48 -left-40 size-96 rounded-full bg-[#2f75ff]/12 blur-3xl" />

      <div className="relative">
        <p className="text-xs font-extrabold tracking-[0.2em] text-[#67e4a7] uppercase">
          Open Your Account
        </p>
        <h1 className="mt-5 max-w-[12ch] text-[clamp(2.15rem,4vw,3.9rem)] leading-[1.08] font-extrabold tracking-[-0.05em]">
          Start your investment journey with greater clarity.
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-7 font-medium text-white/62 sm:text-base">
          Create your TradeUply profile, understand the available plans, and review
          projected outcomes through one straightforward experience.
        </p>

        <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {benefits.map(({ icon: Icon, label }) => (
            <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-3.5" key={label}>
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#67e4a7]/10 text-[#67e4a7]">
                <Icon aria-hidden="true" size={21} weight="duotone" />
              </span>
              <span className="text-xs leading-5 font-bold text-white/76">{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex items-start gap-3 border-t border-white/10 pt-7">
          <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-[#67e4a7]" size={24} weight="duotone" />
          <p className="text-xs leading-6 font-medium text-white/48">
            Eligibility, identity verification, and regional availability may apply.
            Creating an account does not guarantee investment returns.
          </p>
        </div>
      </div>
    </aside>
  );
}
