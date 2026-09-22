import { ArrowRight, EnvelopeSimple, Question } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { ContactExperience } from "@/components/contact/contact-experience";
import { ContactOffices } from "@/components/contact/contact-offices";
import { Container } from "@/components/ui/container";
import { supportEmail } from "@/data/company";

export const metadata: Metadata = {
  title: "Contact TradeUply | Investment Platform Support",
  description:
    "Contact TradeUply for assistance with account access, investment plans, deposits, withdrawals, or general platform questions.",
};

export default function ContactPage() {
  return (
    <main className="mt-[7.5rem] min-h-screen bg-[#f4f8f6] sm:mt-[8.5rem] lg:mt-36">
      <Container className="py-12 sm:py-16 lg:py-20">
        <header className="mx-auto max-w-4xl text-center">
          <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">
            Contact TradeUply
          </p>
          <h1 className="mt-5 text-balance text-[clamp(2.5rem,5vw,4.8rem)] leading-[1.05] font-extrabold tracking-[-0.055em] text-[var(--color-ink)]">
            How can we help with your investment journey?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[length:var(--text-body-lg)] leading-[1.75] font-medium text-[var(--color-text-muted)]">
            Contact the TradeUply team for assistance with accounts, investment plans,
            platform access, or general questions.
          </p>
          <a className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-extrabold text-[var(--color-ink)] shadow-[0_12px_34px_rgba(18,45,72,0.07)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand-hover)]" href={`mailto:${supportEmail}`}>
            <EnvelopeSimple aria-hidden="true" className="text-[var(--color-brand-hover)]" size={19} weight="duotone" />
            {supportEmail}
          </a>
        </header>

        <div className="mt-14 lg:mt-16">
          <ContactExperience />
        </div>

        <ContactOffices />

        <section className="relative mt-16 overflow-hidden rounded-[2rem] bg-[var(--color-ink)] px-6 py-9 text-white sm:px-9 sm:py-11 lg:mt-20 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-12" aria-labelledby="contact-faq-title">
          <div aria-hidden="true" className="absolute -top-28 -right-24 size-72 rounded-full bg-[var(--color-brand)]/20 blur-3xl" />
          <div className="relative flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#67e4a7]">
              <Question aria-hidden="true" size={25} weight="duotone" />
            </span>
            <div>
              <p className="text-xs font-extrabold tracking-[0.16em] text-[#67e4a7] uppercase">Quick Answers</p>
              <h2 className="mt-2 text-[length:var(--text-h3)] font-extrabold tracking-[-0.035em]" id="contact-faq-title">
                You may find the answer faster in our FAQ.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 font-medium text-white/58">
                The FAQ page will cover accounts, plans, calculations, deposits, withdrawals, and platform access.
              </p>
            </div>
          </div>

          <div className="relative mt-7 grid gap-3 sm:grid-cols-2 lg:mt-0 lg:shrink-0">
            <span aria-disabled="true" className="inline-flex min-h-12 cursor-not-allowed items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] px-5 text-sm font-extrabold text-white/38">
              FAQ Coming Soon
            </span>
            <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#08c971]" href="/register">
              Open Your Account
              <ArrowRight aria-hidden="true" size={17} weight="bold" />
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
