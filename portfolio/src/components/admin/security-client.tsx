"use client";

import * as React from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword, confirmTotp, disableTotp, setupTotp, signOutEverywhere } from "@/server/actions/security";

export function SecurityClient({
  profile,
}: {
  profile: { email: string; totpEnabled: boolean; recoveryCodes: string[]; lastLoginAt: Date | null } | null;
}) {
  const [passwords, setPasswords] = React.useState({ currentPassword: "", newPassword: "" });
  const [totpCode, setTotpCode] = React.useState("");
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null);
  const [recovery, setRecovery] = React.useState<string[]>(profile?.recoveryCodes ?? []);

  return (
    <div className="max-w-lg space-y-8">
      <PageHeader title="Security" description="Password, two-factor authentication, and sessions." />

      <section className="space-y-3 hairline rounded-lg p-4">
        <h2 className="text-sm font-semibold">Change password</h2>
        <div className="space-y-2">
          <Input type="password" placeholder="Current password" value={passwords.currentPassword} onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))} />
          <Input type="password" placeholder="New password (12+ chars)" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} />
        </div>
        <Button
          onClick={async () => {
            const res = await changePassword(passwords);
            if (!res.ok) toast.error(res.error);
            else toast.success("Password updated");
          }}
        >
          Update password
        </Button>
      </section>

      <section className="space-y-3 hairline rounded-lg p-4">
        <h2 className="text-sm font-semibold">Two-factor authentication</h2>
        <p className="text-sm text-fg-muted">Status: {profile?.totpEnabled ? "Enabled" : "Disabled"}</p>
        {!profile?.totpEnabled ? (
          <>
            <Button
              variant="outline"
              onClick={async () => {
                const res = await setupTotp();
                if (!res.ok) {
                  toast.error(res.error);
                  return;
                }
                const url = await QRCode.toDataURL(res.data.otpauth);
                setQrDataUrl(url);
              }}
            >
              Generate QR code
            </Button>
            {qrDataUrl ? <img src={qrDataUrl} alt="TOTP QR code" className="mx-auto size-48 hairline rounded-lg" /> : null}
            <div className="space-y-1.5">
              <Label>Authenticator code</Label>
              <Input value={totpCode} onChange={(e) => setTotpCode(e.target.value)} />
            </div>
            <Button
              onClick={async () => {
                const res = await confirmTotp(totpCode);
                if (!res.ok) toast.error(res.error);
                else {
                  setRecovery(res.data.recoveryCodes);
                  toast.success("TOTP enabled");
                  window.location.reload();
                }
              }}
            >
              Enable TOTP
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-1.5">
              <Label>Code to disable</Label>
              <Input value={totpCode} onChange={(e) => setTotpCode(e.target.value)} />
            </div>
            <Button variant="destructive" onClick={async () => {
              const res = await disableTotp(totpCode);
              if (!res.ok) toast.error(res.error);
              else window.location.reload();
            }}>
              Disable TOTP
            </Button>
          </>
        )}
        {recovery.length ? (
          <div className="text-xs text-fg-muted">
            <p className="font-medium text-fg">Recovery codes</p>
            <ul className="mt-1 font-mono">
              {recovery.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="space-y-3 hairline rounded-lg p-4">
        <h2 className="text-sm font-semibold">Sessions</h2>
        <p className="text-sm text-fg-muted">Sign out all devices by invalidating existing sessions.</p>
        <Button
          variant="outline"
          onClick={async () => {
            const res = await signOutEverywhere();
            if (!res.ok) toast.error(res.error);
            else toast.success("All sessions invalidated — sign in again");
          }}
        >
          Sign out everywhere
        </Button>
      </section>
    </div>
  );
}
