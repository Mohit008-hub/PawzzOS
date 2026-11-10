import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarCheck, GraduationCap, Loader2, LogOut, PawPrint, Plus, Trash2, UserRound } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";

import { Field } from "@/components/animals/ListBusinessDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { displayName, useAuth, useProfile } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { bookingsQuery, enrollmentsQuery, petsQuery } from "@/lib/account";
import { PET_TYPES } from "@/lib/providers";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My account — Founder Suite" },
      { name: "description", content: "Your profile, pets, vet bookings and AI course seats." },
      { property: "og:title", content: "My account — Founder Suite" },
      { property: "og:description", content: "Manage your profile, pets, bookings and courses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function Section({ icon, title, action, children }: { icon: ReactNode; title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-bold">
          <span className="grid size-9 place-items-center rounded-xl bg-secondary text-secondary-foreground">{icon}</span>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function AccountPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const profile = useProfile();
  const uid = user?.id ?? "";

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    toast.success("Signed out");
    void navigate({ to: "/", replace: true });
  }

  const name = displayName(user, profile.data?.full_name);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="grid size-14 place-items-center rounded-2xl bg-emerald-gradient font-display text-xl font-bold text-primary-foreground shadow-glow">
            {name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Hi, {name.split(" ")[0]}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut /> Sign out
        </Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ProfileForm uid={uid} />
        <PetsSection uid={uid} />
        <BookingsSection uid={uid} />
        <CoursesSection uid={uid} />
      </div>
    </div>
  );
}

function ProfileForm({ uid }: { uid: string }) {
  const profile = useProfile();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ full_name: "", phone: "", city: "" });

  useEffect(() => {
    if (profile.data) {
      setForm({
        full_name: profile.data.full_name ?? "",
        phone: profile.data.phone ?? "",
        city: profile.data.city ?? "",
      });
    }
  }, [profile.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").upsert({
        id: uid,
        full_name: form.full_name.trim() || null,
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile saved");
      void queryClient.invalidateQueries({ queryKey: ["profile", uid] });
    },
    onError: () => toast.error("Couldn't save your profile. Please try again."),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.phone && !/^[+\d][\d\s-]{8,15}$/.test(form.phone.trim())) return toast.error("Enter a valid phone number");
    save.mutate();
  }

  return (
    <Section icon={<UserRound className="size-4" />} title="Profile">
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field label="Full name">
          <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Riya Shah" maxLength={80} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" inputMode="tel" maxLength={20} />
          </Field>
          <Field label="City">
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Ahmedabad" maxLength={60} />
          </Field>
        </div>
        <p className="-mt-1 text-xs text-muted-foreground">Used to fill in booking and enrollment forms for you.</p>
        <Button type="submit" variant="hero" disabled={save.isPending} className="justify-self-start">
          {save.isPending && <Loader2 className="animate-spin" />} Save profile
        </Button>
      </form>
    </Section>
  );
}

function PetsSection({ uid }: { uid: string }) {
  const queryClient = useQueryClient();
  const pets = useQuery({ ...petsQuery(uid), enabled: !!uid });
  const [adding, setAdding] = useState(false);
  const [pet, setPet] = useState({ name: "", species: "Dogs", breed: "", age: "" });

  const add = useMutation({
    mutationFn: async () => {
      const age = pet.age.trim() ? Number(pet.age) : null;
      const { error } = await supabase.from("pets").insert({
        user_id: uid,
        name: pet.name.trim(),
        species: pet.species,
        breed: pet.breed.trim() || null,
        age_years: age !== null && Number.isFinite(age) ? age : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`${pet.name.trim()} added`);
      setPet({ name: "", species: "Dogs", breed: "", age: "" });
      setAdding(false);
      void queryClient.invalidateQueries({ queryKey: ["pets", uid] });
    },
    onError: () => toast.error("Couldn't add your pet. Please try again."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["pets", uid] }),
  });

  return (
    <Section
      icon={<PawPrint className="size-4" />}
      title="My pets"
      action={
        !adding && (
          <Button variant="soft" size="sm" onClick={() => setAdding(true)}>
            <Plus /> Add pet
          </Button>
        )
      }
    >
      {adding && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pet.name.trim().length < 1) return toast.error("Give your pet a name");
            add.mutate();
          }}
          className="mb-4 grid gap-3 rounded-2xl border border-dashed border-primary/40 bg-secondary/50 p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <Input value={pet.name} onChange={(e) => setPet({ ...pet, name: e.target.value })} placeholder="Bruno" maxLength={40} autoFocus />
            </Field>
            <Field label="Type">
              <Select value={pet.species} onValueChange={(v) => setPet({ ...pet, species: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PET_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Breed (optional)">
              <Input value={pet.breed} onChange={(e) => setPet({ ...pet, breed: e.target.value })} placeholder="Indie" maxLength={60} />
            </Field>
            <Field label="Age in years (optional)">
              <Input value={pet.age} onChange={(e) => setPet({ ...pet, age: e.target.value })} placeholder="3" inputMode="decimal" maxLength={4} />
            </Field>
          </div>
          <div className="flex gap-2">
            <Button type="submit" variant="hero" size="sm" disabled={add.isPending}>
              {add.isPending && <Loader2 className="animate-spin" />} Save pet
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {pets.isLoading ? (
        <ListSkeleton />
      ) : pets.data?.length ? (
        <ul className="grid gap-2">
          {pets.data.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {[p.species, p.breed, p.age_years != null ? `${p.age_years} yrs` : null].filter(Boolean).join(" · ")}
                </p>
              </div>
              <Button variant="ghost" size="icon" aria-label={`Remove ${p.name}`} onClick={() => remove.mutate(p.id)}>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        !adding && <Empty text="No pets saved yet. Add one so vets know who's coming in." />
      )}
    </Section>
  );
}

function BookingsSection({ uid }: { uid: string }) {
  const queryClient = useQueryClient();
  const bookings = useQuery({ ...bookingsQuery(uid), enabled: !!uid });
  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Booking cancelled");
      void queryClient.invalidateQueries({ queryKey: ["bookings", uid] });
    },
  });

  return (
    <Section icon={<CalendarCheck className="size-4" />} title="Vet bookings">
      {bookings.isLoading ? (
        <ListSkeleton />
      ) : bookings.data?.length ? (
        <ul className="grid gap-2">
          {bookings.data.map((b) => (
            <li key={b.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border p-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{b.provider_name}</p>
                <p className="text-xs text-muted-foreground">{b.booking_day} · {b.slot} · {b.pet}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => cancel.mutate(b.id)} disabled={cancel.isPending}>
                Cancel
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <Empty text="No bookings yet.">
          <Button variant="hero" size="sm" asChild className="mt-3"><Link to="/">Find a vet</Link></Button>
        </Empty>
      )}
    </Section>
  );
}

function CoursesSection({ uid }: { uid: string }) {
  const enrollments = useQuery({ ...enrollmentsQuery(uid), enabled: !!uid });
  return (
    <Section icon={<GraduationCap className="size-4" />} title="AI courses">
      {enrollments.isLoading ? (
        <ListSkeleton />
      ) : enrollments.data?.length ? (
        <ul className="grid gap-2">
          {enrollments.data.map((e) => (
            <li key={e.id} className="rounded-2xl border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{e.program_title}</p>
                <span className="shrink-0 rounded-full bg-edu-soft px-2.5 py-0.5 text-[11px] font-bold text-edu">
                  {e.mode === "demo" ? "Demo class" : "Seat reserved"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {e.mode === "demo" ? e.slot : "Next cohort"} · booked {new Date(e.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <Empty text="You haven't reserved a course or demo yet.">
          <Button variant="edu" size="sm" asChild className="mt-3"><Link to="/education">Explore programs</Link></Button>
        </Empty>
      )}
    </Section>
  );
}

function Empty({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-muted/60 p-5 text-center text-sm text-muted-foreground">
      {text}
      {children && <div>{children}</div>}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="grid gap-2">
      {[0, 1].map((i) => (
        <div key={i} className="h-14 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}
