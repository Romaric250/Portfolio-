"use client";

import * as React from "react";
import { CheckIcon, Loader2Icon, SendIcon } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/server/actions/contact";
import { cn } from "@/lib/utils";

export function NewsletterForm({ source, compact, className }: { source: string; compact?: boolean; className?: string }) {
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const id = React.useId();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await subscribeNewsletter({ email, website, source });
      if (res.ok) {
        setDone(true);
        toast.success("You're on the list.");
      } else toast.error(res.error);
    });
  };

  if (done) {
    return (
      <p className={cn("inline-flex items-center gap-2 text-sm text-accent", className)}>
        <CheckIcon className="size-4" /> Subscribed. Thank you.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex w-full gap-2", className)}>
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <Input
        id={`${id}-email`}
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn(compact && "h-9 text-xs")}
      />
      <div className="hidden" aria-hidden>
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <Button type="submit" size={compact ? "sm" : "default"} disabled={pending} aria-label="Subscribe">
        {pending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
        {compact ? null : "Subscribe"}
      </Button>
    </form>
  );
}
