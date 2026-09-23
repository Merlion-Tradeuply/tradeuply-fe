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
    <main className="mt-[7.5rem] min-h-screen bg-[#f4f8f6] pb-20 sm:mt-[8.5rem] lg:mt-36">
      <div className="mx-auto grid w-full max-w-[92rem] gap-5 px-4 pt-6 sm:px-6 sm:pt-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-7 lg:px-8">
        <aside className="lg:sticky lg:top-36 lg:h-fit">
          <div className="rounded-[1.5rem] bg-[var(--color-ink)] p-3 shadow-[0_24px_65px_rgba(3,26,59,0.13)] lg:p-4">
            <div className="hidden px-3 pt-2 pb-4 lg:block">
              <p className="text-[0.62rem] font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">
                Client workspace
              </p>
            </div>

            <nav
              aria-label="Client dashboard navigation"
              className="flex gap-2 overflow-x-auto lg:flex-col"
            >
              {navigationItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href;

                return (
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-12 shrink-0 items-center gap-3 rounded-xl px-4 text-xs font-extrabold transition lg:w-full",
                      isActive
                        ? "bg-[var(--color-brand)] text-white shadow-[0_10px_25px_rgba(6,184,102,0.2)]"
                        : "text-white/58 hover:bg-white/8 hover:text-white",
                    )}
                    href={href}
                    key={href}
                  >
                    <Icon aria-hidden="true" size={19} weight="duotone" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-3 hidden border-t border-white/10 pt-3 lg:block">
              <LogoutButton />
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="mb-6">
            <div>
              <p className="text-[0.65rem] font-extrabold tracking-[0.17em] text-[var(--color-brand-hover)] uppercase">
                Client area
              </p>
              <h1 className="mt-2 text-[clamp(1.8rem,4vw,3rem)] leading-none font-extrabold tracking-[-0.045em] text-[var(--color-ink)]">
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
