import { z } from "zod";

/**
 * Fails fast at boot when a required variable is missing or malformed.
 * Server-only. Never import this from a client component.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  UPLOADTHING_TOKEN: z.string().min(1, "UPLOADTHING_TOKEN is required"),
  NEXT_PUBLIC_SITE_URL: z.url().default("https://rlonfonyuy.online"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 chars"),
  AUTH_URL: z.url().optional(),
  ADMIN_SECRET_KEY: z.string().min(12, "ADMIN_SECRET_KEY must be at least 12 chars"),
  ADMIN_GATE_JWT_SECRET: z.string().min(16, "ADMIN_GATE_JWT_SECRET must be at least 16 chars"),
  ADMIN_EMAIL: z.email().optional(),
  ADMIN_PASSWORD_HASH: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  GOOGLE_SITE_VERIFICATION: z.string().optional(),
  BING_SITE_VERIFICATION: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_TO_EMAIL: z.email().optional(),
  NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS: z
    .string()
    .optional()
    .transform((v) => v === "true" || v === "1"),
});

export type ServerEnv = z.infer<typeof serverSchema>;

function emptyToUndefined(record: NodeJS.ProcessEnv): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(record)) out[k] = v === "" ? undefined : v;
  return out;
}

function load(): ServerEnv {
  const parsed = serverSchema.safeParse(emptyToUndefined(process.env));
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`❌ Invalid environment variables:\n${issues}\n\nCopy .env.example to .env and fill the values.`);
  }
  return parsed.data;
}

export const env: ServerEnv = load();

export const isProd = env.NODE_ENV === "production";
export const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
export const features = {
  resend: Boolean(env.RESEND_API_KEY && env.CONTACT_TO_EMAIL),
  vercelAnalytics: env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS,
  github: true,
} as const;
