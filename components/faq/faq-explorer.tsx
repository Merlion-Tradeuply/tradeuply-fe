"use client";

import {
  CaretDown,
  ChartLineUp,
  CreditCard,
  IdentificationCard,
  MagnifyingGlass,
  RocketLaunch,
  ShieldCheck,
  X,
} from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { faqCategories, faqItems, type FaqCategory } from "@/data/faqs";
import { cn } from "@/lib/utils";

const categoryIcons = {
  "Accounts & Verification": IdentificationCard,
  "Deposits & Withdrawals": CreditCard,
  "Getting Started": RocketLaunch,
  "Investment Plans": ChartLineUp,
  "Profit Calculations": MagnifyingGlass,
  "Risk & Security": ShieldCheck,
} satisfies Record<FaqCategory, typeof RocketLaunch>;

export function FaqExplorer() {
  const [activeCategory, setActiveCategory] = useState<(typeof faqCategories)[number]>("All Questions");
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqItems[0].question);
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return faqItems.filter((item) => {
      const matchesCategory = activeCategory === "All Questions" || item.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${item.question} ${item.answer} ${item.category}`.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  function selectCategory(category: (typeof faqCategories)[number]) {
    setActiveCategory(category);
    setOpenQuestion(null);
  }

  return (
    <>
      <div className="relative mx-auto mt-10 max-w-3xl">
        <MagnifyingGlass aria-hidden="true" className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 text-[var(--color-brand-hover)]" size={22} weight="bold" />
        <label className="sr-only" htmlFor="faq-search">Search frequently asked questions</label>
        <input
          className="h-16 w-full rounded-2xl border border-[var(--color-border)] bg-white pr-14 pl-14 text-sm font-bold text-[var(--color-ink)] shadow-[0_18px_48px_rgba(18,45,72,0.1)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 sm:h-[4.5rem] sm:text-base"
          id="faq-search"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search plans, accounts, calculations, risk…"
          type="search"
          value={query}
        />
        {query && (
          <button aria-label="Clear FAQ search" className="absolute top-1/2 right-4 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-[var(--color-text-muted)] transition hover:bg-slate-100 hover:text-[var(--color-ink)]" onClick={() => setQuery("")} type="button">
            <X aria-hidden="true" size={18} weight="bold" />
          </button>
        )}
      </div>

      <div className="mt-14 grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
        <aside aria-label="FAQ categories" className="rounded-[1.6rem] border border-[var(--color-border)] bg-[#f7faf8] p-3 lg:sticky lg:top-36">
          <p className="px-4 pt-3 pb-2 text-[0.68rem] font-extrabold tracking-[0.15em] text-[var(--color-text-muted)] uppercase">Browse by topic</p>
          <div className="mt-1 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
            {faqCategories.map((category) => {
              const Icon = category === "All Questions" ? MagnifyingGlass : categoryIcons[category];
              const isActive = activeCategory === category;

              return (
                <button
                  aria-pressed={isActive}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-xl px-4 text-left text-sm font-extrabold transition",
                    isActive
                      ? "bg-[var(--color-ink)] text-white shadow-[0_10px_26px_rgba(3,26,59,0.16)]"
                      : "text-[var(--color-ink-soft)] hover:bg-white hover:text-[var(--color-ink)]",
                  )}
                  key={category}
                  onClick={() => selectCategory(category)}
                  type="button"
                >
                  <Icon aria-hidden="true" className={isActive ? "text-[#67e4a7]" : "text-[var(--color-brand-hover)]"} size={20} weight="duotone" />
                  {category}
                </button>
              );
            })}
          </div>
        </aside>

        <section aria-label="Frequently asked questions" aria-live="polite">
          <div className="mb-5 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-extrabold tracking-[0.14em] text-[var(--color-brand-hover)] uppercase">{activeCategory}</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-[var(--color-ink)]">Answers for informed decisions</h2>
            </div>
            <p className="shrink-0 text-xs font-bold text-[var(--color-text-muted)]">{filteredItems.length} {filteredItems.length === 1 ? "answer" : "answers"}</p>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid gap-3">
              {filteredItems.map((item, index) => {
                const isOpen = openQuestion === item.question;
                const panelId = `faq-panel-${faqItems.indexOf(item)}`;

                return (
                  <article className={cn("overflow-hidden rounded-[1.35rem] border bg-white transition", isOpen ? "border-[var(--color-brand)]/45 shadow-[0_16px_42px_rgba(18,45,72,0.08)]" : "border-[var(--color-border)]")} key={item.question}>
                    <h3>
                      <button
                        aria-controls={panelId}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
                        onClick={() => setOpenQuestion(isOpen ? null : item.question)}
                        type="button"
                      >
                        <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg text-[0.68rem] font-extrabold", isOpen ? "bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]" : "bg-slate-100 text-[var(--color-text-muted)]")}>{String(index + 1).padStart(2, "0")}</span>
                        <span className="flex-1 text-sm leading-6 font-extrabold text-[var(--color-ink)] sm:text-base">{item.question}</span>
                        <CaretDown aria-hidden="true" className={cn("shrink-0 text-[var(--color-brand-hover)] transition-transform duration-200", isOpen && "rotate-180")} size={20} weight="bold" />
                      </button>
                    </h3>
                    <div className={cn("grid transition-[grid-template-rows] duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")} id={panelId}>
                      <div className="overflow-hidden">
                        <p className="border-t border-slate-100 px-5 py-5 pl-[4.5rem] text-sm leading-7 font-medium text-[var(--color-text-muted)] sm:px-6 sm:py-6 sm:pl-[5.25rem]">{item.answer}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-[1.6rem] border border-dashed border-[var(--color-border)] bg-[#f7faf8] px-6 py-16 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"><MagnifyingGlass aria-hidden="true" size={26} weight="duotone" /></span>
              <h3 className="mt-5 text-xl font-extrabold text-[var(--color-ink)]">No matching questions</h3>
              <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">Try a different search term or browse another topic.</p>
              <button className="mt-5 text-sm font-extrabold text-[var(--color-brand-hover)] hover:underline" onClick={() => { setQuery(""); setActiveCategory("All Questions"); }} type="button">Clear all filters</button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
