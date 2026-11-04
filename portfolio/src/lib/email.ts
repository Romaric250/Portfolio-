import "server-only";
import { env, features } from "@/lib/env";

type Mail = { subject: string; text: string; html?: string; replyTo?: string };

/** Optional Resend notifications. No-op when RESEND_API_KEY / CONTACT_TO_EMAIL are absent. */
export async function notifyOwner(mail: Mail): Promise<void> {
  if (!features.resend || !env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) return;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Portfolio <notifications@rlonfonyuy.online>",
      to: env.CONTACT_TO_EMAIL,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      replyTo: mail.replyTo,
    });
  } catch (error) {
    console.error("[email]", error instanceof Error ? error.message : error);
  }
}
