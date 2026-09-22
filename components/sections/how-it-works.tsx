import {
  ArrowRight,
  Calculator,
  ChartLineUp,
  CheckCircle,
  ClipboardText,
  Headset,
  ListChecks,
  LockKey,
  UserPlus,
  Wallet,
} from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/ui/container";

const platformBenefits = [
  { description: "Compare minimum amounts, daily objectives, durations, and risk levels side by side.", icon: ClipboardText, title: "Clear plan choices" },
  { description: "Preview daily profit, total projected profit, and final value before investing.", icon: Calculator, title: "Instant profit calculator" },
  { description: "Move through registration and the required account details in a clear sequence.", icon: UserPlus, title: "Simple account setup" },
  { description: "Keep investments, maturity dates, projected outcomes, and activity in one view.", icon: ChartLineUp, title: "Transparent activity records" },
  { description: "Reach the support team when you need help understanding the platform or a plan.", icon: Headset, title: "Responsive support" },
  { description: "Account access, data handling, and investment terms are structured around clarity.", icon: LockKey, title: "Security-first framework" },
] as const;

const journeySteps = [
  { description: "Set up your TradeUply profile and complete the required account details.", icon: UserPlus, number: "01", title: "Create your account" },
  { description: "Compare plan terms and select an option that fits your intended investment amount.", icon: ListChecks, number: "02", title: "Choose a plan" },
  { description: "Enter your amount, review the complete projection, and confirm the plan conditions.", icon: Wallet, number: "03", title: "Fund your investment" },
  { description: "Follow your plan duration, projected outcome, and investment activity from one place.", icon: ChartLineUp, number: "04", title: "Track your progress" },
] as const;

export function HowItWorks() {
  return (
    <section
      aria-labelledby="partner-title"
      className="relative scroll-mt-28 overflow-hidden bg-[#f4f8f6] py-20 sm:py-24 lg:py-32"
      id="how-it-works"
    >
      <div aria-hidden="true" className="absolute -top-52 -left-52 size-[32rem] rounded-full bg-[var(--color-brand)]/[0.055] blur-3xl" />

      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <header className="lg:sticky lg:top-36">
            <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">
              Your Investment Partner
            </p>
            <h2
              className="mt-5 max-w-[13ch] text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]"
              id="partner-title"
            >
              Support and clarity throughout your investment journey.
            </h2>
            <p className="mt-6 max-w-lg text-pretty text-[length:var(--text-body-lg)] leading-[1.75] font-medium text-[var(--color-text-muted)]">
              From selecting a suitable plan to tracking projected outcomes,
              TradeUply brings the essential tools and information together in one
              straightforward experience.
            </p>
            <a
              className="mt-9 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(6,184,102,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)] sm:w-auto"
              href="/register"
            >
              Create Your Account
              <ArrowRight aria-hidden="true" size={17} weight="bold" />
            </a>
          </header>

          <div className="grid overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-[0_24px_70px_rgba(18,45,72,0.08)] sm:grid-cols-2">
            {platformBenefits.map(({ description, icon: Icon, title }, index) => (
              <article
                className={`group p-6 transition hover:bg-[#f8fbf9] sm:p-7 lg:p-8 ${
                  index % 2 !== 0 ? "sm:border-l sm:border-[var(--color-border)]" : ""
                } ${index >= 2 ? "border-t border-[var(--color-border)]" : index === 1 ? "border-t border-[var(--color-border)] sm:border-t-0" : ""}`}
                key={title}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)] transition group-hover:bg-[var(--color-brand)] group-hover:text-white">
                    <Icon aria-hidden="true" size={25} weight="duotone" />
                  </span>
                  <span className="font-mono text-xs font-bold tracking-[0.12em] text-[#8aa194]">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-lg leading-6 font-extrabold tracking-[-0.025em] text-[var(--color-ink)]">{title}</h3>
                <p className="mt-3 text-sm leading-6 font-medium text-[var(--color-text-muted)]">{description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-[var(--color-border)] pt-16 lg:mt-28 lg:pt-20">
          <div className="grid items-end gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.25em] text-[var(--color-brand-hover)] uppercase">
                Four Simple Steps
              </p>
              <h2 className="mt-4 max-w-[14ch] text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]">
                Start investing with a clearer process.
              </h2>
            </div>
            <p className="max-w-2xl text-pretty text-[length:var(--text-body-lg)] leading-[1.75] font-medium text-[var(--color-text-muted)] lg:justify-self-end">
              Each stage is structured to help you understand the plan, review the
              projection, and know what happens next.
            </p>
          </div>

          <ol className="relative mt-12 grid gap-4 before:pointer-events-none before:absolute before:top-8 before:right-[10%] before:left-[10%] before:hidden before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#a9c7b7] before:to-transparent sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:before:block">
            {journeySteps.map(({ description, icon: Icon, number, title }, index) => (
              <li
                className="group relative flex min-h-[17rem] flex-col rounded-[1.6rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_16px_48px_rgba(18,45,72,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#9cc7af] hover:shadow-[0_22px_58px_rgba(18,45,72,0.09)]"
                key={number}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)] transition group-hover:bg-[var(--color-brand)] group-hover:text-white">
                    <Icon aria-hidden="true" size={24} weight="duotone" />
                  </span>
                  <span className="text-sm font-extrabold tracking-[0.12em] text-[#8aa194]">{number}</span>
                </div>
                <h3 className="mt-6 text-lg font-extrabold tracking-[-0.025em] text-[var(--color-ink)]">{title}</h3>
                <p className="mt-3 text-sm leading-6 font-medium text-[var(--color-text-muted)]">{description}</p>
                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="inline-flex items-center gap-2 text-xs font-extrabold text-[var(--color-ink-soft)]">
                    <CheckCircle aria-hidden="true" className="text-[var(--color-brand)]" size={17} weight="fill" />
                    Step {index + 1} of 4
                  </span>
                  {index < journeySteps.length - 1 && <ArrowRight aria-hidden="true" className="text-[var(--color-brand-hover)]" size={17} weight="bold" />}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-[var(--color-ink)] px-6 py-8 text-white sm:px-9 sm:py-10 lg:mt-10 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-12">
          <div aria-hidden="true" className="absolute -top-28 -right-24 size-72 rounded-full bg-[var(--color-brand)]/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">Ready when you are</p>
            <h2 className="mt-3 text-[length:var(--text-h3)] font-extrabold tracking-[-0.035em]">Begin your investment journey with clarity.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 font-medium text-white/60">Review the available plans and projected outcomes before creating your account.</p>
          </div>
          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:shrink-0">
            <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#08c971]" href="/register">
              Create Your Account
              <ArrowRight aria-hidden="true" size={17} weight="bold" />
            </a>
            <a className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-5 text-sm font-extrabold text-white transition hover:bg-white/10" href="#plans">
              Compare Plans
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
