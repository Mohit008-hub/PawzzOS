import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, GraduationCap, Loader2, MailCheck, PawPrint, Workflow } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

import heroVet from "@/assets/hero-vet.jpg";
import { Field } from "@/components/animals/ListBusinessDialog";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { AUTH_REDIRECT_KEY, safeRedirect } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string; mode?: "signin" | "signup" } => ({
    ...(typeof search.redirect === "string" ? { redirect: search.redirect } : {}),
    ...(search.mode === "signup" || search.mode === "signin" ? { mode: search.mode } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Founder Suite" },
      { name: "description", content: "Sign in or create your Founder Suite account to book vets, save your pets and enroll in AI courses." },
      { property: "og:title", content: "Sign in to Founder Suite" },
      { property: "og:description", content: "One account to book vet visits, save pet profiles and reserve AI course seats." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(8, "Use at least 8 characters").max(72);
const nameSchema = z.string().trim().min(2, "Enter your full name").max(80);

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>(search.mode ?? "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "password", string>>>({});
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<{ email: string; kind: "confirm" | "reset" } | null>(null);

  // Signed in (password, Google return, or already had a session) → go to the intended page.
  useEffect(() => {
    if (loading || !user) return;
    const stored = sessionStorage.getItem(AUTH_REDIRECT_KEY);
    sessionStorage.removeItem(AUTH_REDIRECT_KEY);
    void navigate({ href: safeRedirect(search.redirect ?? stored), replace: true });
  }, [user, loading, search.redirect, navigate]);

  function validate() {
    const e: typeof errors = {};
    const em = emailSchema.safeParse(email);
    if (!em.success) e.email = em.error.issues[0]?.message;
    if (mode !== "forgot") {
      const pw = passwordSchema.safeParse(password);
      if (!pw.success) e.password = pw.error.issues[0]?.message;
    }
    if (mode === "signup") {
      const nm = nameSchema.safeParse(name);
      if (!nm.success) e.name = nm.error.issues[0]?.message;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) {
          toast.error(
            error.message.toLowerCase().includes("confirm")
              ? "Please confirm your email first — check your inbox."
              : "That email and password don't match.",
          );
          return;
        }
        toast.success("Welcome back!");
      } else if (mode === "signup") {
        const target = safeRedirect(search.redirect);
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?redirect=${encodeURIComponent(target)}`,
            data: { full_name: name.trim() },
          },
        });
        if (error) {
          toast.error(error.message.toLowerCase().includes("registered") ? "That email already has an account — sign in instead." : error.message);
          return;
        }
        if (!data.session) setSentTo({ email: email.trim(), kind: "confirm" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        setSentTo({ email: email.trim(), kind: "reset" });
      }
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    sessionStorage.setItem(AUTH_REDIRECT_KEY, safeRedirect(search.redirect));
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth` });
    if (result.error) {
      toast.error("Google sign-in didn't complete. Please try again.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    // Session set — the effect above navigates.
  }

  function switchMode(m: Mode) {
    setMode(m);
    setErrors({});
    setSentTo(null);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-14">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden rounded-3xl bg-primary-deep text-primary-foreground shadow-lift lg:block">
        <img src={heroVet} alt="" className="absolute inset-0 size-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep via-primary-deep/70 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">One account · three tools</p>
          <h2 className="mt-3 font-display text-4xl font-bold leading-tight">
            Care for your pets, learn AI, <span className="font-serif italic font-normal">create faster.</span>
          </h2>
          <ul className="mt-8 grid gap-3 text-sm">
            <li className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-primary-foreground/15"><PawPrint className="size-4" /></span>Book vet visits and keep your pets' details in one place</li>
            <li className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-primary-foreground/15"><GraduationCap className="size-4" /></span>Reserve AI course seats and free demo classes</li>
            <li className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-primary-foreground/15"><Workflow className="size-4" /></span>Content Studio stays open to everyone</li>
          </ul>
        </div>
      </aside>

      {/* Form */}
      <section className="mx-auto w-full max-w-md self-center">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Founder Suite
        </Link>

        {sentTo ? (
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft animate-rise">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
              <MailCheck className="size-7" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold">Check your inbox</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {sentTo.kind === "confirm"
                ? <>We sent a confirmation link to <b className="text-foreground">{sentTo.email}</b>. Click it to finish creating your account.</>
                : <>We sent a password reset link to <b className="text-foreground">{sentTo.email}</b>.</>}
            </p>
            <Button variant="ghost" className="mt-6" onClick={() => switchMode("signin")}>
              Back to sign in
            </Button>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to book vets and manage your courses."
                : mode === "signup"
                  ? "Free forever. Takes under a minute."
                  : "Enter your email and we'll send you a reset link."}
            </p>

            {mode !== "forgot" && (
              <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={cn(
                      "rounded-lg py-2 text-sm font-semibold transition",
                      mode === m ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {m === "signin" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>
            )}

            {mode !== "forgot" && (
              <>
                <div className="mt-6">
                  <GoogleButton onClick={onGoogle} disabled={busy} />
                </div>
                <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
                </div>
              </>
            )}

            <form onSubmit={onSubmit} className={cn("grid gap-4", mode === "forgot" && "mt-6")} noValidate>
              {mode === "signup" && (
                <Field label="Full name" error={errors.name}>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Riya Shah" autoComplete="name" />
                </Field>
              )}
              <Field label="Email" error={errors.email}>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" />
              </Field>
              {mode !== "forgot" && (
                <Field label="Password" error={errors.password}>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
                    autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  />
                </Field>
              )}
              {mode === "signin" && (
                <button type="button" onClick={() => switchMode("forgot")} className="-mt-2 justify-self-end text-xs font-semibold text-primary hover:underline">
                  Forgot password?
                </button>
              )}
              <Button type="submit" variant="hero" size="xl" disabled={busy}>
                {busy && <Loader2 className="animate-spin" />}
                {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
              </Button>
              {mode === "forgot" && (
                <Button type="button" variant="ghost" onClick={() => switchMode("signin")}>
                  Back to sign in
                </Button>
              )}
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
