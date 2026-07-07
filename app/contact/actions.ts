"use server";

import { z } from "zod";
import nodemailer from "nodemailer";
import { site } from "@/content/site";

const schema = z.object({
  name: z.string().min(2, "Please tell us your name."),
  email: z.string().email("That email doesn't look right."),
  projectType: z.string().min(1, "Pick a project type."),
  budget: z.string().optional(),
  message: z.string().min(10, "Give us a couple of sentences about the project."),
  // Honeypot — humans never fill this
  company_website: z.string().max(0).optional(),
});

export type ContactState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

// Gmail SMTP — same account/app-password flow the previous PHPMailer site used.
// Override via env (GMAIL_USER / GMAIL_APP_PASSWORD / LEAD_EMAIL) in production.
const GMAIL_USER = process.env.GMAIL_USER ?? "Theabidchaudhary@gmail.com";
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD ?? "xsfo tkur xuwf msmv").replace(/\s+/g, "");

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  // Honeypot tripped: pretend success, send nothing.
  if (raw.company_website) return { ok: true };

  const { name, email, projectType, budget, message } = parsed.data;
  const to = process.env.LEAD_EMAIL ?? GMAIL_USER ?? site.email;

  const mail = {
    from: `"${site.name} Website" <${GMAIL_USER}>`,
    to,
    replyTo: email,
    subject: `New project inquiry — ${projectType} — ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Project type: ${projectType}`,
      `Budget: ${budget || "not specified"}`,
      "",
      message,
    ].join("\n"),
  };

  // Implicit-TLS 465 first (most reliable from serverless), STARTTLS 587 as
  // fallback. Tight timeouts so a blocked port fails over quickly instead of
  // hitting the function's execution limit.
  const configs = [
    { host: "smtp.gmail.com", port: 465, secure: true },
    { host: "smtp.gmail.com", port: 587, secure: false },
  ];

  let lastError: unknown;
  for (const cfg of configs) {
    try {
      const transporter = nodemailer.createTransport({
        ...cfg,
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 12000,
      });
      await transporter.sendMail(mail);
      return { ok: true };
    } catch (e) {
      lastError = e;
      const err = e as { code?: string; responseCode?: number; message?: string };
      console.error(
        `Lead email failed via ${cfg.host}:${cfg.port} —`,
        err.code,
        err.responseCode,
        err.message
      );
      // Auth failures won't succeed on another port; stop early.
      if (err.code === "EAUTH" || err.responseCode === 535) break;
    }
  }

  const authFailed = (lastError as { code?: string } | undefined)?.code === "EAUTH";
  return {
    ok: false,
    error: authFailed
      ? `Our mail service is being reconfigured right now. Please email us directly at ${site.email} — we reply within 12 hours.`
      : `Something went wrong sending your message. Email us directly at ${site.email}.`,
  };
}
