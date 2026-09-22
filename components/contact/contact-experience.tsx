"use client";

import {
  ArrowRight,
  ClipboardText,
  EnvelopeSimple,
  Headset,
  ShieldWarning,
  UserCircle,
  Wallet,
  WarningCircle,
} from "@phosphor-icons/react";
import { useState, type FormEvent } from "react";

import { supportEmail } from "@/data/company";
import {
  type ContactData,
  type ContactErrors,
  validateContactForm,
} from "@/lib/contact-validation";

const supportCategories = [
  { icon: UserCircle, label: "Account Access" },
  { icon: ClipboardText, label: "Investment Plans" },
  { icon: Wallet, label: "Deposits and Withdrawals" },
  { icon: Headset, label: "General Support" },
] as const;

const initialData: ContactData = {
  email: "",
  fullName: "",
  message: "",
  subject: "",
};

export function ContactExperience() {
  const [data, setData] = useState<ContactData>(initialData);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof ContactData>(field: K, value: ContactData[K]) {
    setData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateContactForm(data);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);
  }

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
      <aside className="relative order-2 overflow-hidden rounded-[2rem] bg-[var(--color-ink)] p-6 text-white shadow-[0_30px_80px_rgba(3,26,59,0.18)] sm:p-9 lg:order-1 lg:p-10">
        <div aria-hidden="true" className="absolute -top-36 -right-28 size-80 rounded-full bg-[var(--color-brand)]/25 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-extrabold tracking-[0.18em] text-[#67e4a7] uppercase">
            Select a Topic
          </p>
          <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.035em]">
            What can we help you with?
          </h2>
          <p className="mt-4 text-sm leading-7 font-medium text-white/58">
            Choose a category to prepare the form, or select a subject directly from the form.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {supportCategories.map(({ icon: Icon, label }) => {
              const isSelected = data.subject === label;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`flex min-h-20 items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                    isSelected
                      ? "border-[#67e4a7]/40 bg-[#67e4a7]/10 text-white"
                      : "border-white/10 bg-white/[0.055] text-white/70 hover:border-white/20 hover:bg-white/[0.08]"
                  }`}
                  key={label}
                  onClick={() => updateField("subject", label)}
                  type="button"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#67e4a7]/10 text-[#67e4a7]">
                    <Icon aria-hidden="true" size={21} weight="duotone" />
                  </span>
                  <span className="text-xs leading-5 font-extrabold">{label}</span>
                </button>
              );
            })}
          </div>

          <a
            className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm font-extrabold text-white transition hover:bg-white/[0.08]"
            href={`mailto:${supportEmail}`}
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#67e4a7]/10 text-[#67e4a7]">
              <EnvelopeSimple aria-hidden="true" size={21} weight="duotone" />
            </span>
            {supportEmail}
          </a>

          <div className="mt-7 flex items-start gap-3 border-t border-white/10 pt-7">
            <ShieldWarning aria-hidden="true" className="mt-0.5 shrink-0 text-[#e1bd74]" size={23} weight="duotone" />
            <p className="text-xs leading-6 font-medium text-white/48">
              Never include your password, verification code, private key, or complete
              payment information in a support message.
            </p>
          </div>
        </div>
      </aside>

      <section className="order-1 rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-[0_26px_75px_rgba(18,45,72,0.1)] sm:p-9 lg:order-2 lg:p-10" aria-labelledby="contact-form-title">
        <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--color-brand-hover)] uppercase">
          Send an Enquiry
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-[var(--color-ink)]" id="contact-form-title">
          Contact the TradeUply team
        </h2>
        <p className="mt-4 text-sm leading-6 font-medium text-[var(--color-text-muted)]">
          Complete the form below with enough detail for the support team to understand your question.
        </p>

        <form className="mt-8" noValidate onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <ContactInput error={errors.fullName} id="contact-name" label="Full name" onChange={(value) => updateField("fullName", value)} value={data.fullName} />
            <ContactInput error={errors.email} id="contact-email" inputMode="email" label="Email address" onChange={(value) => updateField("email", value)} placeholder="name@example.com" type="email" value={data.email} />
          </div>

          <div className="mt-5">
            <label className="text-sm font-extrabold text-[var(--color-ink)]" htmlFor="contact-subject">
              Subject
            </label>
            <select
              aria-describedby={errors.subject ? "contact-subject-error" : undefined}
              aria-invalid={Boolean(errors.subject)}
              className={`mt-2.5 h-13 w-full rounded-xl border bg-[#f8faf9] px-4 text-sm font-bold text-[var(--color-ink)] outline-none transition focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 ${errors.subject ? "border-[#dc765a]" : "border-[var(--color-border)]"}`}
              id="contact-subject"
              onChange={(event) => updateField("subject", event.target.value)}
              value={data.subject}
            >
              <option value="">Select a subject</option>
              {supportCategories.map(({ label }) => <option key={label} value={label}>{label}</option>)}
            </select>
            {errors.subject && <ErrorMessage id="contact-subject-error">{errors.subject}</ErrorMessage>}
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-extrabold text-[var(--color-ink)]" htmlFor="contact-message">
                Message
              </label>
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">{data.message.length}/1200</span>
            </div>
            <textarea
              aria-describedby={errors.message ? "contact-message-error" : "contact-message-help"}
              aria-invalid={Boolean(errors.message)}
              className={`mt-2.5 min-h-40 w-full resize-y rounded-xl border bg-[#f8faf9] p-4 text-sm leading-6 font-medium text-[var(--color-ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 ${errors.message ? "border-[#dc765a]" : "border-[var(--color-border)]"}`}
              id="contact-message"
              maxLength={1200}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Tell us how we can help..."
              value={data.message}
            />
            {errors.message ? (
              <ErrorMessage id="contact-message-error">{errors.message}</ErrorMessage>
            ) : (
              <p className="mt-2 text-xs font-semibold text-[var(--color-text-muted)]" id="contact-message-help">
                Include at least 20 characters, but do not include sensitive credentials.
              </p>
            )}
          </div>

          {submitted && (
            <div aria-live="polite" className="mt-6 flex items-start gap-3 rounded-2xl border border-[#d5a553]/30 bg-[#fff8e9] p-4 text-[#704d16]">
              <WarningCircle aria-hidden="true" className="mt-0.5 shrink-0" size={21} weight="duotone" />
              <p className="text-xs leading-5 font-semibold">
                Your enquiry passed frontend validation, but no message was transmitted.
                Secure support submission will be enabled after TradeUply’s first-party
                support service is connected.
              </p>
            </div>
          )}

          <button className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-brand)] px-6 text-sm font-extrabold text-white shadow-[0_14px_34px_rgba(6,184,102,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--color-brand-hover)] sm:w-auto" type="submit">
            Submit Enquiry
            <ArrowRight aria-hidden="true" size={17} weight="bold" />
          </button>
        </form>
      </section>
    </div>
  );
}

type ContactInputProps = {
  error?: string;
  id: string;
  inputMode?: "email" | "text";
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "email" | "text";
  value: string;
};

function ContactInput({ error, id, inputMode, label, onChange, placeholder, type = "text", value }: ContactInputProps) {
  return (
    <div>
      <label className="text-sm font-extrabold text-[var(--color-ink)]" htmlFor={id}>{label}</label>
      <input aria-describedby={error ? `${id}-error` : undefined} aria-invalid={Boolean(error)} className={`mt-2.5 h-13 w-full rounded-xl border bg-[#f8faf9] px-4 text-sm font-bold text-[var(--color-ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-brand)] focus:ring-4 focus:ring-[var(--color-brand)]/10 ${error ? "border-[#dc765a]" : "border-[var(--color-border)]"}`} id={id} inputMode={inputMode} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} value={value} />
      {error && <ErrorMessage id={`${id}-error`}>{error}</ErrorMessage>}
    </div>
  );
}

function ErrorMessage({ children, id }: { children: string; id: string }) {
  return <p className="mt-2 text-xs font-semibold text-[#b94f32]" id={id}>{children}</p>;
}
