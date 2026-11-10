import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { SignInGate } from "@/components/auth/SignInGate";
import { useAuth, useProfile } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PET_TYPES, type Provider } from "@/lib/providers";

import { Field } from "./ListBusinessDialog";

const SLOTS = ["10:00 AM", "11:30 AM", "1:00 PM", "4:00 PM", "5:30 PM", "7:00 PM"];

function nextDays(n: number) {
  const days: { key: string; label: string; sub: string }[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      key: d.toDateString(),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday: "short" }),
      sub: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    });
  }
  return days;
}

export function BookingDialog({ provider, onClose }: { provider: Provider | null; onClose: () => void }) {
  const days = useMemo(() => nextDays(5), []);
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [pet, setPet] = useState<string>("Dogs");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const profile = useProfile();
  const queryClient = useQueryClient();

  // Prefill contact details from the signed-in user's profile.
  useEffect(() => {
    if (!provider || !profile.data) return;
    setName((n) => n || profile.data?.full_name || "");
    setPhone((ph) => ph || profile.data?.phone || "");
  }, [provider, profile.data]);

  function close() {
    onClose();
    setTimeout(() => {
      setDone(false);
      setSlot(null);
      setErr("");
    }, 300);
  }

  async function confirm() {
    if (!slot) return setErr("Pick a time slot");
    if (name.trim().length < 2) return setErr("Enter your name");
    if (!/^[+\d][\d\s-]{8,15}$/.test(phone.trim())) return setErr("Enter a valid phone number");
    if (!provider || !user) return;
    setErr("");
    setSaving(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      provider_id: provider.id,
      provider_name: provider.name,
      pet,
      booking_day: `${days[day]?.label}, ${days[day]?.sub}`,
      slot,
      contact_name: name.trim(),
      phone: phone.trim(),
    });
    setSaving(false);
    if (error) {
      toast.error("Couldn't save your booking. Please try again.");
      return;
    }
    void queryClient.invalidateQueries({ queryKey: ["bookings", user.id] });
    setDone(true);
  }

  return (
    <Dialog open={!!provider} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-lg">
        {!user ? (
          <SignInGate
            title="Sign in to book"
            description={`Create a free account to book ${provider?.name ?? "this clinic"} and keep all your pet's appointments in one place.`}
          />
        ) : done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto size-14 text-primary" />
            <h3 className="mt-4 text-2xl font-bold">Appointment requested</h3>
            <div className="mx-auto mt-4 max-w-xs rounded-2xl border border-dashed border-primary/40 bg-secondary p-4 text-left text-sm">
              <p className="font-semibold">{provider?.name}</p>
              <p className="text-muted-foreground">
                {days[day]?.label}, {days[day]?.sub} · {slot}
              </p>
              <p className="text-muted-foreground">
                For: {pet} · {name}
              </p>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">The clinic will confirm by SMS on {phone}.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/account">View my bookings</Link>
              </Button>
              <Button variant="hero" onClick={close}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-5">
            <DialogHeader>
              <div className="mb-1 grid size-11 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                <CalendarCheck className="size-5" />
              </div>
              <DialogTitle className="text-2xl">Book an appointment</DialogTitle>
              <DialogDescription>
                {provider?.name} · {provider?.area} {provider?.fee ? `· ${provider.fee}` : ""}
              </DialogDescription>
            </DialogHeader>

            <div>
              <p className="mb-2 text-sm font-semibold">Pet</p>
              <div className="flex gap-2">
                {PET_TYPES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPet(p)}
                    className={cn(
                      "flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition",
                      pet === p ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Date</p>
              <div className="scrollbar-none flex gap-2 overflow-x-auto">
                {days.map((d, i) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setDay(i)}
                    className={cn(
                      "min-w-[72px] rounded-xl border px-3 py-2 text-center transition",
                      day === i ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50",
                    )}
                  >
                    <span className="block text-xs font-semibold">{d.label}</span>
                    <span className="block text-[11px] opacity-80">{d.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold">Time</p>
              <div className="grid grid-cols-3 gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={cn(
                      "rounded-xl border px-2 py-2 text-sm font-medium transition",
                      slot === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Your name">
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Riya Shah" />
              </Field>
              <Field label="Phone">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" inputMode="tel" />
              </Field>
            </div>
            {err && <p className="-mt-2 text-sm font-medium text-destructive">{err}</p>}
            <Button variant="hero" size="xl" onClick={confirm} disabled={saving}>
              {saving && <Loader2 className="animate-spin" />}
              Confirm booking
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
