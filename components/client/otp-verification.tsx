"use client";

import {
  ArrowRight,
  CheckCircle,
  CircleNotch,
  EnvelopeSimple,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import { ApiRequestError, postJson } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  OtpDelivery,
  ResendOtpResponse,
  VerifyOtpResponse,
} from "@/lib/api/types";

const otpLength = 6;
const otpPurpose = "email_verification";

function secondsUntil(timestamp: string) {
  return Math.max(0, Math.ceil((Date.parse(timestamp) - Date.now()) / 1000));
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

type ClientOtpVerificationProps = {
  delivery: OtpDelivery;
  email: string;
  onVerified: (response: VerifyOtpResponse) => void;
};

export function OtpVerification({ delivery: initialDelivery, email, onVerified }: ClientOtpVerificationProps) {
  const [delivery, setDelivery] = useState(initialDelivery);
  const [digits, setDigits] = useState(() => Array<string>(otpLength).fill(""));
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(() => secondsUntil(initialDelivery.expiresAt));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining(secondsUntil(delivery.expiresAt));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [delivery.expiresAt]);

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => current.map((item, itemIndex) => (itemIndex === index ? digit : item)));
    setError("");

    if (digit && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < otpLength - 1) inputRefs.current[index + 1]?.focus();
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpLength);

    if (!pastedDigits) return;

    event.preventDefault();
    setDigits(Array.from({ length: otpLength }, (_, index) => pastedDigits[index] ?? ""));
    inputRefs.current[Math.min(pastedDigits.length, otpLength) - 1]?.focus();
    setError("");
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const otp = digits.join("");

    if (otp.length !== otpLength) {
      setError("Enter the complete six-digit verification code.");
      return;
    }

    setError("");
    setIsVerifying(true);

    try {
      const response = await postJson<VerifyOtpResponse, { email: string; otp: string; purpose: string }>(
        API_ENDPOINTS.client.verifyOtp,
        { email, otp, purpose: otpPurpose },
      );
      onVerified(response);
    } catch (reason) {
      setError(
        reason instanceof ApiRequestError
          ? reason.message
          : "The code could not be verified. Please try again.",
      );
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (secondsUntil(delivery.resendAvailableAt) > 0 || isResending) return;

    setError("");
    setIsResending(true);

    try {
      const response = await postJson<ResendOtpResponse, { email: string; purpose: string }>(
        API_ENDPOINTS.client.resendOtp,
        { email, purpose: otpPurpose },
      );
      setDelivery(response.data.otp);
      setSecondsRemaining(secondsUntil(response.data.otp.expiresAt));
      setDigits(Array<string>(otpLength).fill(""));
      inputRefs.current[0]?.focus();
    } catch (reason) {
      setError(
        reason instanceof ApiRequestError
          ? reason.message
          : "A new code could not be sent. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  }

  const resendRemaining = secondsUntil(delivery.resendAvailableAt);
  const canResend = resendRemaining === 0;

  return (
    <div className="mt-9" aria-labelledby="otp-title">
      <div className="rounded-[1.75rem] border border-[var(--color-brand)]/20 bg-[linear-gradient(145deg,#f3fbf7_0%,#ffffff_70%)] p-5 sm:p-7">
        <span className="grid size-14 place-items-center rounded-2xl bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
          <EnvelopeSimple aria-hidden="true" size={29} weight="duotone" />
        </span>
        <p className="mt-6 text-xs font-extrabold tracking-[0.16em] text-[var(--color-brand-hover)] uppercase">Email verification</p>
        <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-[var(--color-ink)]" id="otp-title">Enter your verification code</h3>
        <p className="mt-3 text-sm leading-6 font-medium text-[var(--color-text-muted)]">
          We sent a six-digit code to <strong className="text-[var(--color-ink)]">{delivery.email}</strong>. The code is valid for two minutes.
        </p>

        <form aria-busy={isVerifying} className="mt-7" onSubmit={handleVerify}>
          <div aria-label="Six-digit verification code" className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handlePaste} role="group">
            {digits.map((digit, index) => (
              <input
                aria-label={`Verification code digit ${index + 1}`}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                className="aspect-square min-w-0 rounded-xl border border-[var(--color-border)] bg-white text-center text-xl font-extrabold text-[var(--color-ink)] outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 sm:text-2xl"
                disabled={isVerifying}
                inputMode="numeric"
                key={index}
                maxLength={1}
                onChange={(event) => updateDigit(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                ref={(element) => { inputRefs.current[index] = element; }}
                value={digit}
              />
            ))}
          </div>

          {error && (
            <p className="mt-4 flex items-start gap-2 rounded-xl border border-[#efc1b3] bg-[#fff8f5] px-4 py-3 text-xs leading-5 font-bold text-[#a83f26]" role="alert">
              <WarningCircle aria-hidden="true" className="mt-0.5 shrink-0" size={17} weight="fill" />
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-4 text-xs font-bold text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck aria-hidden="true" className="text-[var(--color-brand-hover)]" size={17} weight="duotone" />
              {secondsRemaining > 0 ? `Code expires in ${formatTime(secondsRemaining)}` : "Code expired"}
            </span>
            <button className="font-extrabold text-[var(--color-brand-hover)] disabled:cursor-not-allowed disabled:text-slate-400" disabled={!canResend || isResending} onClick={handleResend} type="button">
              {isResending ? "Sending…" : canResend ? "Resend code" : `Resend in ${formatTime(resendRemaining)}`}
            </button>
          </div>

          <button className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)] disabled:cursor-wait disabled:translate-y-0 disabled:opacity-75" disabled={isVerifying} type="submit">
            {isVerifying ? (
              <><CircleNotch aria-hidden="true" className="animate-spin" size={19} weight="bold" />Verifying code…</>
            ) : (
              <>Verify Email<ArrowRight aria-hidden="true" size={17} weight="bold" /></>
            )}
          </button>
        </form>
      </div>

      <p className="mt-5 flex items-start gap-2 text-xs leading-5 font-semibold text-[var(--color-text-muted)]">
        <CheckCircle aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--color-brand-hover)]" size={16} weight="fill" />
        For your security, TradeUply will never ask you to share this code by phone, chat, or email.
      </p>
    </div>
  );
}
