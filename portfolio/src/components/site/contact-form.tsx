"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { submitContact } from "@/server/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactFormProps = {
  bookingUrl?: string | null;
};

export function ContactForm({ bookingUrl }: ContactFormProps) {
  const pathname = usePathname();
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const result = await submitContact({
      name: fd.get("name"),
      email: fd.get("email"),
      company: fd.get("company"),
      subject: fd.get("subject"),
      message: fd.get("message"),
      website: fd.get("website"),
      sourcePath: pathname,
    });
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Message sent — I'll reply soon.");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="hidden" aria-hidden>
        <Label htmlFor="website">Website</Label>
        <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>
      <div>
        <Label htmlFor="company">Company (optional)</Label>
        <Input id="company" name="company" autoComplete="organization" />
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required rows={6} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="accent" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Send message
        </Button>
        {bookingUrl ? (
          <Button type="button" variant="outline" asChild>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
              Book a call
            </a>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
