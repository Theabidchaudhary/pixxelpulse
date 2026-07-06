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

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // STARTTLS
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });

    await transporter.sendMail({
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
    });
  } catch (e) {
    console.error("Lead email failed:", e);
    return {
      ok: false,
      error: `Something went wrong sending your message. Email us directly at ${site.email}.`,
    };
  }

  return { ok: true };
}
