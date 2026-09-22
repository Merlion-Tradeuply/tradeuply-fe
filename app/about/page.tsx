import {
  ArrowRight,
  Calculator,
  ChartLineUp,
  CheckCircle,
  ClipboardText,
  Eye,
  GlobeHemisphereWest,
  LockKey,
  ShieldCheck,
  UserPlus,
  Wallet,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { ContactOffices } from "@/components/contact/contact-offices";
import { Container } from "@/components/ui/container";
import { formatUsd, investmentPlanTerms } from "@/data/investment-plans";

export const metadata: Metadata = {
  title: "About TradeUply | Clear and Structured Investing",
  description:
    "Learn how TradeUply combines structured investment plans, transparent profit projections, multiple market categories, and clear risk information.",
};

const purposeCards = [
  {
    description: "Minimum amounts, daily objectives, durations, and risk levels are presented together.",
    icon: ClipboardText,
    title: "Clear investment plans",
  },
  {
    description: "See how an investment amount becomes daily profit and total projected value.",
    icon: Calculator,
    title: "Transparent calculations",
  },
  {
    description: "Explore opportunities across six global market categories through one experience.",
    icon: GlobeHemisphereWest,
    title: "Accessible market exposure",
  },
] as const;

const principles = [
  {
    description: "Plan terms and calculations should be understandable before an investor proceeds.",
    icon: Eye,
    title: "Transparency before commitment",
  },
  {
    description: "Simple interfaces should clarify investment risk rather than hide important details.",
    icon: CheckCircle,
    title: "Simplicity without hiding risk",
  },
  {
    description: "Account information should be handled through clear access and privacy controls.",
    icon: LockKey,
    title: "Responsible information handling",
  },
  {
    description: "Investors should have access to guidance throughout their platform experience.",
    icon: ShieldCheck,
    title: "Support throughout the journey",
  },
] as const;

const processSteps = [
  { icon: UserPlus, number: "01", title: "Create account" },
  { icon: ClipboardText, number: "02", title: "Compare plans" },
  { icon: Calculator, number: "03", title: "Review projection" },
  { icon: ChartLineUp, number: "04", title: "Track progress" },
] as const;

const minimumInvestment = Math.min(...investmentPlanTerms.map((plan) => plan.minimum));
const minimumTerm = Math.min(...investmentPlanTerms.map((plan) => plan.horizonDays));
const maximumTerm = Math.max(...investmentPlanTerms.map((plan) => plan.horizonDays));

const platformFacts = [
  { label: "Structured plans", value: String(investmentPlanTerms.length) },
  { label: "Starting amount", value: formatUsd(minimumInvestment) },
  { label: "Plan durations", value: `${minimumTerm}–${maximumTerm} days` },
  { label: "Market categories", value: "6" },
] as const;

export default function AboutPage() {
  return (
    <main className="mt-[7.5rem] min-h-screen bg-white sm:mt-[8.5rem] lg:mt-36">
      <section className="relative overflow-hidden bg-[#f4f8f6] py-16 sm:py-20 lg:py-28">
        <div aria-hidden="true" className="absolute -top-52 -right-44 size-[32rem] rounded-full bg-[var(--color-brand)]/[0.07] blur-3xl" />
        <Container className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">
              About TradeUply
            </p>
            <h1 className="mt-5 max-w-[13ch] text-balance text-[clamp(2.7rem,5.6vw,5.4rem)] leading-[1.02] font-extrabold tracking-[-0.06em] text-[var(--color-ink)]">
              Making investment opportunities clearer and easier to understand.
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-[length:var(--text-body-lg)] leading-[1.8] font-medium text-[var(--color-text-muted)]">
              TradeUply brings structured investment plans, transparent profit
              projections, and access to multiple market categories into one
              straightforward platform experience.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(6,184,102,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)]" href="/#plans">
                Compare Investment Plans
                <ArrowRight aria-hidden="true" size={17} weight="bold" />
              </Link>
              <Link className="inline-flex min-h-13 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-6 text-sm font-extrabold text-[var(--color-ink)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand-hover)]" href="/register">
                Open Your Account
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[40rem] overflow-hidden rounded-[2.25rem] bg-[var(--color-ink)] p-5 shadow-[0_34px_90px_rgba(3,26,59,0.2)] sm:p-8">
            <div aria-hidden="true" className="absolute -top-32 -right-24 size-80 rounded-full bg-[var(--color-brand)]/25 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">Clarity Framework</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-white">Understand the plan before the decision.</h2>
              <div className="mt-8 grid gap-3">
                <FrameworkRow icon={ClipboardText} label="Defined plan terms" text="Amount · Objective · Duration · Risk" />
                <FrameworkRow icon={Calculator} label="Visible calculations" text="Daily profit · Total profit · Final value" />
                <FrameworkRow icon={GlobeHemisphereWest} label="Multiple markets" text="Six global market categories" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24 lg:py-32" aria-labelledby="purpose-title">
        <Container>
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">Our Purpose</p>
            <h2 className="mt-5 text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]" id="purpose-title">Built around clarity, structure, and informed decisions.</h2>
          </header>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {purposeCards.map(({ description, icon: Icon, title }, index) => (
              <article className="rounded-[1.75rem] border border-[var(--color-border)] bg-[#f8faf9] p-7 shadow-[0_18px_55px_rgba(18,45,72,0.05)] transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_65px_rgba(18,45,72,0.1)] sm:p-8" key={title}>
                <div className="flex items-center justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"><Icon aria-hidden="true" size={28} weight="duotone" /></span>
                  <span className="font-mono text-xs font-bold tracking-[0.12em] text-[#8aa194]">0{index + 1}</span>
                </div>
                <h3 className="mt-7 text-xl font-extrabold tracking-[-0.03em] text-[var(--color-ink)]">{title}</h3>
                <p className="mt-4 text-sm leading-7 font-medium text-[var(--color-text-muted)]">{description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#f4f8f6] py-20 sm:py-24 lg:py-32" aria-labelledby="platform-title">
        <Container>
          <div className="grid items-end gap-7 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">What TradeUply Does</p>
              <h2 className="mt-5 max-w-[15ch] text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]" id="platform-title">A structured platform experience from plan to progress.</h2>
            </div>
            <p className="max-w-2xl text-pretty text-[length:var(--text-body-lg)] leading-[1.75] font-medium text-[var(--color-text-muted)] lg:justify-self-end">Compare six plans, calculate daily and total projected outcomes, explore global market categories, and keep account activity organized through one interface.</p>
          </div>
          <dl className="mt-14 grid grid-cols-2 overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-white shadow-[0_20px_60px_rgba(18,45,72,0.07)] lg:grid-cols-4">
            {platformFacts.map(({ label, value }, index) => (
              <div className={`px-5 py-8 text-center ${index % 2 ? "border-l border-[var(--color-border)]" : ""} ${index >= 2 ? "border-t border-[var(--color-border)] lg:border-t-0" : ""} ${index === 2 ? "lg:border-l" : ""}`} key={label}>
                <dd className="text-[clamp(1.5rem,2.5vw,2.3rem)] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]">{value}</dd>
                <dt className="mt-2 text-[0.68rem] font-extrabold tracking-[0.1em] text-[var(--color-text-muted)] uppercase">{label}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-20 sm:py-24 lg:py-32" aria-labelledby="principles-title">
        <Container>
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">Our Principles</p>
            <h2 className="mt-5 text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]" id="principles-title">The standards shaping the TradeUply experience.</h2>
          </header>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map(({ description, icon: Icon, title }) => (
              <article className="rounded-[1.6rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_16px_48px_rgba(18,45,72,0.05)]" key={title}>
                <span className="grid size-12 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"><Icon aria-hidden="true" size={24} weight="duotone" /></span>
                <h3 className="mt-6 text-lg leading-6 font-extrabold tracking-[-0.025em] text-[var(--color-ink)]">{title}</h3>
                <p className="mt-3 text-sm leading-6 font-medium text-[var(--color-text-muted)]">{description}</p>
              </article>
            ))}
          </div>

          <ol className="mt-16 grid gap-4 rounded-[2rem] bg-[var(--color-ink)] p-5 text-white sm:grid-cols-2 sm:p-7 lg:grid-cols-4 lg:p-8">
            {processSteps.map(({ icon: Icon, number, title }, index) => (
              <li className={`rounded-2xl border border-white/10 bg-white/[0.055] p-5 ${index > 0 ? "" : ""}`} key={number}>
                <div className="flex items-center justify-between"><span className="grid size-10 place-items-center rounded-xl bg-[#67e4a7]/10 text-[#67e4a7]"><Icon aria-hidden="true" size={21} weight="duotone" /></span><span className="text-xs font-extrabold tracking-[0.12em] text-white/35">{number}</span></div>
                <p className="mt-5 text-sm font-extrabold">{title}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-[#f4f8f6] py-20 sm:py-24 lg:py-28">
        <Container>
          <ContactOffices />
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-ink)] px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-12 lg:py-12">
            <div aria-hidden="true" className="absolute -top-28 -right-24 size-72 rounded-full bg-[var(--color-brand)]/20 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">Explore TradeUply</p>
              <h2 className="mt-3 text-[length:var(--text-h3)] font-extrabold tracking-[-0.035em]">Move forward with greater clarity.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 font-medium text-white/58">Review the available plans, calculate projected outcomes, or contact the team before creating your account.</p>
            </div>
            <div className="relative mt-7 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:shrink-0">
              <Link className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-5 text-sm font-extrabold text-white transition hover:bg-white/10" href="/contact">Contact Our Team</Link>
              <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#08c971]" href="/register">Open Your Account<ArrowRight aria-hidden="true" size={17} weight="bold" /></Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function FrameworkRow({ icon: Icon, label, text }: { icon: typeof Wallet; label: string; text: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.055] p-4 sm:p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#67e4a7]/10 text-[#67e4a7]"><Icon aria-hidden="true" size={23} weight="duotone" /></span>
      <div><p className="text-sm font-extrabold text-white">{label}</p><p className="mt-1 text-xs leading-5 font-semibold text-white/45">{text}</p></div>
    </div>
  );
}
