import {
  ArrowRight,
  Bank,
  Buildings,
  ChartBar,
  ChartDonut,
  CheckCircle,
  CurrencyBtc,
  CurrencyCircleDollar,
  Package,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/ui/container";
import { formatUsd, investmentPlanTerms } from "@/data/investment-plans";

const investmentPrinciples = [
  {
    description: "Strategies can draw from multiple global asset classes instead of relying on one market.",
    title: "Diversified market exposure",
  },
  {
    description: "Minimum amounts, daily objectives, durations, and risk levels are presented together.",
    title: "Defined plan structure",
  },
  {
    description: "See how an investment amount becomes daily and total projected profit before proceeding.",
    title: "Transparent projections",
  },
  {
    description: "Clear disclosures keep potential returns and capital risk visible throughout the journey.",
    title: "Risk-aware decisions",
  },
] as const;

const strategyMarkets = [
  { icon: Buildings, label: "Stocks" },
  { icon: CurrencyCircleDollar, label: "Forex" },
  { icon: Package, label: "Commodities" },
  { icon: ChartBar, label: "Indices" },
  { icon: CurrencyBtc, label: "Digital assets" },
  { icon: Bank, label: "ETFs" },
] as const;

const minimumInvestment = Math.min(...investmentPlanTerms.map((plan) => plan.minimum));
const minimumTerm = Math.min(...investmentPlanTerms.map((plan) => plan.horizonDays));
const maximumTerm = Math.max(...investmentPlanTerms.map((plan) => plan.horizonDays));

const platformFacts = [
  { label: "Investment plans", value: String(investmentPlanTerms.length) },
  { label: "Minimum starting amount", value: formatUsd(minimumInvestment) },
  { label: "Plan durations", value: `${minimumTerm}–${maximumTerm} days` },
  { label: "Market categories", value: String(strategyMarkets.length) },
] as const;

export function InvestmentApproach() {
  return (
    <section
      aria-labelledby="approach-title"
      className="relative scroll-mt-28 overflow-hidden bg-[#f4f8f6] py-20 sm:py-24 lg:py-32"
      id="investment-approach"
    >
      <div
        aria-hidden="true"
        className="absolute -top-52 -right-52 size-[32rem] rounded-full bg-[var(--color-brand)]/[0.055] blur-3xl"
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.94fr_1.06fr] lg:gap-20">
          <div>
            <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">
              Our Investment Approach
            </p>
            <h2
              className="mt-5 max-w-[15ch] text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]"
              id="approach-title"
            >
              Financial discipline behind every investment plan.
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-[length:var(--text-body-lg)] leading-[1.75] font-medium text-[var(--color-text-muted)]">
              TradeUply combines diversified market exposure, clearly defined plan
              terms, transparent calculations, and structured risk awareness to create
              a more understandable investment experience.
            </p>

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {investmentPrinciples.map(({ description, title }) => (
                <article className="border-l-2 border-[var(--color-brand)] pl-4" key={title}>
                  <h3 className="text-sm font-extrabold text-[var(--color-ink)]">{title}</h3>
                  <p className="mt-2 text-xs leading-5 font-medium text-[var(--color-text-muted)]">
                    {description}
                  </p>
                </article>
              ))}
            </div>

            <a
              className="mt-10 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(6,184,102,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)] sm:w-auto"
              href="#plans"
            >
              Compare Investment Plans
              <ArrowRight aria-hidden="true" size={17} weight="bold" />
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-[41rem] overflow-hidden rounded-[2.25rem] bg-[var(--color-ink)] p-5 shadow-[0_34px_90px_rgba(3,26,59,0.19)] sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -top-32 -right-24 size-80 rounded-full bg-[var(--color-brand)]/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-44 -left-40 size-96 rounded-full bg-[#2f75ff]/10 blur-3xl"
            />

            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">
                  Portfolio framework
                </p>
                <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-white sm:text-2xl">
                  One strategy view. Multiple markets.
                </h3>
              </div>
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.07] text-[#67e4a7]">
                <ChartDonut aria-hidden="true" size={27} weight="duotone" />
              </span>
            </div>

            <div className="relative mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-4 sm:p-6">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] [background-size:32px_32px]"
              />

              <div className="relative flex items-center gap-4 rounded-2xl border border-[#67e4a7]/20 bg-[#67e4a7]/[0.075] p-4 sm:p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#67e4a7]/10 text-[#67e4a7]">
                  <ShieldCheck aria-hidden="true" size={24} weight="duotone" />
                </span>
                <div>
                  <p className="text-[0.66rem] font-extrabold tracking-[0.1em] text-white/45 uppercase">
                    Strategy foundation
                  </p>
                  <p className="mt-1 text-sm leading-5 font-extrabold text-white sm:text-base">
                    Diversification · Defined terms · Clear reporting
                  </p>
                </div>
              </div>

              <div className="relative mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {strategyMarkets.map(({ icon: Icon, label }) => (
                  <div
                    className="rounded-2xl border border-white/10 bg-[#0b294e]/75 p-4 transition hover:border-[#67e4a7]/30 hover:bg-[#10335e]"
                    key={label}
                  >
                    <Icon aria-hidden="true" className="text-[#67e4a7]" size={23} weight="duotone" />
                    <p className="mt-3 text-xs font-extrabold text-white/80">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="relative mt-5 flex items-start gap-2.5 text-xs leading-5 font-semibold text-white/50">
              <CheckCircle aria-hidden="true" className="mt-0.5 shrink-0 text-[#67e4a7]" size={17} weight="fill" />
              Market coverage communicates strategic breadth, not a guaranteed allocation
              or return for every plan.
            </p>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-white shadow-[0_18px_55px_rgba(18,45,72,0.055)] lg:mt-20 lg:grid-cols-4">
          {platformFacts.map(({ label, value }, index) => (
            <div
              className={`px-5 py-7 text-center sm:px-7 sm:py-8 ${
                index % 2 !== 0 ? "border-l border-[var(--color-border)]" : ""
              } ${index >= 2 ? "border-t border-[var(--color-border)] lg:border-t-0" : ""} ${
                index === 2 ? "lg:border-l" : ""
              }`}
              key={label}
            >
              <dd className="text-[clamp(1.45rem,2.4vw,2.2rem)] font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
                {value}
              </dd>
              <dt className="mt-2 text-[0.68rem] leading-5 font-extrabold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">
                {label}
              </dt>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-[1.75rem] border border-[var(--color-border)] bg-white p-6 sm:flex-row sm:items-center sm:p-8 lg:px-10">
          <div>
            <h3 className="text-xl font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">
              Choose a plan with clarity.
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 font-medium text-[var(--color-text-muted)]">
              Compare objectives, durations, minimum amounts, and projected outcomes
              before making a decision.
            </p>
          </div>
          <a
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-5 text-sm font-extrabold text-[var(--color-ink)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand-hover)] sm:w-auto"
            href="#profit-calculator"
          >
            Calculate Your Profit
            <ArrowRight aria-hidden="true" size={17} weight="bold" />
          </a>
        </div>
      </Container>
    </section>
  );
}
