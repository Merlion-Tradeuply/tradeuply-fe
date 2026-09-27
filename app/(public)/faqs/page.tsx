import { ArrowRight, EnvelopeSimple, Info, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { FaqExplorer } from "@/components/faq/faq-explorer";
import { Container } from "@/components/ui/container";
import { supportEmail } from "@/data/company";
import { faqItems } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Investment Platform FAQs | TradeUply Help Centre",
  description:
    "Find answers about TradeUply accounts, investment plans, projected profit calculations, deposits, withdrawals, risk, and account security.",
};

export default function FaqPage() {
  return (
    <main className="mt-[7.5rem] min-h-screen bg-white sm:mt-[8.5rem] lg:mt-36">
      <section className="relative overflow-hidden bg-[#f4f8f6] py-16 sm:py-20 lg:py-24">
        <div aria-hidden="true" className="absolute -top-52 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-[var(--color-brand)]/[0.09] blur-3xl" />
        <Container className="relative text-center">
          <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">TradeUply Help Centre</p>
          <h1 className="mx-auto mt-5 max-w-[19ch] text-balance text-[clamp(2.6rem,5.8vw,5.2rem)] leading-[1.02] font-extrabold tracking-[-0.06em] text-[var(--color-ink)]">Frequently asked questions about investing with TradeUply.</h1>
          <p className="mx-auto mt-6 max-w-3xl text-pretty text-[length:var(--text-body-lg)] leading-[1.75] font-medium text-[var(--color-text-muted)]">Explore clear answers about accounts, investment plans, projected outcomes, transactions, and risk before taking your next step.</p>
          <div className="mx-auto mt-7 flex w-fit items-center gap-3 rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-xs font-extrabold text-[var(--color-ink-soft)] shadow-sm">
            <span className="grid size-7 place-items-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"><Info aria-hidden="true" size={16} weight="bold" /></span>
            {faqItems.length} clear answers · No external support service required
          </div>
          <FaqExplorer />
        </Container>
      </section>

      <section className="py-20 sm:py-24 lg:py-28" aria-labelledby="important-title">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-ink)] px-6 py-10 text-white shadow-[0_26px_70px_rgba(3,26,59,0.16)] sm:px-10 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-14 lg:px-12 lg:py-12">
            <div aria-hidden="true" className="absolute -top-32 -right-24 size-80 rounded-full bg-[var(--color-brand)]/20 blur-3xl" />
            <div className="relative">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#67e4a7]/10 text-[#67e4a7]"><ShieldCheck aria-hidden="true" size={29} weight="duotone" /></span>
              <p className="mt-6 text-xs font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">Important to understand</p>
              <h2 className="mt-3 text-balance text-[length:var(--text-h3)] font-extrabold tracking-[-0.04em]" id="important-title">Clarity before commitment.</h2>
            </div>
            <ul className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:mt-0">
              {["Projections are illustrative", "Returns are not guaranteed", "Capital may be at risk", "Eligibility and verification may apply"].map((item) => (
                <li className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-bold text-white/75" key={item}>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#67e4a7]/10 text-[#67e4a7]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-[#f4f8f6] py-20 sm:py-24" aria-labelledby="support-title">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold tracking-[0.2em] text-[var(--color-brand-hover)] uppercase">Still need help?</p>
            <h2 className="mt-4 text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]" id="support-title">Talk with the TradeUply team.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 font-medium text-[var(--color-text-muted)]">Contact us for help with your account, plan information, platform access, or a question not covered above.</p>
            <a className="mx-auto mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--color-ink)] hover:text-[var(--color-brand-hover)]" href={`mailto:${supportEmail}`}><EnvelopeSimple aria-hidden="true" size={19} weight="duotone" />{supportEmail}</a>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link className="inline-flex min-h-13 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-6 text-sm font-extrabold text-[var(--color-ink)] transition hover:border-[var(--color-brand)]" href="/contact">Contact Our Team</Link>
              <Link className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(6,184,102,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)]" href="/register">Open Your Account<ArrowRight aria-hidden="true" size={17} weight="bold" /></Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
