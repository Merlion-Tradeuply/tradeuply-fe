"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bank,
  Buildings,
  ChartBar,
  Coins,
  CurrencyCircleDollar,
  CurrencyBtc,
  GlobeHemisphereWest,
  Package,
  TrendUp,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Container } from "@/components/ui/container";

type MarketInstrument = {
  change: string;
  direction: "down" | "up";
  name: string;
  symbol: string;
  value: string;
};

type MarketCategory = {
  description: string;
  highlights: readonly string[];
  icon: typeof Buildings;
  id: string;
  instruments: readonly MarketInstrument[];
  label: string;
};

const marketCategories: readonly MarketCategory[] = [
  {
    description:
      "Discover opportunities across established companies, fast-growing sectors, and leading international exchanges.",
    highlights: ["Leading global companies", "Multiple market sectors", "International exchanges"],
    icon: Buildings,
    id: "stocks",
    instruments: [
      { change: "+1.24%", direction: "up", name: "Apple", symbol: "AAPL", value: "$237.49" },
      { change: "+2.18%", direction: "up", name: "NVIDIA", symbol: "NVDA", value: "$185.73" },
      { change: "+0.76%", direction: "up", name: "Microsoft", symbol: "MSFT", value: "$512.44" },
    ],
    label: "Stocks",
  },
  {
    description:
      "Follow major, minor, and emerging currency pairs through a clear global foreign-exchange market view.",
    highlights: ["Major currency pairs", "Global trading sessions", "Clear price movements"],
    icon: CurrencyCircleDollar,
    id: "forex",
    instruments: [
      { change: "+0.18%", direction: "up", name: "Euro / US Dollar", symbol: "EUR/USD", value: "1.1642" },
      { change: "+0.11%", direction: "up", name: "British Pound / US Dollar", symbol: "GBP/USD", value: "1.3458" },
      { change: "-0.22%", direction: "down", name: "US Dollar / Japanese Yen", symbol: "USD/JPY", value: "147.36" },
    ],
    label: "Forex",
  },
  {
    description:
      "Explore essential markets including precious metals, energy products, and widely traded raw materials.",
    highlights: ["Precious metals", "Energy markets", "Agricultural products"],
    icon: Package,
    id: "commodities",
    instruments: [
      { change: "+0.72%", direction: "up", name: "Gold", symbol: "XAU/USD", value: "$3,371.60" },
      { change: "-0.42%", direction: "down", name: "Crude Oil", symbol: "WTI", value: "$64.78" },
      { change: "+1.05%", direction: "up", name: "Silver", symbol: "XAG/USD", value: "$38.15" },
    ],
    label: "Commodities",
  },
  {
    description:
      "Track broad market performance through widely followed indices representing major economies and exchanges.",
    highlights: ["Major global indices", "Broad market exposure", "Regional performance"],
    icon: ChartBar,
    id: "indices",
    instruments: [
      { change: "+0.61%", direction: "up", name: "S&P 500", symbol: "SPX", value: "6,528.42" },
      { change: "+0.84%", direction: "up", name: "Nasdaq 100", symbol: "NDX", value: "23,914.18" },
      { change: "-0.16%", direction: "down", name: "FTSE 100", symbol: "UKX", value: "9,164.31" },
    ],
    label: "Indices",
  },
  {
    description:
      "Explore selected cryptocurrency and blockchain-based markets through a focused, easy-to-follow experience.",
    highlights: ["Selected digital assets", "Clear market tracking", "24/7 market visibility"],
    icon: CurrencyBtc,
    id: "digital-assets",
    instruments: [
      { change: "+2.80%", direction: "up", name: "Bitcoin", symbol: "BTC/USD", value: "$113,840" },
      { change: "+1.90%", direction: "up", name: "Ethereum", symbol: "ETH/USD", value: "$4,620" },
      { change: "+3.10%", direction: "up", name: "Solana", symbol: "SOL/USD", value: "$198.42" },
    ],
    label: "Digital Assets",
  },
  {
    description:
      "Diversify across industries, geographic regions, and investment themes through exchange-traded funds.",
    highlights: ["Diversified exposure", "Industry themes", "Regional opportunities"],
    icon: Bank,
    id: "etfs",
    instruments: [
      { change: "+0.58%", direction: "up", name: "S&P 500 ETF", symbol: "SPY", value: "$649.32" },
      { change: "+0.79%", direction: "up", name: "Nasdaq 100 ETF", symbol: "QQQ", value: "$582.41" },
      { change: "-0.12%", direction: "down", name: "Gold Shares ETF", symbol: "GLD", value: "$309.84" },
    ],
    label: "ETFs",
  },
] as const;

export function MarketsExplorer() {
  const [activeMarketId, setActiveMarketId] = useState(marketCategories[0].id);
  const activeMarket =
    marketCategories.find((market) => market.id === activeMarketId) ?? marketCategories[0];
  const ActiveIcon = activeMarket.icon;

  return (
    <section
      aria-labelledby="markets-title"
      className="scroll-mt-28 bg-white py-20 sm:py-24 lg:py-32"
      id="markets"
    >
      <Container>
        <div className="grid items-end gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="text-[length:var(--text-small)] font-extrabold tracking-[0.28em] text-[var(--color-brand-hover)] uppercase">
              Global Market Access
            </p>
            <h2
              className="mt-5 max-w-[16ch] text-balance text-[length:var(--text-h2)] leading-[1.08] font-extrabold tracking-[-0.045em] text-[var(--color-ink)]"
              id="markets-title"
            >
              One platform. Multiple market opportunities.
            </h2>
          </div>

          <p className="max-w-[34rem] text-pretty text-[length:var(--text-body-lg)] leading-[1.75] font-medium text-[var(--color-text-muted)] lg:justify-self-end">
            Explore global financial markets through a clear and intuitive trading
            experience. Follow opportunities across major asset classes while
            managing everything from one platform.
          </p>
        </div>

        <div
          aria-label="Market categories"
          className="mt-12 flex snap-x gap-2 overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[#f7f9f8] p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-14"
          id="markets-tabs"
          role="tablist"
        >
          {marketCategories.map(({ icon: Icon, id, label }) => {
            const isActive = id === activeMarket.id;

            return (
              <button
                aria-controls={`market-panel-${id}`}
                aria-selected={isActive}
                className={`inline-flex min-h-12 shrink-0 snap-start items-center justify-center gap-2.5 rounded-xl px-4 text-sm font-extrabold transition sm:flex-1 sm:px-5 ${
                  isActive
                    ? "bg-[var(--color-ink)] text-white shadow-[0_12px_28px_rgba(3,26,59,0.16)]"
                    : "text-[var(--color-ink-soft)] hover:bg-white hover:text-[var(--color-ink)]"
                }`}
                id={`market-tab-${id}`}
                key={id}
                onClick={() => setActiveMarketId(id)}
                role="tab"
                type="button"
              >
                <Icon aria-hidden="true" size={20} weight={isActive ? "fill" : "duotone"} />
                {label}
              </button>
            );
          })}
        </div>

        <div
          aria-labelledby={`market-tab-${activeMarket.id}`}
          className="mt-5 grid overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[#f7f9f8] lg:grid-cols-[0.82fr_1.18fr]"
          id={`market-panel-${activeMarket.id}`}
          role="tabpanel"
        >
          <div className="flex flex-col p-6 sm:p-9 lg:p-12">
            <span className="grid size-14 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
              <ActiveIcon aria-hidden="true" size={30} weight="duotone" />
            </span>

            <p className="mt-8 text-xs font-extrabold tracking-[0.16em] text-[var(--color-brand-hover)] uppercase">
              Explore {activeMarket.label}
            </p>
            <h3 className="mt-3 text-[length:var(--text-h3)] leading-tight font-extrabold tracking-[-0.04em] text-[var(--color-ink)]">
              Global {activeMarket.label.toLowerCase()} opportunities, made clearer.
            </h3>
            <p className="mt-5 text-[length:var(--text-body)] leading-7 font-medium text-[var(--color-text-muted)]">
              {activeMarket.description}
            </p>

            <ul className="mt-7 grid gap-3 text-sm font-bold text-[var(--color-ink-soft)]">
              {activeMarket.highlights.map((highlight) => (
                <li className="flex items-center gap-3" key={highlight}>
                  <span aria-hidden="true" className="size-2 rounded-full bg-[var(--color-brand)]" />
                  {highlight}
                </li>
              ))}
            </ul>

            <a
              className="mt-9 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 py-4 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(6,184,102,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)]"
              href="#markets-tabs"
            >
              Explore All Markets
              <ArrowRight aria-hidden="true" size={17} weight="bold" />
            </a>
          </div>

          <div className="border-t border-[var(--color-border)] bg-white p-4 sm:p-7 lg:border-t-0 lg:border-l lg:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
                  <TrendUp aria-hidden="true" size={22} weight="duotone" />
                </span>
                <div>
                  <h3 className="font-extrabold text-[var(--color-ink)]">Market overview</h3>
                  <p className="mt-0.5 text-xs font-semibold text-[var(--color-text-muted)]">
                    Selected {activeMarket.label.toLowerCase()}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-[#f2f5f4] px-3 py-1.5 text-[0.68rem] font-extrabold tracking-[0.08em] text-[var(--color-text-muted)] uppercase">
                Illustrative data
              </span>
            </div>

            <div className="mt-3 divide-y divide-slate-200">
              {activeMarket.instruments.map((instrument) => {
                const isPositive = instrument.direction === "up";
                const DirectionIcon = isPositive ? ArrowUpRight : ArrowDownRight;

                return (
                  <article
                    className="grid grid-cols-[1fr_auto] items-center gap-5 py-5"
                    key={instrument.symbol}
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-[#f8faf9] text-[var(--color-ink)]">
                        <Coins aria-hidden="true" size={22} weight="duotone" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="truncate font-extrabold text-[var(--color-ink)]">
                          {instrument.symbol}
                        </h4>
                        <p className="mt-0.5 truncate text-xs font-semibold text-[var(--color-text-muted)]">
                          {instrument.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-extrabold text-[var(--color-ink)]">{instrument.value}</p>
                      <p
                        className={`mt-1 inline-flex items-center justify-end gap-1 text-xs font-extrabold ${
                          isPositive ? "text-[var(--color-brand-hover)]" : "text-[#dc4f4f]"
                        }`}
                      >
                        <DirectionIcon aria-hidden="true" size={14} weight="bold" />
                        {instrument.change}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-[var(--color-ink)] p-3 text-center text-white sm:p-4">
              <div className="px-1 py-2">
                <GlobeHemisphereWest aria-hidden="true" className="mx-auto text-[#5ce9a3]" size={22} />
                <p className="mt-2 text-xs font-extrabold">Global</p>
              </div>
              <div className="border-x border-white/10 px-1 py-2">
                <TrendUp aria-hidden="true" className="mx-auto text-[#5ce9a3]" size={22} />
                <p className="mt-2 text-xs font-extrabold">Real-time</p>
              </div>
              <div className="px-1 py-2">
                <ChartBar aria-hidden="true" className="mx-auto text-[#5ce9a3]" size={22} />
                <p className="mt-2 text-xs font-extrabold">One view</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
