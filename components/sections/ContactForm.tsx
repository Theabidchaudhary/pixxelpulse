"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { submitContact, type ContactState } from "@/app/contact/actions";
import { cn } from "@/lib/utils";

const initial: ContactState = { ok: false };

const inputCls =
  "w-full rounded-xl border border-line bg-ink-800 px-4.5 py-3.5 text-[0.95rem] text-fg placeholder:text-fg-faint outline-none transition-all duration-300 hover:border-line-strong focus:border-pulse-blue focus:shadow-[0_0_0_3px_rgba(77,141,255,0.15)]";

function Field({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2.5 block text-sm font-medium text-fg-soft">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-2 text-sm text-[#f87171]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);

  if (state.ok) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="panel flex flex-col items-start p-10"
        role="status"
      >
        <span
          className="mb-6 flex size-12 items-center justify-center rounded-full"
          style={{ background: "var(--gradient-pulse)" }}
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 4.5l-7 7L3 8" stroke="#060709" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3 className="text-h3">Brief received.</h3>
        <p className="mt-3 max-w-md leading-relaxed text-fg-soft">
          We reply to every project inquiry within 12 hours — usually much faster. Keep an eye on
          your inbox.
        </p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" error={state.fieldErrors?.name}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            className={inputCls}
            placeholder="Jane Creator"
            aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          />
        </Field>
        <Field label="Email" htmlFor="email" error={state.fieldErrors?.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={inputCls}
            placeholder="jane@company.com"
            aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Project type" htmlFor="projectType" error={state.fieldErrors?.projectType}>
          <select id="projectType" name="projectType" required className={cn(inputCls, "appearance-none")}>
            <option value="">Select…</option>
            <option>Short-form content</option>
            <option>YouTube / long-form</option>
            <option>Motion design & animation</option>
            <option>Video ads</option>
            <option>Podcast post-production</option>
            <option>Agency partnership</option>
            <option>Something else</option>
          </select>
        </Field>
        <Field label="Monthly budget (optional)" htmlFor="budget">
          <select id="budget" name="budget" className={cn(inputCls, "appearance-none")}>
            <option value="">Prefer not to say</option>
            <option>Under $1,000</option>
            <option>$1,000 – $3,000</option>
            <option>$3,000 – $10,000</option>
            <option>$10,000+</option>
          </select>
        </Field>
      </div>

      <Field label="About the project" htmlFor="message" error={state.fieldErrors?.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={inputCls}
          placeholder="What are you making, where will it live, and when do you need it?"
          aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
        />
      </Field>

      {/* Honeypot */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="company_website">Leave this empty</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-[#f87171]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group inline-flex items-center gap-2 rounded-full bg-fg px-8 py-4 text-[0.95rem] font-medium text-ink-950 transition-all duration-500 hover:shadow-[0_0_40px_rgba(124,106,247,0.45)] disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send the brief"}
        {!pending && (
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
            <path d="M2 8h11m0 0L8.5 3.5M13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <p className="text-xs text-fg-faint">We reply within 12 hours. No newsletters, no spam.</p>
    </form>
  );
}
