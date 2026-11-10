import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Field } from "@/components/animals/ListBusinessDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Founder Suite" },
      { name: "description", content: "Choose a new password for your Founder Suite account." },
      { property: "og:title", content: "Set a new password — Founder Suite" },
      { property: "og:description", content: "Finish resetting your Founder Suite password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setReady(true);
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    void supabase.auth.getSession().then(({ data: s }) => s.session && setReady(true));
    return () => data.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setErr("Use at least 8 characters");
    if (password !== confirm) return setErr("Passwords don't match");
    setErr("");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setErr(error.message);
    toast.success("Password updated");
    void navigate({ to: "/account", replace: true });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
          <KeyRound className="size-5" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">Set a new password</h1>
        {ready ? (
          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <Field label="New password">
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </Field>
            <Field label="Confirm password" error={err || undefined}>
              <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            </Field>
            <Button type="submit" variant="hero" size="xl" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />} Save password
            </Button>
          </form>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Open this page from the reset link in your email. Links expire after a while — request a new one from the sign-in page if needed.
          </p>
        )}
      </div>
    </div>
  );
}
