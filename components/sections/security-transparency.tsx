import {
  ArrowRight,
  CheckCircle,
  Database,
  Eye,
  FileText,
  Fingerprint,
  LockKey,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

import { Container } from "@/components/ui/container";

const protectionPrinciples = [
  {
    description:
      "Identity checks, secure sessions, and clear recovery procedures help protect access to your account.",
    icon: Fingerprint,
    title: "Protected account access",
  },
  {
    description:
      "Follow deposits, selected plans, projected outcomes, maturity dates, and account activity in one place.",
    icon: Eye,
    title: "Transparent fund records",
  },
  {
    description:
      "Review the objective, duration, minimum amount, risk notice, and plan conditions before investing.",
    icon: FileText,
    title: "Clear investment terms",
  },
  {
    description:
      "Personal information is handled through defined access controls and documented privacy practices.",
    icon: Database,
    title: "Responsible data handling",
  },
] as const;

const transparencyPoints = [
  "Plan terms shown before confirmation",
  "Risk information presented clearly",
  "Account activity kept in one record",
  "Privacy and support information accessible",
] as const;

export function SecurityTransparency() {
  return (
    <section
      aria-labelledby="security-title"
      className="relative scroll-mt-28 overflow-hidden bg-white py-20 sm:py-24 lg:py-32"
      id="security"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <div>
            <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">
              Security &amp; Transparency
            </p>
            <h2
              className="mt-5 max-w-[15ch] text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]"
              id="security-title"
            >
              Built to protect every step of your investment journey.
            </h2>
            <p className="mt-6 max-w-xl text-pretty text-[length:var(--text-body-lg)] leading-[1.75] font-medium text-[var(--color-text-muted)]">
              From account access to investment activity, TradeUply is designed around
              clear controls, transparent records, and responsible handling of your
              information.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {transparencyPoints.map((point) => (
                <li className="flex items-start gap-3 text-sm leading-6 font-bold text-[var(--color-ink-soft)]" key={point}>
                  <CheckCircle
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[var(--color-brand)]"
                    size={20}
                    weight="fill"
                  />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(6,184,102,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)]"
                href="/register"
              >
                Open Your Account
                <ArrowRight aria-hidden="true" size={17} weight="bold" />
              </a>
              <a
                className="inline-flex min-h-13 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-6 text-sm font-extrabold text-[var(--color-ink)] transition hover:border-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
                href="#plans"
              >
                Review Investment Plans
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[40rem] overflow-hidden rounded-[2.25rem] bg-[var(--color-ink)] p-5 shadow-[0_34px_90px_rgba(3,26,59,0.2)] sm:p-8">
            <div
              aria-hidden="true"
              className="absolute -top-32 -right-24 size-80 rounded-full bg-[var(--color-brand)]/25 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-40 -left-36 size-80 rounded-full bg-[#2f75ff]/15 blur-3xl"
            />

            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">
                  Protection framework
                </p>
                <h3 className="mt-2 text-xl font-extrabold tracking-[-0.03em] text-white sm:text-2xl">
                  Security through every layer
                </h3>
              </div>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.07] text-[#67e4a7]">
                <LockKey aria-hidden="true" size={23} weight="duotone" />
              </span>
            </div>

            <div className="relative mt-8 grid min-h-[24rem] place-items-center overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] px-5 py-8 sm:min-h-[27rem]">
              <div
                aria-hidden="true"
                className="absolute size-[19rem] rounded-full border border-white/[0.07] sm:size-[23rem]"
              />
              <div
                aria-hidden="true"
                className="absolute size-[14rem] rounded-full border border-[#67e4a7]/15 sm:size-[17rem]"
              />
              <div
                aria-hidden="true"
                className="absolute size-[9rem] rounded-full border border-[#67e4a7]/25 bg-[#67e4a7]/[0.035] sm:size-[11rem]"
              />

              <span className="relative z-10 grid size-24 place-items-center rounded-[2rem] border border-[#67e4a7]/25 bg-[#67e4a7]/10 text-[#67e4a7] shadow-[0_0_55px_rgba(103,228,167,0.15)] sm:size-28">
                <ShieldCheck aria-hidden="true" size={56} weight="duotone" />
              </span>

              <SecurityTag className="top-8 left-5 sm:top-10 sm:left-9" icon={Fingerprint} label="Account access" />
              <SecurityTag className="top-24 right-4 sm:top-28 sm:right-8" icon={Database} label="Data controls" />
              <SecurityTag className="bottom-8 left-7 sm:bottom-11 sm:left-12" icon={FileText} label="Clear records" />
            </div>

            <div className="relative mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#67e4a7]/10 text-[#67e4a7]">
                <ShieldCheck aria-hidden="true" size={22} weight="duotone" />
              </span>
              <p className="text-xs leading-5 font-semibold text-white/60">
                Company, regulatory, and custody details should be displayed only after
                they have been independently documented and verified.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {protectionPrinciples.map(({ description, icon: Icon, title }, index) => (
            <article
              className="group rounded-[1.65rem] border border-[var(--color-border)] bg-[#f8faf9] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#a7cdb8] hover:bg-white hover:shadow-[0_20px_55px_rgba(18,45,72,0.09)] sm:p-7"
              key={title}
            >
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)] transition group-hover:bg-[var(--color-brand)] group-hover:text-white">
                  <Icon aria-hidden="true" size={25} weight="duotone" />
                </span>
                <span className="font-mono text-xs font-bold tracking-[0.12em] text-[#8aa194]">
                  0{index + 1}
                </span>
              </div>
              <h3 className="mt-6 text-lg leading-6 font-extrabold tracking-[-0.025em] text-[var(--color-ink)]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 font-medium text-[var(--color-text-muted)]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

type SecurityTagProps = {
  className: string;
  icon: typeof Fingerprint;
  label: string;
};

function SecurityTag({ className, icon: Icon, label }: SecurityTagProps) {
  return (
    <span
      className={`absolute z-20 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0b294e]/90 px-3 py-2 text-[0.68rem] font-extrabold text-white/75 shadow-xl backdrop-blur-sm sm:px-4 sm:py-2.5 sm:text-xs ${className}`}
    >
      <Icon aria-hidden="true" className="text-[#67e4a7]" size={17} weight="duotone" />
      {label}
    </span>
  );
}
