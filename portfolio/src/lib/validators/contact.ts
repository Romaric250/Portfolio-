import { z } from "zod";

export const PROJECT_TYPES = [
  "Website for an organisation / NGO",
  "SME or business website",
  "Personal / portfolio website",
  "Backend or API development",
  "Health-tech / interoperability system",
  "AI-powered product",
  "Something else",
] as const;

export const BUDGET_RANGES = [
  "Under $500",
  "$500 – $1,500",
  "$1,500 – $5,000",
  "$5,000 – $15,000",
  "$15,000+",
  "Not sure yet",
] as const;

export const TIMELINES = ["ASAP", "Within 1 month", "1–3 months", "3+ months", "Flexible"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell me your name").max(120),
  email: z.email("Enter a valid email address").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "A few more words would help").max(5000),
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")), // honeypot
  sourcePath: z.string().max(300).optional(),
});

export const inquirySchema = z.object({
  projectType: z.enum(PROJECT_TYPES),
  goals: z.string().trim().min(10, "Describe what success looks like").max(4000),
  budget: z.enum(BUDGET_RANGES),
  timeline: z.enum(TIMELINES),
  name: z.string().trim().min(2, "Please tell me your name").max(120),
  email: z.email("Enter a valid email address").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")), // honeypot
  sourcePath: z.string().max(300).optional(),
});

export const subscribeSchema = z.object({
  email: z.email("Enter a valid email address").max(200),
  website: z.string().max(0).optional().or(z.literal("")),
  source: z.string().max(100).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type SubscribeInput = z.infer<typeof subscribeSchema>;
