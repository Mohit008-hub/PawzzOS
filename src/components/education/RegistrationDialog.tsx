import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Loader2, Mail, MessageCircle, Sparkles, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { SignInGate } from "@/components/auth/SignInGate";
import { useAuth, useProfile } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

import { Field } from "@/components/animals/ListBusinessDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LEARNING_GOALS, PROGRAMS } from "@/lib/programs";

export type RegMode = "enroll" | "demo";

const DEMO_SLOTS = ["Sat · 11:00 AM", "Sat · 5:00 PM", "Sun · 11:00 AM", "Wed · 7:30 PM"];

const steps = ["Your name", "Contact", "Your goal", "Confirmed"];

const nameSchema = z.string().trim().min(2, "Please enter your full name").max(80);
const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/, "Enter a valid 10-digit Indian mobile number");

export function RegistrationDialog({
  open,
  onOpenChange,
  mode,
  programId,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: RegMode;
  programId?: string | undefined;
}) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState<string>("");
  const [program, setProgram] = useState(programId ?? PROGRAMS[0]!.id);
  const [slot, setSlot] = useState(DEMO_SLOTS[0]);
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "phone" | "goal", string>>>({});
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const profile = useProfile();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setStep(0);
      setErrors({});
      if (programId) setProgram(programId);
    }
  }, [open, programId]);

  // Prefill from the signed-in account.
  useEffect(() => {
    if (!open || !user) return;
    setName((n) => n || profile.data?.full_name || "");
    setEmail((e) => e || user.email || "");
    setPhone((ph) => ph || profile.data?.phone || "");
  }, [open, user, profile.data]);

  const p = PROGRAMS.find((x) => x.id === program)!;

  function next() {
    const e: Partial<Record<"name" | "email" | "phone" | "goal", string>> = {};
    if (step === 0) {
      const r = nameSchema.safeParse(name);
      if (!r.success) e.name = r.error.issues[0]?.message ?? "Invalid";
    }
    if (step === 1) {
      const re = emailSchema.safeParse(email);
      if (!re.success) e.email = re.error.issues[0]?.message ?? "Invalid";
      const rp = phoneSchema.safeParse(phone);
      if (!rp.success) e.phone = rp.error.issues[0]?.message ?? "Invalid";
    }
    if (step === 2 && !goal) e.goal = "Pick the goal closest to yours";
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    if (step === 2) return void save();
    setStep((s) => Math.min(3, s + 1));
  }

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("enrollments").insert({
      user_id: user.id,
      program_id: p.id,
      program_title: p.title,
      mode,
      goal,
      slot: mode === "demo" ? (slot ?? null) : null,
      full_name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    setSaving(false);
    if (error) {
      toast.error("Couldn't save your reservation. Please try again.");
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["enrollments", user.id] });
    setStep(3);
  }

  const firstName = name.trim().split(" ")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        {!user ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Sign in to continue</DialogTitle>
              <DialogDescription>An account is needed to reserve a seat.</DialogDescription>
            </DialogHeader>
            <SignInGate
              tone="edu"
              title={mode === "demo" ? "Sign in to book your demo" : "Sign in to reserve your seat"}
              description="A free account keeps your class links, reminders and course progress in one place."
            />
          </>
        ) : (
        <>
        <DialogHeader>
          <p className="text-xs font-bold uppercase tracking-wider text-edu">
            {mode === "demo" ? "Free demo class" : "Enrollment"} · Step {Math.min(step + 1, 4)} of 4
          </p>
          <DialogTitle className="text-2xl">
            {step === 3
              ? mode === "demo"
                ? `See you in class, ${firstName}!`
                : `Seat reserved, ${firstName}!`
              : mode === "demo"
                ? "Book your free demo class"
                : `Enroll in ${p.title}`}
          </DialogTitle>
          <DialogDescription>{steps[step]}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= step ? "bg-edu" : "bg-muted")} />
          ))}
        </div>

        {step === 0 && (
          <div className="grid gap-4 animate-rise">
            <Field label="Full name" error={errors.name}>
              <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Riya Patel" onKeyDown={(e) => e.key === "Enter" && next()} />
            </Field>
            <p className="text-xs text-muted-foreground">Takes under 60 seconds. No payment needed to reserve.</p>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 animate-rise">
            <Field label="Email" error={errors.email}>
              <Input autoFocus type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="riya@email.com" />
            </Field>
            <Field label="WhatsApp number" error={errors.phone}>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" inputMode="tel" />
            </Field>
            <p className="text-xs text-muted-foreground">We'll send your class link and reminders on WhatsApp. No spam.</p>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 animate-rise">
            <div>
              <p className="mb-2 text-sm font-semibold">What do you want from AI?</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {LEARNING_GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id)}
                    className={cn(
                      "rounded-2xl border p-3 text-left transition",
                      goal === g.id ? "border-edu bg-edu-soft" : "border-border hover:border-edu/50",
                    )}
                  >
                    <span className="block text-sm font-bold">{g.label}</span>
                    <span className="block text-xs text-muted-foreground">{g.desc}</span>
                  </button>
                ))}
              </div>
              {errors.goal && <p className="mt-2 text-xs font-medium text-destructive">{errors.goal}</p>}
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Program</p>
              <div className="grid gap-2">
                {PROGRAMS.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => setProgram(x.id)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition",
                      program === x.id ? "border-edu bg-edu-soft font-semibold" : "border-border hover:border-edu/50",
                    )}
                  >
                    <span>{x.title}</span>
                    <span className="text-xs text-muted-foreground">{x.duration}</span>
                  </button>
                ))}
              </div>
            </div>
            {mode === "demo" && (
              <div>
                <p className="mb-2 text-sm font-semibold">Pick a demo slot</p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_SLOTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlot(s)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-sm font-medium transition",
                        slot === s ? "border-edu bg-edu text-edu-foreground" : "border-border hover:border-edu/50",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 animate-rise">
            <div className="relative overflow-hidden rounded-2xl bg-ink p-5 text-ink-foreground">
              <div className="bg-dot-grid-ink absolute inset-0" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-edu">
                    <Ticket className="size-3.5" /> {mode === "demo" ? "Demo pass" : "Seat reservation"}
                  </p>
                  <p className="mt-2 font-display text-xl font-bold">{p.title}</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {name} · {email}
                  </p>
                </div>
                <CheckCircle2 className="size-10 shrink-0 text-edu" />
              </div>
              <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-dashed border-ink-foreground/20 pt-4 text-xs">
                <div>
                  <p className="text-ink-muted">{mode === "demo" ? "Slot" : "Starts"}</p>
                  <p className="font-semibold">{mode === "demo" ? slot : "Next cohort"}</p>
                </div>
                <div>
                  <p className="text-ink-muted">Format</p>
                  <p className="font-semibold">{p.format}</p>
                </div>
                <div>
                  <p className="text-ink-muted">Goal</p>
                  <p className="font-semibold">{LEARNING_GOALS.find((g) => g.id === goal)?.label}</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-sm font-bold">What happens next</p>
              <ol className="mt-3 grid gap-3 text-sm">
                <li className="flex gap-3"><MessageCircle className="size-4 shrink-0 text-edu" /> WhatsApp confirmation to {phone} in the next 2 minutes.</li>
                <li className="flex gap-3"><Mail className="size-4 shrink-0 text-edu" /> Starter kit + {mode === "demo" ? "class link" : "payment link"} sent to your email.</li>
                <li className="flex gap-3"><CalendarDays className="size-4 shrink-0 text-edu" /> A counsellor calls within 24 hours to map your learning path.</li>
              </ol>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          {step > 0 && step < 3 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft /> Back
            </Button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <Button variant="edu" size="lg" onClick={next} disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              {step === 2 ? (
                <>
                  <Sparkles /> {mode === "demo" ? "Book my demo" : "Reserve my seat"}
                </>
              ) : (
                <>
                  Continue <ArrowRight />
                </>
              )}
            </Button>
          ) : (
            <Button variant="ink" size="lg" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          )}
        </div>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
}
