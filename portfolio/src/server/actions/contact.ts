"use server";

import { prisma } from "@/lib/db/prisma";
import { contactSchema, inquirySchema, subscribeSchema } from "@/lib/validators/contact";
import { getClientIp, getUserAgent, rateLimit } from "@/lib/rate-limit";
import { notifyOwner } from "@/lib/email";

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function fieldErrors(issues: Array<{ path: PropertyKey[]; message: string }>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? "form");
    (out[k] ??= []).push(i.message);
  }
  return out;
}

export async function submitContact(input: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error.issues) };
  const data = parsed.data;
  if (data.website) return { ok: true }; // honeypot: pretend success

  const ip = await getClientIp();
  const rl = await rateLimit(`contact:${ip}`, 5, 60 * 60);
  if (!rl.ok) return { ok: false, error: "Too many messages from this network. Please try again in an hour." };

  try {
    await prisma.contactMessage.create({
      data: {
        kind: "CONTACT",
        name: data.name,
        email: data.email,
        company: data.company || null,
        subject: data.subject || null,
        message: data.message,
        ip,
        userAgent: await getUserAgent(),
        sourcePath: data.sourcePath ?? null,
      },
    });
  } catch (error) {
    console.error("[contact]", error);
    return { ok: false, error: "Something went wrong saving your message. Please email me directly." };
  }

  void notifyOwner({
    subject: `New message from ${data.name}`,
    text: `From: ${data.name} <${data.email}>\nCompany: ${data.company || "-"}\nSubject: ${data.subject || "-"}\n\n${data.message}`,
    replyTo: data.email,
  });
  return { ok: true };
}

export async function submitInquiry(input: unknown): Promise<ActionResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error.issues) };
  const data = parsed.data;
  if (data.website) return { ok: true };

  const ip = await getClientIp();
  const rl = await rateLimit(`inquiry:${ip}`, 5, 60 * 60);
  if (!rl.ok) return { ok: false, error: "Too many requests from this network. Please try again later." };

  try {
    await prisma.contactMessage.create({
      data: {
        kind: "PROJECT_INQUIRY",
        name: data.name,
        email: data.email,
        company: data.company || null,
        subject: data.projectType,
        message: data.goals,
        projectType: data.projectType,
        goals: data.goals,
        budget: data.budget,
        timeline: data.timeline,
        ip,
        userAgent: await getUserAgent(),
        sourcePath: data.sourcePath ?? null,
      },
    });
  } catch (error) {
    console.error("[inquiry]", error);
    return { ok: false, error: "Something went wrong. Please email me directly." };
  }

  void notifyOwner({
    subject: `New project inquiry: ${data.projectType} (${data.budget})`,
    text: `From: ${data.name} <${data.email}>\nCompany: ${data.company || "-"}\nType: ${data.projectType}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\n\nGoals:\n${data.goals}`,
    replyTo: data.email,
  });
  return { ok: true };
}

export async function subscribeNewsletter(input: unknown): Promise<ActionResult> {
  const parsed = subscribeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Enter a valid email address." };
  if (parsed.data.website) return { ok: true };
  const ip = await getClientIp();
  const rl = await rateLimit(`subscribe:${ip}`, 5, 60 * 60);
  if (!rl.ok) return { ok: false, error: "Too many attempts. Try again later." };
  try {
    await prisma.subscriber.upsert({
      where: { email: parsed.data.email.toLowerCase() },
      create: { email: parsed.data.email.toLowerCase(), source: parsed.data.source ?? null, confirmed: true },
      update: { unsubscribedAt: null },
    });
    return { ok: true };
  } catch (error) {
    console.error("[subscribe]", error);
    return { ok: false, error: "Could not subscribe right now." };
  }
}
