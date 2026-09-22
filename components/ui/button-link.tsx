import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  children: ReactNode;
  className?: string;
  href: string;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  children,
  className,
  href,
  variant = "primary",
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-15 items-center justify-center rounded-xl px-7 py-3.5 text-[length:var(--text-button)] font-bold transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-brand)]",
        variant === "primary"
          ? "bg-[var(--color-brand)] text-white shadow-[0_14px_36px_rgba(6,184,102,0.2)] hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)]"
          : "border border-[var(--color-brand)] bg-white/80 text-[var(--color-ink)] hover:-translate-y-0.5 hover:bg-[var(--color-brand-soft)]",
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
