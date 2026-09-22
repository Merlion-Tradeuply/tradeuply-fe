import { Buildings, MapPin } from "@phosphor-icons/react/dist/ssr";

import { companyOffices } from "@/data/company";

export function ContactOffices() {
  return (
    <section aria-labelledby="contact-offices-title" className="mt-20 sm:mt-24 lg:mt-28">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">
          Global Presence
        </p>
        <h2 className="mt-5 text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]" id="contact-offices-title">
          TradeUply offices
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-pretty text-[length:var(--text-body-lg)] leading-[1.7] font-medium text-[var(--color-text-muted)]">
          Our planned operating presence spans India, the United Kingdom, and the United Arab Emirates.
        </p>
      </header>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {companyOffices.map((office) => (
          <article className="relative rounded-[1.65rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_18px_55px_rgba(18,45,72,0.06)] sm:p-7" key={office.country}>
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
                {"badge" in office ? <Buildings aria-hidden="true" size={25} weight="duotone" /> : <MapPin aria-hidden="true" size={25} weight="duotone" />}
              </span>
              {"badge" in office && (
                <span className="rounded-full bg-[var(--color-brand)] px-3 py-1.5 text-[0.62rem] font-extrabold tracking-[0.1em] text-white uppercase">
                  {office.badge}
                </span>
              )}
            </div>
            <h3 className="mt-6 text-lg font-extrabold tracking-[-0.025em] text-[var(--color-ink)]">{office.country}</h3>
            <address className="mt-3 text-sm leading-6 font-medium text-[var(--color-text-muted)] not-italic">{office.address}</address>
          </article>
        ))}
      </div>
    </section>
  );
}
