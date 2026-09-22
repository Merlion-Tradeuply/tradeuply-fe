"use client";

import {
  CaretDown,
  List,
  SignOut,
  SpinnerGap,
  SquaresFour,
  X,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { AuthenticatedClient } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home", path: "/" },
  { href: "/about", label: "About Us", path: "/about" },
  { href: "/faqs", label: "FAQ", path: "/faqs" },
  { href: "/contact", label: "Contact", path: "/contact" },
] as const;

export function SiteHeader({
  initialClient,
}: {
  initialClient: AuthenticatedClient | null;
}) {
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [client, setClient] = useState(initialClient);
  const pathname = usePathname();

  const displayName = client
    ? `${client.firstName} ${client.lastName}`.trim()
    : "";
  const initials = client
    ? `${client.firstName.charAt(0)}${client.lastName.charAt(0)}`.toUpperCase()
    : "";

  useEffect(() => {
    let isCurrent = true;

    async function syncSession() {
      try {
        const response = await fetch(API_ENDPOINTS.client.clientSession, {
          cache: "no-store",
          method: "POST",
        });

        if (!isCurrent) return;
        if (!response.ok) {
          setClient(null);
          return;
        }

        const result = (await response.json()) as {
          data: { client: AuthenticatedClient };
        };
        setClient(result.data.client);
      } catch {
        // Keep the server-rendered session state during temporary network failures.
      }
    }

    void syncSession();
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    function closeAccountMenu(event: PointerEvent) {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }

    function closeAccountMenuWithKeyboard(event: KeyboardEvent) {
      if (event.key === "Escape") setIsAccountMenuOpen(false);
    }

    document.addEventListener("pointerdown", closeAccountMenu);
    document.addEventListener("keydown", closeAccountMenuWithKeyboard);
    return () => {
      document.removeEventListener("pointerdown", closeAccountMenu);
      document.removeEventListener("keydown", closeAccountMenuWithKeyboard);
    };
  }, []);

  async function logoutClient() {
    setIsLoggingOut(true);

    try {
      await fetch(API_ENDPOINTS.client.clientLogout, { method: "POST" });
    } finally {
      setClient(null);
      setIsAccountMenuOpen(false);
      setIsOpen(false);
      setIsLoggingOut(false);
      router.replace("/");
      router.refresh();
    }
  }

  function isNavigationItemActive(item: (typeof navigation)[number]) {
    return pathname === item.path;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-4 sm:pt-5">
      <Container>
        <div className="navbar-shell flex min-h-[4.7rem] items-center justify-between gap-5 rounded-[1.45rem] px-4 sm:px-6 lg:min-h-[5.8rem] lg:px-8">
          <Link
            aria-label="TradeUply home"
            className="relative z-10 flex shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand)]"
            href="/"
          >
            <Image
              alt="TradeUply"
              className="h-auto w-[9.4rem] sm:w-[11.4rem] lg:w-[12.7rem]"
              height={580}
              priority
              src="/brand/tradeuply-logo.png"
              width={1621}
            />
          </Link>

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-1 rounded-2xl border border-[var(--color-border)] bg-white/62 p-1.5 lg:flex"
          >
            {navigation.map((item) => {
              const isActive = isNavigationItemActive(item);

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "min-w-[6.2rem] rounded-xl px-4 py-3 text-center text-[length:var(--text-nav)] font-semibold transition",
                    isActive
                      ? "bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"
                      : "text-[var(--color-ink-soft)] hover:bg-slate-100 hover:text-[var(--color-ink)]",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {client ? (
            <div className="relative hidden lg:block" ref={accountMenuRef}>
              <button
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                className="flex min-h-13 items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white/72 py-1.5 pr-3 pl-1.5 text-left transition hover:border-[var(--color-brand)]/35 hover:bg-white"
                onClick={() => setIsAccountMenuOpen((current) => !current)}
                type="button"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--color-ink)] text-xs font-extrabold tracking-[0.04em] text-white shadow-[0_8px_18px_rgba(3,26,59,0.16)]">
                  {initials}
                </span>
                <span className="hidden min-w-0 xl:block">
                  <span className="block max-w-32 truncate text-xs font-extrabold text-[var(--color-ink)]">
                    {displayName}
                  </span>
                  <span className="mt-0.5 block max-w-32 truncate text-[0.65rem] font-semibold text-[var(--color-text-muted)]">
                    {client.email}
                  </span>
                </span>
                <CaretDown
                  aria-hidden="true"
                  className={cn(
                    "text-[var(--color-text-muted)] transition",
                    isAccountMenuOpen && "rotate-180",
                  )}
                  size={15}
                  weight="bold"
                />
              </button>

              <div
                aria-label="Client account menu"
                className={cn(
                  "absolute top-[calc(100%+0.7rem)] right-0 w-72 origin-top-right rounded-2xl border border-[var(--color-border)] bg-white p-2 shadow-[0_24px_65px_rgba(3,26,59,0.16)] transition",
                  isAccountMenuOpen
                    ? "visible scale-100 opacity-100"
                    : "invisible scale-95 opacity-0",
                )}
                role="menu"
              >
                <div className="flex items-center gap-3 rounded-xl bg-[#f4f8f6] p-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--color-ink)] text-xs font-extrabold text-white">
                    {initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold text-[var(--color-ink)]">
                      {displayName}
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-semibold text-[var(--color-text-muted)]">
                      {client.email}
                    </span>
                  </span>
                </div>
                <Link
                  className="mt-1.5 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-extrabold text-[var(--color-ink)] transition hover:bg-[var(--color-brand-soft)] hover:text-[var(--color-brand-hover)]"
                  href="/dashboard"
                  onClick={() => setIsAccountMenuOpen(false)}
                  role="menuitem"
                >
                  <SquaresFour aria-hidden="true" size={19} weight="duotone" />
                  Go to Dashboard
                </Link>
                <button
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-extrabold text-[#a74733] transition hover:bg-[#fff1ed] disabled:opacity-60"
                  disabled={isLoggingOut}
                  onClick={logoutClient}
                  role="menuitem"
                  type="button"
                >
                  {isLoggingOut ? (
                    <SpinnerGap aria-hidden="true" className="animate-spin" size={19} />
                  ) : (
                    <SignOut aria-hidden="true" size={19} weight="duotone" />
                  )}
                  {isLoggingOut ? "Logging out…" : "Log Out"}
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                className="rounded-xl px-5 py-3 text-[length:var(--text-nav)] font-bold text-[var(--color-ink-soft)] transition hover:bg-slate-100 hover:text-[var(--color-ink)]"
                href="/login"
              >
                Log In
              </Link>
              <Link
                className="rounded-xl bg-[var(--color-brand)] px-5 py-3 text-[length:var(--text-nav)] font-extrabold text-white shadow-[0_10px_28px_rgba(6,184,102,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)]"
                href="/register"
              >
                Open Account
              </Link>
            </div>
          )}

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            className="grid size-11 place-items-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-ink)] lg:hidden"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            {isOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>
      </Container>

      <nav
        aria-label="Mobile navigation"
        className={cn(
          "mobile-menu absolute inset-x-5 top-[6.25rem] max-h-[calc(100dvh-7.5rem)] overflow-y-auto rounded-3xl p-5 transition duration-300 sm:inset-x-8 lg:hidden",
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-3 opacity-0",
        )}
        id="mobile-navigation"
      >
        <div className="grid gap-1">
          {navigation.map((item) => {
            const isActive = isNavigationItemActive(item);

            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-xl px-4 py-3.5 text-base font-bold transition",
                  isActive
                    ? "bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]"
                    : "text-[var(--color-ink-soft)] hover:bg-slate-100 hover:text-[var(--color-ink)]",
                )}
                href={item.href}
                key={item.href}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
        {client ? (
          <div className="mt-4 border-t border-slate-200 pt-5">
            <div className="flex items-center gap-3 rounded-2xl bg-[#f4f8f6] p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[var(--color-ink)] text-sm font-extrabold text-white">
                {initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-extrabold text-[var(--color-ink)]">{displayName}</span>
                <span className="mt-0.5 block truncate text-xs font-semibold text-[var(--color-text-muted)]">{client.email}</span>
              </span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 py-3.5 font-extrabold text-white"
                href="/dashboard"
                onClick={() => setIsOpen(false)}
              >
                <SquaresFour aria-hidden="true" size={19} weight="duotone" />
                Dashboard
              </Link>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e7c1b7] px-5 py-3.5 font-extrabold text-[#a74733] disabled:opacity-60"
                disabled={isLoggingOut}
                onClick={logoutClient}
                type="button"
              >
                {isLoggingOut ? <SpinnerGap aria-hidden="true" className="animate-spin" size={19} /> : <SignOut aria-hidden="true" size={19} weight="duotone" />}
                {isLoggingOut ? "Logging out…" : "Log Out"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
            <Link
              className="rounded-xl border border-[var(--color-border)] px-5 py-3 text-center font-bold text-[var(--color-ink)]"
              href="/login"
              onClick={() => setIsOpen(false)}
            >
              Log In
            </Link>
            <Link
              className="rounded-xl bg-[var(--color-brand)] px-5 py-3 text-center font-extrabold text-white"
              href="/register"
              onClick={() => setIsOpen(false)}
            >
              Open Account
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
