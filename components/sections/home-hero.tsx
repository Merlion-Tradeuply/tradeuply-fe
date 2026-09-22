import {
  ChartLineUp,
  ChartPieSlice,
  GlobeHemisphereWest,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

const marketBenefits = [
  { icon: GlobeHemisphereWest, label: "Global market access" },
  { icon: ChartLineUp, label: "Real-time insights" },
  { icon: ChartPieSlice, label: "Clear portfolio control" },
] as const;

export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="hero-shell relative isolate flex min-h-[62rem] overflow-hidden sm:min-h-[64rem] lg:min-h-[100svh] lg:max-h-[68rem]"
      id="home"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 lg:top-20">
        <Image
          alt=""
          className="object-cover object-[68%_center] sm:object-[62%_center] lg:object-center"
          fill
          priority
          sizes="100vw"
          src="/brand/tradeuply-hero-light.png"
        />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-white/35 lg:hidden" />

      <Container className="relative z-10 flex min-h-full flex-1 flex-col items-center pt-36 pb-8 sm:pt-40 lg:items-start lg:pt-[18.25rem]">
        <div className="flex w-full max-w-[45rem] flex-col items-center text-center lg:ml-12 lg:items-start lg:text-left">
          <p className="hero-kicker font-extrabold tracking-[0.3em] text-[var(--color-brand-hover)] uppercase">
            Trade with a global perspective
          </p>

          <h1
            className="mt-7 max-w-[18ch] text-balance text-[length:var(--text-hero)] leading-[1.08] font-extrabold tracking-[-0.048em] text-[var(--color-ink)]"
            id="home-hero-title"
          >
            See the market clearly.
            <span className="block">Move with confidence.</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-pretty text-[length:var(--text-body-lg)] leading-[1.65] font-medium text-[var(--color-text-muted)] sm:mt-7">
            TradeUply brings global market access, real-time insights,
            <br className="hidden lg:block" />{" "}
            intuitive trading tools, and portfolio management
            <br className="hidden lg:block" />{" "}
            into one clear experience.
          </p>

          <div className="mt-8 flex w-full max-w-[29rem] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-8">
            <ButtonLink className="sm:min-w-[13.5rem]" href="/register">
              Start Trading
            </ButtonLink>
            <ButtonLink
              className="sm:min-w-[14.5rem]"
              href="#market-access"
              variant="secondary"
            >
              Discover TradeUply
            </ButtonLink>
          </div>
        </div>

        <div className="pointer-events-none min-h-[16rem] flex-1 sm:min-h-[19rem] lg:min-h-[10rem]" />

        <ul
          className="market-status pointer-events-auto grid w-full max-w-[48rem] gap-1 rounded-2xl p-2 sm:grid-cols-3 sm:rounded-full lg:self-center"
          id="market-access"
        >
          {marketBenefits.map(({ icon: Icon, label }) => (
            <li
              className="flex min-h-12 items-center justify-center gap-2.5 rounded-full px-4 py-2 text-[length:var(--text-small)] font-semibold text-[var(--color-ink-soft)]"
              key={label}
            >
              <Icon
                aria-hidden="true"
                className="shrink-0 text-[var(--color-brand)]"
                size={24}
                weight="regular"
              />
              {label}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
