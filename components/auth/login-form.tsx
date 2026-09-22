"use client";

import {
  ArrowRight,
  Eye,
  EyeSlash,
  LockKey,
  SpinnerGap,
  WarningCircle,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { postJson, ApiRequestError } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ClientLoginResponse } from "@/lib/api/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginErrors = {
  email?: string;
  password?: string;
};

export function LoginForm({ returnTo = "/dashboard" }: { returnTo?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: LoginErrors = {};

    if (!emailPattern.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setApiError("");
    setIsSubmitting(true);

    try {
      await postJson<ClientLoginResponse, { email: string; password: string }>(
        API_ENDPOINTS.client.clientLogin,
        { email: email.trim(), password },
      );
      router.replace(returnTo);
      router.refresh();
    } catch (error) {
      setApiError(
        error instanceof ApiRequestError
          ? error.message
          : "We could not log you in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="login-form-title"
      className="order-1 rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_26px_75px_rgba(18,45,72,0.1)] sm:p-9 lg:order-2 lg:p-11"
    >
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--color-brand-hover)] uppercase">
            Account Login
          </p>
          <h1
            className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-[-0.04em] text-[var(--color-ink)]"
            id="login-form-title"
          >
            Welcome back
          </h1>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
          <LockKey aria-hidden="true" size={25} weight="duotone" />
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 font-medium text-[var(--color-text-muted)]">
        Enter your registered email address and password to access your account.
      </p>

      <form className="mt-8" noValidate onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-extrabold text-[var(--color-ink)]" htmlFor="login-email">
            Email address
          </label>
          <input
            aria-describedby={errors.email ? "login-email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className={`mt-2.5 h-14 w-full rounded-xl border bg-[#f8faf9] px-4 text-sm font-bold text-[var(--color-ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 ${
              errors.email ? "border-[#dc765a]" : "border-[var(--color-border)]"
            }`}
            id="login-email"
            inputMode="email"
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors((current) => ({ ...current, email: undefined }));
              setApiError("");
            }}
            placeholder="name@example.com"
            type="email"
            value={email}
          />
          {errors.email && (
            <p className="mt-2 text-xs font-semibold text-[#b94f32]" id="login-email-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label className="text-sm font-extrabold text-[var(--color-ink)]" htmlFor="login-password">
            Password
          </label>
          <div className="relative mt-2.5">
            <input
              aria-describedby={errors.password ? "login-password-error" : undefined}
              aria-invalid={Boolean(errors.password)}
              autoComplete="current-password"
              className={`h-14 w-full rounded-xl border bg-[#f8faf9] pr-12 pl-4 text-sm font-bold text-[var(--color-ink)] outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 ${
                errors.password ? "border-[#dc765a]" : "border-[var(--color-border)]"
              }`}
              id="login-password"
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: undefined }));
                setApiError("");
              }}
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-lg text-[var(--color-text-muted)] transition hover:bg-slate-100"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? (
                <EyeSlash aria-hidden="true" size={20} />
              ) : (
                <Eye aria-hidden="true" size={20} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-xs font-semibold text-[#b94f32]" id="login-password-error">
              {errors.password}
            </p>
          )}
        </div>

        {apiError && (
          <div
            aria-live="polite"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-[#d5a553]/30 bg-[#fff8e9] p-4 text-[#704d16]"
          >
            <WarningCircle aria-hidden="true" className="mt-0.5 shrink-0" size={21} weight="duotone" />
            <p className="text-xs leading-5 font-semibold">{apiError}</p>
          </div>
        )}

        <button
          className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(6,184,102,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)]"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Logging in…" : "Log In"}
          {isSubmitting ? (
            <SpinnerGap aria-hidden="true" className="animate-spin" size={18} />
          ) : (
            <ArrowRight aria-hidden="true" size={17} weight="bold" />
          )}
        </button>

        <p className="mt-6 text-center text-sm font-semibold text-[var(--color-text-muted)]">
          Don&apos;t have an account?{" "}
          <Link className="font-extrabold text-[var(--color-brand-hover)] hover:underline" href="/register">
            Open an account
          </Link>
        </p>
      </form>
    </section>
  );
}
