import {
  ArrowRight,
  ChartDonut,
  Check,
  Coins,
  Globe,
  Leaf,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/ui/container";
import { formatUsd, investmentPlanTerms } from "@/data/investment-plans";

const investmentPlanDetails = [
  {
    allocation: "Cash reserves · Short-term bonds",
    description: "A measured starting point focused on stability and lower volatility.",
    features: ["Diversified defensive assets", "Quarterly portfolio review", "Simple performance reporting"],
    id: "essential",
    icon: ShieldCheck,
  },
  {
    allocation: "Government bonds · Dividend assets",
    description: "Designed for investors seeking a steadier approach with an income focus.",
    features: ["Income-oriented allocation", "Risk-aware diversification", "Quarterly portfolio review"],
    id: "income",
    icon: Coins,
  },
  {
    allocation: "Global equities · Bonds · Cash",
    badge: "Most popular",
    description: "A diversified mix created to balance long-term growth and portfolio stability.",
    features: ["Multi-asset diversification", "Monthly portfolio review", "Automatic rebalancing"],
    id: "balanced",
    icon: ChartDonut,
  },
  {
    allocation: "International equities · Market themes",
    description: "Broader exposure to established companies and growing sectors worldwide.",
    features: ["Global market allocation", "Growth-focused strategy", "Monthly portfolio review"],
    id: "global-growth",
    icon: Globe,
  },
  {
    allocation: "Technology · Innovation · Digital assets",
    description: "A higher-volatility strategy focused on innovation-led markets and emerging themes.",
    features: ["Innovation-led exposure", "Defined allocation limits", "Active risk monitoring"],
    id: "future-focus",
    icon: Sparkle,
  },
  {
    allocation: "Personalized multi-asset portfolio",
    description: "A tailored investment approach for larger portfolios with individualized allocation and review.",
    features: ["Personalized asset mix", "Dedicated portfolio reviews", "Priority client support"],
    id: "wealth-select",
    icon: Leaf,
  },
] as const;

const investmentPlans = investmentPlanDetails.map((details) => ({
  ...details,
  ...investmentPlanTerms.find((terms) => terms.id === details.id)!,
}));

export function InvestmentPlans() {
  return (
    <section
      aria-labelledby="plans-title"
      className="scroll-mt-28 bg-white py-20 sm:py-24 lg:py-32"
      id="plans"
    >
      <Container>
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">
            Investment Plans
          </p>
          <h2
            className="mt-5 text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]"
            id="plans-title"
          >
            A clearer plan for every investment goal.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[length:var(--text-body-lg)] leading-[1.75] font-medium text-[var(--color-text-muted)]">
            Compare six diversified strategies by minimum investment, time horizon,
            risk level, and objective—so you can understand the differences before
            making a decision.
          </p>
        </header>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {investmentPlans.map((plan) => {
            const Icon = plan.icon;
            const isFeatured = "badge" in plan;

            return (
              <article
                className={`relative flex min-h-full flex-col overflow-hidden rounded-[1.8rem] border p-6 transition duration-300 hover:-translate-y-1 sm:p-8 ${isFeatured
                    ? "border-[var(--color-brand)] bg-[var(--color-ink)] text-white shadow-[0_26px_70px_rgba(3,26,59,0.18)]"
                    : "border-[var(--color-border)] bg-[#f8faf9] text-[var(--color-ink)] shadow-[0_16px_50px_rgba(18,45,72,0.05)] hover:shadow-[0_24px_60px_rgba(18,45,72,0.1)]"
                  }`}
                key={plan.name}
              >
                {isFeatured && (
                  <span className="absolute top-0 right-7 rounded-b-xl bg-[var(--color-brand)] px-4 py-2 text-[0.67rem] font-extrabold tracking-[0.12em] text-white uppercase">
                    {plan.badge}
                  </span>
                )}

                <div className="flex items-center gap-4">
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-2xl ${isFeatured
                        ? "bg-white/10 text-[#62e6a4]"
                        : "bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"
                      }`}
                  >
                    <Icon aria-hidden="true" size={25} weight="duotone" />
                  </span>
                  <div>
                    <p className={`text-xs font-bold ${isFeatured ? "text-white/55" : "text-[var(--color-text-muted)]"}`}>
                      Starting from {formatUsd(plan.minimum)}
                    </p>
                    <h3 className="mt-1 text-xl font-extrabold tracking-[-0.03em]">{plan.name}</h3>
                  </div>
                </div>

                <p className={`mt-6 min-h-[3.25rem] text-sm leading-6 font-medium ${isFeatured ? "text-white/70" : "text-[var(--color-text-muted)]"}`}>
                  {plan.description}
                </p>

                <dl className={`mt-6 grid grid-cols-3 divide-x rounded-2xl p-4 text-center ${isFeatured ? "divide-white/10 bg-white/[0.07]" : "divide-slate-200 bg-white"}`}>
                  <div className="px-1">
                    <dt className={`text-[0.64rem] font-extrabold tracking-[0.08em] uppercase ${isFeatured ? "text-white/45" : "text-[var(--color-text-muted)]"}`}>
                      Daily objective
                    </dt>
                    <dd className={`mt-2 text-sm font-extrabold ${isFeatured ? "text-[#62e6a4]" : "text-[var(--color-brand-hover)]"}`}>
                      {plan.objective}%
                    </dd>
                  </div>
                  <div className="px-1">
                    <dt className={`text-[0.64rem] font-extrabold tracking-[0.08em] uppercase ${isFeatured ? "text-white/45" : "text-[var(--color-text-muted)]"}`}>
                      Horizon
                    </dt>
                    <dd className="mt-2 text-sm font-extrabold">{plan.horizonDays} days</dd>
                  </div>
                  <div className="px-1">
                    <dt className={`text-[0.64rem] font-extrabold tracking-[0.08em] uppercase ${isFeatured ? "text-white/45" : "text-[var(--color-text-muted)]"}`}>
                      Risk
                    </dt>
                    <dd className="mt-2 text-sm font-extrabold">{plan.risk}</dd>
                  </div>
                </dl>

                <p className={`mt-5 text-xs leading-5 font-bold ${isFeatured ? "text-white/60" : "text-[var(--color-text-muted)]"}`}>
                  Strategy mix: <span className={isFeatured ? "text-white/85" : "text-[var(--color-ink-soft)]"}>{plan.allocation}</span>
                </p>

                <ul className={`mt-6 grid gap-3 border-t pt-6 text-sm font-bold ${isFeatured ? "border-white/10 text-white/75" : "border-slate-200 text-[var(--color-ink-soft)]"}`}>
                  {plan.features.map((feature) => (
                    <li className="flex items-start gap-3" key={feature}>
                      <Check aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--color-brand)]" size={17} weight="bold" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  className={`mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold transition hover:-translate-y-0.5 ${isFeatured
                      ? "bg-[var(--color-brand)] text-white hover:bg-[#08c971]"
                      : "border border-[var(--color-border)] bg-white text-[var(--color-ink)] hover:border-[var(--color-brand)]"
                    }`}
                  href="/register"
                >
                  Choose {plan.name}
                  <ArrowRight aria-hidden="true" size={17} weight="bold" />
                </a>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
