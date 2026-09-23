"use client";

import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeSlash,
  Key,
  SpinnerGap,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";

import { ApiRequestError, postJson } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

type Stage = "email" | "otp" | "password" | "success";
type OtpResponse = {
  data: {
    otp: { email: string; expiresAt: string; resendAvailableAt: string };
  };
  message: string;
  success: true;
};
type VerifyResponse = {
  data: { expiresAt: string; resetToken: string };
  message: string;
  success: true;
};

export function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [stage, setStage] = useState<Stage>("email");

  function requestErrorMessage(reason: unknown, fallback: string) {
    return reason instanceof ApiRequestError ? reason.message : fallback;
  }

  async function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const result = await postJson<OtpResponse, { email: string }>(
        API_ENDPOINTS.client.clientPasswordForgot,
        { email: email.trim() },
      );
      setMaskedEmail(result.data.otp.email);
      setStage("otp");
    } catch (reason) {
      setError(requestErrorMessage(reason, "The reset code could not be requested."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyResetOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const result = await postJson<VerifyResponse, { email: string; otp: string }>(
        API_ENDPOINTS.client.clientPasswordVerifyOtp,
        { email: email.trim(), otp },
      );
      setResetToken(result.data.resetToken);
      setOtp("");
      setStage("password");
    } catch (reason) {
      setError(requestErrorMessage(reason, "The verification code could not be verified."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await postJson<
        { message: string; success: true },
        { confirmPassword: string; email: string; password: string; resetToken: string }
      >(API_ENDPOINTS.client.clientPasswordReset, {
        confirmPassword,
        email: email.trim(),
        password,
        resetToken,
      });
      setConfirmPassword("");
      setPassword("");
      setResetToken("");
      setStage("success");
    } catch (reason) {
      setError(requestErrorMessage(reason, "Your password could not be reset."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[var(--color-ink)]/55 backdrop-blur-sm sm:items-center sm:p-5">
      <button aria-label="Close password reset" className="absolute inset-0" onClick={onClose} type="button" />
      <section aria-labelledby="forgot-password-title" aria-modal="true" className="relative max-h-[95dvh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] bg-white p-5 shadow-2xl sm:rounded-[1.75rem] sm:p-7" role="dialog">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.62rem] font-extrabold tracking-[0.14em] text-[var(--color-brand-hover)] uppercase">
              Account recovery
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-ink)]" id="forgot-password-title">
              {stage === "success" ? "Password updated" : "Reset your password"}
            </h2>
          </div>
          <button aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-xl border border-[var(--color-border)]" onClick={onClose} type="button">
            <X size={19} weight="bold" />
          </button>
        </div>

        {stage === "success" ? (
          <div className="py-9 text-center" role="status">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--color-brand-soft)] text-[var(--color-brand-hover)]">
              <CheckCircle size={38} weight="fill" />
            </span>
            <h3 className="mt-5 text-xl font-extrabold text-[var(--color-ink)]">Your password has been reset</h3>
            <p className="mt-3 text-sm leading-6 font-medium text-[var(--color-text-muted)]">
              You can now log in using your new password. A confirmation email has been sent to you.
            </p>
            <button className="mt-7 min-h-12 w-full rounded-xl bg-[var(--color-brand)] px-5 text-sm font-extrabold text-white" onClick={onClose} type="button">
              Return to Log In
            </button>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-3 gap-2" aria-label="Password reset progress">
              {["Email", "Verify", "Password"].map((label, index) => {
                const activeIndex = stage === "email" ? 0 : stage === "otp" ? 1 : 2;
                return (
                  <div key={label}>
                    <div className={`h-1.5 rounded-full ${index <= activeIndex ? "bg-[var(--color-brand)]" : "bg-slate-200"}`} />
                    <p className={`mt-2 text-center text-[0.58rem] font-extrabold ${index === activeIndex ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"}`}>{label}</p>
                  </div>
                );
              })}
            </div>

            {stage === "email" && (
              <form className="mt-7" onSubmit={requestOtp}>
                <p className="text-sm leading-6 font-medium text-[var(--color-text-muted)]">
                  Enter the email address registered to your active client account. We will verify it before sending a six-digit reset code.
                </p>
                <label className="mt-5 block text-xs font-extrabold text-[var(--color-ink)]" htmlFor="reset-email">
                  Email address
                </label>
                <input autoComplete="email" className="mt-2 h-13 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] px-4 text-sm font-bold outline-none focus:border-[var(--color-brand)]" id="reset-email" onChange={(event) => { setEmail(event.target.value); setError(""); }} required type="email" value={email} />
                <SubmitButton isSubmitting={isSubmitting} label="Send reset code" loadingLabel="Sending code…" />
              </form>
            )}

            {stage === "otp" && (
              <form className="mt-7" onSubmit={verifyResetOtp}>
                <p className="text-sm leading-6 font-medium text-[var(--color-text-muted)]">
                  Enter the code sent to <strong className="text-[var(--color-ink)]">{maskedEmail}</strong>. It expires in two minutes.
                </p>
                <label className="mt-5 block text-xs font-extrabold text-[var(--color-ink)]" htmlFor="reset-otp">Verification code</label>
                <input autoComplete="one-time-code" className="mt-2 h-14 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] px-4 text-center text-xl font-extrabold tracking-[0.35em] outline-none focus:border-[var(--color-brand)]" id="reset-otp" inputMode="numeric" maxLength={6} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} pattern="\d{6}" required value={otp} />
                <SubmitButton isSubmitting={isSubmitting} label="Verify code" loadingLabel="Verifying…" />
                <button className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 text-xs font-extrabold text-[var(--color-muted)]" onClick={() => { setStage("email"); setOtp(""); setError(""); }} type="button">
                  <ArrowLeft size={15} weight="bold" /> Change email
                </button>
              </form>
            )}

            {stage === "password" && (
              <form className="mt-7" onSubmit={resetPassword}>
                <p className="text-sm leading-6 font-medium text-[var(--color-text-muted)]">
                  Create a password with at least eight characters, including uppercase, lowercase, and a number.
                </p>
                <PasswordField id="reset-new-password" label="New password" onChange={(value) => { setPassword(value); setError(""); }} show={showPasswords} value={password} />
                <PasswordField id="reset-confirm-password" label="Re-enter password" onChange={(value) => { setConfirmPassword(value); setError(""); }} show={showPasswords} value={confirmPassword} />
                <button className="mt-3 flex items-center gap-2 text-xs font-extrabold text-[var(--color-muted)]" onClick={() => setShowPasswords((current) => !current)} type="button">
                  {showPasswords ? <EyeSlash size={16} /> : <Eye size={16} />}
                  {showPasswords ? "Hide passwords" : "Show passwords"}
                </button>
                <SubmitButton isSubmitting={isSubmitting} label="Reset Password" loadingLabel="Resetting password…" />
              </form>
            )}

            {error && (
              <div aria-live="polite" className="mt-5 flex gap-3 rounded-xl bg-[#fff1ed] p-4 text-[var(--color-danger)]">
                <WarningCircle className="shrink-0" size={19} />
                <p className="text-xs leading-5 font-bold">{error}</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function PasswordField({ id, label, onChange, show, value }: { id: string; label: string; onChange: (value: string) => void; show: boolean; value: string }) {
  return (
    <label className="mt-5 block text-xs font-extrabold text-[var(--color-ink)]" htmlFor={id}>
      {label}
      <div className="relative mt-2">
        <Key className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--color-muted)]" size={18} />
        <input autoComplete="new-password" className="h-13 w-full rounded-xl border border-[var(--color-border)] bg-[#f8faf9] pr-4 pl-11 text-sm font-bold outline-none focus:border-[var(--color-brand)]" id={id} minLength={8} onChange={(event) => onChange(event.target.value)} required type={show ? "text" : "password"} value={value} />
      </div>
    </label>
  );
}

function SubmitButton({ isSubmitting, label, loadingLabel }: { isSubmitting: boolean; label: string; loadingLabel: string }) {
  return (
    <button className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-5 text-sm font-extrabold text-white disabled:cursor-wait disabled:opacity-70" disabled={isSubmitting} type="submit">
      {isSubmitting && <SpinnerGap className="animate-spin" size={18} />}
      {isSubmitting ? loadingLabel : label}
    </button>
  );
}
