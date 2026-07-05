"use server";

import { z } from "zod";
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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL ?? site.email;

  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.LEAD_FROM ?? "Orvix Website <onboarding@resend.dev>",
          to: [to],
          reply_to: email,
          subject: `New project inquiry — ${projectType} — ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Project type: ${projectType}`,
            `Budget: ${budget || "not specified"}`,
            "",
            message,
          ].join("\n"),
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}`);
    } catch (e) {
      console.error("Lead email failed:", e);
      return {
        ok: false,
        error: `Something went wrong sending your message. Email us directly at ${to}.`,
      };
    }
  } else {
    // No email provider configured yet — log so the lead isn't silently lost in dev.
    console.log("[lead]", { name, email, projectType, budget, message });
  }

  return { ok: true };
}
