import { CheckCircle2, Store } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/lib/providers";

const schema = z.object({
  business: z.string().trim().min(2, "Enter your business name").max(100),
  type: z.string().min(1, "Choose a category"),
  contact: z.string().trim().min(2, "Enter a contact name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{8,15}$/, "Enter a valid phone number"),
  city: z.string().trim().min(2, "Enter your city").max(60),
  note: z.string().max(500).optional(),
});

export function ListBusinessDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [form, setForm] = useState({ business: "", type: "", contact: "", phone: "", city: "Ahmedabad", note: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])) as Partial<Record<keyof typeof form, string>>);
      return;
    }
    setErrors({});
    setDone(true);
  }

  function close(o: boolean) {
    onOpenChange(o);
    if (!o) setTimeout(() => setDone(false), 300);
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-lg">
        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto size-14 text-primary" />
            <h3 className="mt-4 text-2xl font-bold">You're on the list!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our partner team will call {form.contact.split(" ")[0]} within 24 hours to verify{" "}
              <strong className="text-foreground">{form.business}</strong> and set up your free listing.
            </p>
            <Button variant="hero" className="mt-6" onClick={() => close(false)}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4">
            <DialogHeader>
              <div className="mb-1 grid size-11 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
                <Store className="size-5" />
              </div>
              <DialogTitle className="text-2xl">List your business — free</DialogTitle>
              <DialogDescription>
                Vet clinics, hospitals, boarding, labs, ambulances and NGOs. Get found by pet parents nearby.
              </DialogDescription>
            </DialogHeader>
            <Field label="Business / NGO name" error={errors.business}>
              <Input value={form.business} onChange={(e) => set("business")(e.target.value)} placeholder="e.g. Pawsitive Vet Clinic" />
            </Field>
            <Field label="Category" error={errors.type}>
              <Select value={form.type} onValueChange={set("type")}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact person" error={errors.contact}>
                <Input value={form.contact} onChange={(e) => set("contact")(e.target.value)} placeholder="Dr. Mehta" />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <Input value={form.phone} onChange={(e) => set("phone")(e.target.value)} placeholder="+91 98765 43210" inputMode="tel" />
              </Field>
            </div>
            <Field label="City" error={errors.city}>
              <Input value={form.city} onChange={(e) => set("city")(e.target.value)} />
            </Field>
            <Field label="Anything else? (optional)">
              <Textarea value={form.note} onChange={(e) => set("note")(e.target.value)} rows={2} placeholder="Services, timings, home visits…" />
            </Field>
            <Button type="submit" variant="hero" size="xl">
              Request free listing
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm font-semibold">{label}</Label>
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
