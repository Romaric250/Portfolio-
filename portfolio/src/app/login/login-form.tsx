"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/server/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [totpRequired, setTotpRequired] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const totpCode = String(data.get("totpCode") ?? "");
    const recoveryCode = String(data.get("recoveryCode") ?? "");

    startTransition(async () => {
      const result = await loginAction({
        email,
        password,
        totpCode: totpCode || undefined,
        recoveryCode: recoveryCode || undefined,
      });
      if (result.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      if (result.totpRequired) {
        setTotpRequired(true);
        setError(null);
        return;
      }
      setError(result.error);
    });
  }

  return (
    <form onSubmit={submit} className="panel-dark hairline space-y-6 rounded-2xl p-8 shadow-lg">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-terminal/10 text-terminal">
          <LockKeyhole className="size-5" aria-hidden />
        </div>
        <h1 className="font-display text-xl font-semibold tracking-tight text-fg">Admin sign in</h1>
        <p className="font-sans text-sm text-fg-muted">Credentials for authorized access only.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={pending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={pending}
          />
        </div>

        {totpRequired ? (
          <div className="space-y-4 border-t border-hairline pt-4">
            <div className="flex items-center gap-2 text-sm text-fg-muted">
              <ShieldCheck className="size-4 shrink-0 text-accent" aria-hidden />
              <span>Enter your authenticator code or a recovery code.</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totpCode">Authenticator code</Label>
              <Input
                id="totpCode"
                name="totpCode"
                inputMode="numeric"
                autoComplete="one-time-code"
                disabled={pending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recoveryCode">Recovery code</Label>
              <Input id="recoveryCode" name="recoveryCode" autoComplete="off" disabled={pending} />
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-center text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" variant="terminal" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
