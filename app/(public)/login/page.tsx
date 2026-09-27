import {
  ChartLineUp,
  CheckCircle,
  ClipboardText,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Log In to Your Account | TradeUply",
  description:
    "Log in to your TradeUply account to review investment plans, projected outcomes, and account activity.",
};

const accountFeatures = [
  { icon: ClipboardText, text: "Review your selected investment plans" },
  { icon: ChartLineUp, text: "Follow projected outcomes and plan durations" },
  { icon: CheckCircle, text: "Keep account activity in one clear view" },
] as const;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const requestedPath = (await searchParams).returnTo;
  const returnTo =
    requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
      ? requestedPath
      : "/dashboard";

  return (
    <main className="mt-[7.5rem] min-h-screen bg-[#f4f8f6] sm:mt-[8.5rem] lg:mt-36">
      <Container className="grid items-center gap-6 py-10 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:py-20 xl:grid-cols-2">
        <aside className="relative order-2 overflow-hidden rounded-[2rem] bg-[var(--color-ink)] p-7 text-white shadow-[0_30px_80px_rgba(3,26,59,0.18)] sm:p-10 lg:order-1 lg:p-12">
          <div aria-hidden="true" className="absolute -top-32 -right-24 size-72 rounded-full bg-[var(--color-brand)]/25 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-extrabold tracking-[0.2em] text-[#67e4a7] uppercase">
              Secure Account Access
            </p>
            <h2 className="mt-5 max-w-[12ch] text-[clamp(2rem,4vw,3.6rem)] leading-[1.08] font-extrabold tracking-[-0.05em]">
              Continue your investment journey.
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-7 font-medium text-white/62 sm:text-base">
              Access your account through one focused and straightforward login experience.
            </p>

            <ul className="mt-9 grid gap-3">
              {accountFeatures.map(({ icon: Icon, text }) => (
                <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4" key={text}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#67e4a7]/10 text-[#67e4a7]">
                    <Icon aria-hidden="true" size={21} weight="duotone" />
                  </span>
                  <span className="text-sm font-bold text-white/76">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex items-start gap-3 border-t border-white/10 pt-7">
              <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0 text-[#67e4a7]" size={24} weight="duotone" />
              <p className="text-xs leading-6 font-medium text-white/48">
                Never share your password. TradeUply support should never ask you to
                disclose it by email or phone.
              </p>
            </div>
          </div>
        </aside>

        <LoginForm returnTo={returnTo} />
      </Container>
    </main>
  );
}
