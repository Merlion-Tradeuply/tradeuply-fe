import {
  ArrowRight,
  Buildings,
  EnvelopeSimple,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { companyOffices, officeAddressNotice, supportEmail } from "@/data/company";

const footerNavigation = [
  {
    links: [
      { href: "/#plans", label: "Investment Plans" },
      { href: "/#profit-calculator", label: "Profit Calculator" },
      { href: "/#markets", label: "Available Markets" },
      { href: "/#investment-approach", label: "Investment Approach" },
      { href: "/#how-it-works", label: "How It Works" },
    ],
    title: "Investment",
  },
  {
    links: [
      { href: "/about", label: "About Us" },
      { href: "/faqs", label: "FAQ" },
      { href: "/contact", label: "Contact Us" },
      { href: `mailto:${supportEmail}`, label: "Support" },
    ],
    title: "Company",
  },
] as const;

const legalPages = [
  "Terms and Conditions",
  "Privacy Policy",
  "Risk Disclosure",
  "KYC / AML Policy",
  "Cookie Policy",
] as const;

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative scroll-mt-28 overflow-hidden bg-[var(--color-ink)] text-white" id="site-footer">
      <div className="h-1 bg-gradient-to-r from-[#031a3b] via-[var(--color-brand)] to-[#031a3b]" />
      <div
        aria-hidden="true"
        className="absolute -top-64 -right-48 size-[34rem] rounded-full bg-[var(--color-brand)]/15 blur-3xl"
      />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.8fr] lg:gap-10 lg:pb-16">
          <div>
            <Link
              aria-label="TradeUply home"
              className="inline-flex rounded-2xl bg-white px-5 py-4 shadow-[0_18px_45px_rgba(0,0,0,0.16)]"
              href="/"
            >
              <Image
                alt="TradeUply"
                className="h-auto w-[10.5rem] sm:w-[12rem]"
                height={580}
                src="/brand/tradeuply-logo.png"
                width={1621}
              />
            </Link>
            <p className="mt-6 max-w-md text-sm leading-7 font-medium text-white/58">
              TradeUply is an online investment platform offering clearly structured
              plans, transparent profit projections, and access to multiple global
              market categories.
            </p>
            <Link
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#08c971] sm:w-auto"
              href="/register"
            >
              Open Your Account
              <ArrowRight aria-hidden="true" size={17} weight="bold" />
            </Link>
          </div>

          {footerNavigation.map((group) => (
            <nav aria-label={`${group.title} footer navigation`} key={group.title}>
              <h2 className="text-xs font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">
                {group.title}
              </h2>
              <ul className="mt-5 grid gap-3.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      className="text-sm font-semibold text-white/62 transition hover:text-white"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-xs font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">
              Legal
            </h2>
            <ul className="mt-5 grid gap-3.5">
              {legalPages.map((page) => (
                <li key={page}>
                  <span
                    aria-disabled="true"
                    className="inline-flex cursor-not-allowed items-center gap-2 text-sm font-semibold text-white/38"
                    title="Legal page pending client approval"
                  >
                    {page}
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[0.55rem] font-extrabold tracking-[0.08em] text-white/30 uppercase">
                      Soon
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section aria-labelledby="global-offices-title" className="border-b border-white/10 py-14 lg:py-16">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">
                Global Presence
              </p>
              <h2 className="mt-3 text-[length:var(--text-h3)] font-extrabold tracking-[-0.035em]" id="global-offices-title">
                TradeUply offices
              </h2>
            </div>
            <a
              className="inline-flex items-center gap-2 text-sm font-extrabold text-white transition hover:text-[#67e4a7]"
              href={`mailto:${supportEmail}`}
            >
              <EnvelopeSimple aria-hidden="true" size={19} weight="duotone" />
              {supportEmail}
            </a>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {companyOffices.map((office) => (
              <article
                className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 sm:p-6"
                key={office.country}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#67e4a7]/10 text-[#67e4a7]">
                    {"badge" in office ? (
                      <Buildings aria-hidden="true" size={23} weight="duotone" />
                    ) : (
                      <MapPin aria-hidden="true" size={23} weight="duotone" />
                    )}
                  </span>
                  {"badge" in office && (
                    <span className="rounded-full bg-[var(--color-brand)] px-3 py-1.5 text-[0.62rem] font-extrabold tracking-[0.1em] text-white uppercase">
                      {office.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-base font-extrabold">{office.country}</h3>
                <address className="mt-2 text-sm leading-6 font-medium text-white/52 not-italic">
                  {office.address}
                </address>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 font-semibold text-[#e1bd74]">
            Preview notice: {officeAddressNotice}
          </p>
        </section>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-7 text-xs font-semibold text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} TradeUply. All rights reserved.</p>
          <p>Built around clarity and transparency.</p>
        </div>
      </Container>
    </footer>
  );
}
