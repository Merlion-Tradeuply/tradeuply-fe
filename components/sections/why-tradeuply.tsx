import {
  ArrowUpRight,
  ChartLineUp,
  ChartPieSlice,
  GlobeHemisphereWest,
  LightbulbFilament,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

const benefits = [
  {
    description:
      "Explore diverse trading opportunities through one connected platform.",
    icon: GlobeHemisphereWest,
    title: "Global Market Access",
  },
  {
    description:
      "Follow timely market data and identify opportunities with greater clarity.",
    icon: ChartLineUp,
    title: "Real-Time Market Insights",
  },
  {
    description:
      "Use straightforward tools designed to simplify research and decision-making.",
    icon: SlidersHorizontal,
    title: "Intuitive Trading Tools",
  },
  {
    description:
      "Monitor positions, performance, and portfolio activity from one place.",
    icon: Wallet,
    title: "Clear Portfolio Control",
  },
] as const;

const allocations = [
  { colorClass: "bg-[var(--color-brand)]", label: "Global equities", value: "48%", widthClass: "w-[48%]" },
  { colorClass: "bg-[#3b82f6]", label: "FX markets", value: "32%", widthClass: "w-[32%]" },
  { colorClass: "bg-[#8b5cf6]", label: "Digital assets", value: "20%", widthClass: "w-[20%]" },
] as const;

const insightItems = [
  { icon: ChartLineUp, label: "Market trend", value: "Positive" },
  { icon: ShieldCheck, label: "Risk profile", value: "Balanced" },
  { icon: LightbulbFilament, label: "New insights", value: "12 available" },
] as const;

export function WhyTradeUply() {
  return (
    <section
      aria-labelledby="why-tradeuply-title"
      className="scroll-mt-28 bg-[#f4f7f6] py-20 sm:py-24 lg:py-32"
      id="about"
    >
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
          <div className="max-w-[37rem]">
            <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">
              Why TradeUply
            </p>

            <h2
              className="mt-5 text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]"
              id="why-tradeuply-title"
            >
              Trade global markets without the complexity.
            </h2>

            <p className="mt-6 max-w-[35rem] text-pretty text-[length:var(--text-body-lg)] leading-[1.75] font-medium text-[var(--color-text-muted)]">
              Access global market opportunities, follow real-time insights, manage
              your portfolio, and make informed trading decisions through one
              intuitive online trading platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[length:var(--text-small)] font-bold text-[var(--color-ink-soft)]">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck aria-hidden="true" className="text-[var(--color-brand)]" size={21} />
                Clear and secure
              </span>
              <span className="inline-flex items-center gap-2">
                <GlobeHemisphereWest aria-hidden="true" className="text-[var(--color-brand)]" size={21} />
                Built for global access
              </span>
            </div>

            <ButtonLink className="mt-9 min-w-[13rem]" href="#platform-overview">
              Explore the Platform
            </ButtonLink>
          </div>

          <article
            aria-label="TradeUply portfolio overview preview"
            className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white p-4 shadow-[0_28px_80px_rgba(20,48,75,0.12)] sm:p-6 lg:p-7"
            id="platform-overview"
          >
            <header className="flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--color-brand-soft)]">
                  <Image
                    alt=""
                    aria-hidden="true"
                    className="h-auto w-7"
                    height={853}
                    src="/brand/tradeuply-mark.png"
                    width={977}
                  />
                </span>
                <div>
                  <h3 className="font-extrabold text-[var(--color-ink)]">Portfolio overview</h3>
                  <p className="mt-0.5 text-xs font-semibold text-[var(--color-text-muted)]">
                    Your markets in one clear view
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand-soft)] px-3 py-1.5 text-xs font-extrabold text-[var(--color-brand-hover)]">
                <span aria-hidden="true" className="size-2 rounded-full bg-[var(--color-brand)]" />
                Live overview
              </span>
            </header>

            <div className="grid gap-5 pt-6 sm:grid-cols-[1.08fr_0.92fr]">
              <section className="rounded-2xl bg-[var(--color-ink)] p-5 text-white sm:p-6">
                <p className="text-xs font-bold tracking-[0.14em] text-white/60 uppercase">
                  Total portfolio value
                </p>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                  <p className="text-[clamp(1.75rem,4vw,2.5rem)] leading-none font-extrabold tracking-[-0.05em]">
                    $124,580.42
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-brand)]/15 px-2.5 py-1 text-xs font-extrabold text-[#5ce9a3]">
                    <ArrowUpRight aria-hidden="true" size={14} weight="bold" />
                    12.8%
                  </span>
                </div>

                <div className="mt-8 space-y-4">
                  {allocations.map((allocation) => (
                    <div key={allocation.label}>
                      <div className="flex items-center justify-between gap-4 text-xs font-bold">
                        <span className="text-white/68">{allocation.label}</span>
                        <span>{allocation.value}</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          aria-hidden="true"
                          className={`h-full rounded-full ${allocation.colorClass} ${allocation.widthClass}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-[#f8faf9] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-[0.12em] text-[var(--color-text-muted)] uppercase">
                      Today&apos;s activity
                    </p>
                    <p className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
                      +$1,284.30
                    </p>
                  </div>
                  <span className="grid size-11 place-items-center rounded-xl bg-white text-[var(--color-brand)] shadow-sm">
                    <ChartPieSlice aria-hidden="true" size={24} weight="duotone" />
                  </span>
                </div>

                <div className="mt-7 space-y-3">
                  {insightItems.map(({ icon: Icon, label, value }) => (
                    <div
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                      key={label}
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
                        <Icon aria-hidden="true" size={19} weight="duotone" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.68rem] font-bold tracking-[0.08em] text-[var(--color-text-muted)] uppercase">
                          {label}
                        </p>
                        <p className="truncate text-sm font-extrabold text-[var(--color-ink)]">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </article>
        </div>

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {benefits.map(({ description, icon: Icon, title }) => (
            <li
              className="group rounded-[1.5rem] border border-[var(--color-border)] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(20,48,75,0.1)] sm:p-7"
              key={title}
            >
              <span className="grid size-12 place-items-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)] transition group-hover:bg-[var(--color-brand)] group-hover:text-white">
                <Icon aria-hidden="true" size={25} weight="duotone" />
              </span>
              <h3 className="mt-6 text-[length:var(--text-h3)] leading-tight font-extrabold tracking-[-0.035em] text-[var(--color-ink)]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 font-medium text-[var(--color-text-muted)]">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
