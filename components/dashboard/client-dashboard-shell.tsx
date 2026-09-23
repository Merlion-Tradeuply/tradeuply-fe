"use client";

import {
  Briefcase,
  ChartDonut,
  Receipt,
  Wallet,
  SquaresFour,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/dashboard", icon: SquaresFour, label: "Dashboard" },
  { href: "/my-porfolio", icon: ChartDonut, label: "My Portfolio" },
  {
    href: "/investment-funds",
    icon: Briefcase,
    label: "Investment Funds",
  },
  { href: "/transactions", icon: Receipt, label: "Transactions" },
  { href: "/payment-methods", icon: Wallet, label: "Payment Methods" },
] as const;

export function ClientDashboardShell({
  children,
  description,
  title,
}: {
  children?: ReactNode;
  description?: string;
  title: string;
}) {
  const pathname = usePathname();

  return (
    <main className="mt-[7.5rem] min-h-screen min-w-0 overflow-x-clip bg-[#f4f8f6] pb-14 sm:mt-[8.5rem] sm:pb-20 lg:mt-36">
      <div className="mx-auto grid w-full min-w-0 max-w-[92rem] gap-5 px-3 pt-5 sm:px-6 sm:pt-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-7 lg:px-8">
        <aside className="min-w-0 lg:sticky lg:top-36 lg:h-fit">
          <div className="min-w-0 overflow-hidden rounded-[1.25rem] bg-[var(--color-ink)] p-2.5 shadow-[0_24px_65px_rgba(3,26,59,0.13)] sm:rounded-[1.5rem] sm:p-3 lg:p-4">
            <div className="hidden px-3 pt-2 pb-4 lg:block">
              <p className="text-[0.62rem] font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">
                Client workspace
              </p>
            </div>

            <nav
              aria-label="Client dashboard navigation"
              className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col"
            >
              {navigationItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href;

                return (
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 min-w-0 items-center gap-2 rounded-xl px-3 text-[0.68rem] font-extrabold transition sm:min-h-12 sm:gap-3 sm:px-4 sm:text-xs lg:w-full",
                      isActive
                        ? "bg-[var(--color-brand)] text-white shadow-[0_10px_25px_rgba(6,184,102,0.2)]"
                        : "text-white/58 hover:bg-white/8 hover:text-white",
                    )}
                    href={href}
                    key={href}
                  >
                    <Icon aria-hidden="true" className="shrink-0" size={19} weight="duotone" />
                    <span className="min-w-0 truncate">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 hidden border-t border-white/10 pt-3 lg:block">
              <LogoutButton />
            </div>
          </div>
        </aside>

        <section className="min-w-0 max-w-full">
          <header className="mb-5 sm:mb-6">
            <div>
              <p className="text-[0.65rem] font-extrabold tracking-[0.17em] text-[var(--color-brand-hover)] uppercase">
                Client area
              </p>
              <h1 className="mt-2 text-[clamp(1.75rem,8vw,3rem)] leading-none font-extrabold tracking-[-0.045em] text-[var(--color-ink)]">
                {title}
              </h1>
              {description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 font-medium text-[var(--color-text-muted)]">
                  {description}
                </p>
              )}
            </div>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
