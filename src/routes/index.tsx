import { createFileRoute } from "@tanstack/react-router";
import {
  Ambulance,
  BedDouble,
  Crosshair,
  FlaskConical,
  HeartHandshake,
  Hospital,
  LocateFixed,
  MapPin,
  Navigation,
  PawPrint,
  Phone,
  Search,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Star,
  Stethoscope,
  Store,
  Users,
  X,
} from "lucide-react";
import { useMemo, useRef, useState, type FormEvent } from "react";

import heroVet from "@/assets/hero-vet.jpg";
import { BookingDialog } from "@/components/animals/BookingDialog";
import { CorrectionDialog } from "@/components/animals/CorrectionDialog";
import { ListBusinessDialog } from "@/components/animals/ListBusinessDialog";
import { ProviderCard } from "@/components/animals/ProviderCard";
import { FounderNotes } from "@/components/site/FounderNotes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CATEGORIES,
  DEFAULT_QUERY,
  FILTER_TAGS,
  PET_TYPES,
  PROVIDERS,
  SOS_PHONE,
  directionsUrl,
  filterProviders,
  nearestEmergency,
  type Category,
  type FilterTag,
  type PetType,
  type Provider,
  type ProviderQuery,
} from "@/lib/providers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Practo for Animals — Find vets, emergency care & NGOs near you" },
      {
        name: "description",
        content:
          "Search verified vet clinics, 24/7 emergency hospitals, boarding, diagnostics, pet ambulances and rescue NGOs in Ahmedabad.",
      },
      { property: "og:title", content: "Practo for Animals — Animal care, found fast" },
      {
        property: "og:description",
        content: "Verified vets, 24/7 emergency care, boarding, labs, ambulances and NGOs — with one-tap SOS.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnimalsPage,
});

const CATEGORY_ICONS: Record<Category, typeof Stethoscope> = {
  "Veterinary Clinics": Stethoscope,
  "Emergency Hospitals": Hospital,
  "Boarding & Daycare": BedDouble,
  "Diagnostics & Labs": FlaskConical,
  "Pet Ambulance": Ambulance,
  "Rescue NGOs": HeartHandshake,
};

function AnimalsPage() {
  const [location, setLocation] = useState("Thaltej, Ahmedabad");
  const [draftCategory, setDraftCategory] = useState<ProviderQuery["category"]>("All");
  const [draftPet, setDraftPet] = useState<ProviderQuery["pet"]>("All");
  const [query, setQuery] = useState<ProviderQuery>(DEFAULT_QUERY);
  const [booking, setBooking] = useState<Provider | null>(null);
  const [correcting, setCorrecting] = useState<Provider | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => filterProviders(PROVIDERS, query), [query]);
  const emergency = useMemo(() => nearestEmergency(PROVIDERS), []);

  const scrollToResults = () => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setQuery((q) => ({ ...q, category: draftCategory, pet: draftPet }));
    scrollToResults();
  }

  function pickCategory(c: Category) {
    setDraftCategory(c);
    setQuery((q) => ({ ...q, category: c }));
    scrollToResults();
  }

  function toggleTag(t: FilterTag) {
    setQuery((q) => ({ ...q, tags: q.tags.includes(t) ? q.tags.filter((x) => x !== t) : [...q.tags, t] }));
  }

  function reset() {
    setQuery(DEFAULT_QUERY);
    setDraftCategory("All");
    setDraftPet("All");
  }

  const activeCount = query.tags.length + (query.category !== "All" ? 1 : 0) + (query.pet !== "All" ? 1 : 0) + (query.text ? 1 : 0);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero-glow">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20 lg:pt-16">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-semibold text-primary-deep shadow-soft">
              <ShieldCheck className="size-3.5 text-primary" /> 1,200+ verified providers across Ahmedabad
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
              The right care for your pet, <span className="font-serif font-normal italic text-primary">found in minutes.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Vets, 24/7 hospitals, boarding, labs, ambulances and rescue NGOs — compared by distance, ratings and real
              availability.
            </p>

            <form
              onSubmit={onSearch}
              className="mt-8 grid gap-2 rounded-3xl border border-border bg-card p-2 shadow-lift sm:grid-cols-[1.3fr_1fr_0.8fr_auto]"
            >
              <label className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-muted">
                <MapPin className="size-5 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Location</span>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold outline-none"
                    placeholder="Area, city"
                  />
                </span>
                <button
                  type="button"
                  aria-label="Use my location"
                  onClick={() => setLocation("Thaltej, Ahmedabad")}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary"
                >
                  <LocateFixed className="size-4" />
                </button>
              </label>
              <div className="rounded-2xl px-1 hover:bg-muted">
                <span className="block px-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Service</span>
                <Select value={draftCategory} onValueChange={(v) => setDraftCategory(v as ProviderQuery["category"])}>
                  <SelectTrigger className="h-8 border-0 bg-transparent px-2 font-semibold shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All services</SelectItem>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-2xl px-1 hover:bg-muted">
                <span className="block px-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Pet</span>
                <Select value={draftPet} onValueChange={(v) => setDraftPet(v as ProviderQuery["pet"])}>
                  <SelectTrigger className="h-8 border-0 bg-transparent px-2 font-semibold shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All pets</SelectItem>
                    {PET_TYPES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" variant="hero" size="xl" className="h-full min-h-12 rounded-2xl">
                <Search /> Find a Vet
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const Icon = CATEGORY_ICONS[c];
                return (
                  <button
                    key={c}
                    onClick={() => pickCategory(c)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-soft transition hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="size-3.5 text-primary" /> {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="overflow-hidden rounded-[2rem] shadow-lift">
              <img src={heroVet} alt="Veterinarian examining a happy dog" width={1536} height={1024} className="aspect-[1/1] w-full object-cover" />
            </div>
            <div className="absolute -left-8 top-10 rounded-2xl border border-border bg-card p-3 shadow-lift">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary text-primary">
                  <Star className="size-5 fill-star text-star" />
                </span>
                <div>
                  <p className="text-sm font-bold">4.8 avg rating</p>
                  <p className="text-xs text-muted-foreground">from 38k pet parents</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 bottom-10 rounded-2xl border border-border bg-card p-3 shadow-lift">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-sos-soft text-sos">
                  <Siren className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-bold">Ambulance in ~12 min</p>
                  <p className="text-xs text-muted-foreground">avg. response, west Ahmedabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-sos-gradient p-6 text-sos-foreground shadow-lift sm:p-8">
          <div className="absolute -right-10 -top-16 size-64 rounded-full bg-sos-foreground/10" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-sos-foreground/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <span className="size-2 animate-pulse rounded-full bg-sos-foreground" /> 24/7 Emergency
              </p>
              <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">Pet emergency? Don't search — call.</h2>
              <p className="mt-1 text-sm opacity-90">
                Accident, poisoning, breathing trouble or a kite-string injury — our pet ambulance dispatches across the city, day and night.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${SOS_PHONE}`}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-sos-foreground px-6 text-base font-extrabold text-sos shadow-lg animate-pulse-ring"
              >
                <Phone className="size-5" /> SOS · Call Ambulance
              </a>
              <button
                onClick={() => setShowEmergency((s) => !s)}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-sos-foreground/40 px-6 text-base font-bold hover:bg-sos-foreground/10"
              >
                <Crosshair className="size-5" /> {showEmergency ? "Hide" : "Nearest emergency clinics"}
              </button>
            </div>
          </div>

          {showEmergency && (
            <div className="relative mt-6 grid animate-rise gap-3 md:grid-cols-3">
              {emergency.map((p, i) => (
                <div key={p.id} className="rounded-2xl bg-card p-4 text-card-foreground">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sos">#{i + 1} nearest · {p.distanceKm} km</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold">
                      <Star className="size-3 fill-star text-star" /> {p.rating}
                    </span>
                  </div>
                  <p className="mt-1 font-bold">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.hours} · {p.area}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button variant="sos" size="sm" className="animate-none" asChild>
                      <a href={`tel:${p.phone}`}>
                        <Phone /> Call
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={directionsUrl(p)} target="_blank" rel="noreferrer">
                        <Navigation /> Directions
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DIRECTORY */}
      <section ref={resultsRef} className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              {query.category === "All" ? "Animal care" : query.category} near{" "}
              <span className="text-primary">{location || "you"}</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "provider" : "providers"}
              {query.pet !== "All" ? ` for ${query.pet.toLowerCase()}` : ""} · sorted by{" "}
              {query.sort === "distance" ? "distance" : "rating"}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query.text}
                onChange={(e) => setQuery((q) => ({ ...q, text: e.target.value }))}
                placeholder="Name, area or service"
                className="h-10 rounded-xl bg-card pl-9"
              />
            </div>
            <Select value={query.sort} onValueChange={(v) => setQuery((q) => ({ ...q, sort: v as ProviderQuery["sort"] }))}>
              <SelectTrigger className="h-10 w-36 rounded-xl bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Nearest first</SelectItem>
                <SelectItem value="rating">Top rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="sticky top-[118px] z-20 -mx-4 mt-6 border-y border-border/60 bg-background/90 px-4 py-3 backdrop-blur md:top-[65px] sm:-mx-6 sm:px-6">
          <div className="scrollbar-none flex items-center gap-2 overflow-x-auto">
            <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <SlidersHorizontal className="size-3.5" /> Filters
            </span>
            {FILTER_TAGS.map((t) => {
              const on = query.tags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  aria-pressed={on}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition",
                    on
                      ? "border-primary bg-primary text-primary-foreground shadow-glow"
                      : "border-border bg-card text-foreground hover:border-primary/40",
                  )}
                >
                  {t}
                </button>
              );
            })}
            <span className="mx-1 h-6 w-px shrink-0 bg-border" />
            {(["All", ...PET_TYPES] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setQuery((q) => ({ ...q, pet: p as PetType | "All" }));
                  setDraftPet(p as PetType | "All");
                }}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold transition",
                  query.pet === p ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted",
                )}
              >
                {p === "All" ? "All pets" : p}
              </button>
            ))}
            {activeCount > 0 && (
              <button onClick={reset} className="ml-auto inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-sos">
                <X className="size-3.5" /> Clear ({activeCount})
              </button>
            )}
          </div>
        </div>

        {results.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <ProviderCard key={p.id} p={p} onBook={setBooking} onCorrect={setCorrecting} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
            <PawPrint className="mx-auto size-10 text-muted-foreground" />
            <h3 className="mt-3 text-xl font-bold">No matches for these filters</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try removing a filter, or call our helpline and we'll find someone for you.</p>
            <Button variant="hero" className="mt-5" onClick={reset}>
              Clear all filters
            </Button>
          </div>
        )}
      </section>

      {/* TRUST + PARTNER CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "Verified listings", d: "Licences, timings and phone numbers checked by our team every quarter." },
            { icon: Users, t: "Community-corrected", d: "Pet parents flag wrong info in one tap — fixes go live within 48 hours." },
            { icon: Siren, t: "Emergency-first", d: "24/7 hospitals and ambulances are one tap away on every screen." },
          ].map((f) => (
            <div key={f.t} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <span className="grid size-11 place-items-center rounded-2xl bg-secondary text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>

        <div className="relative mt-6 overflow-hidden rounded-3xl bg-ink p-8 text-ink-foreground sm:p-12">
          <div className="bg-dot-grid-ink absolute inset-0" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">For clinics, hospitals & NGOs</p>
              <h2 className="mt-2 text-3xl font-bold">Get discovered by pet parents nearby</h2>
              <p className="mt-2 text-ink-muted">
                Free listing, appointment requests on WhatsApp, and a verified badge. NGOs get donation and volunteer CTAs.
              </p>
            </div>
            <Button variant="hero" size="xl" onClick={() => setListOpen(true)}>
              <Store /> List Your Business
            </Button>
          </div>
        </div>
      </section>

      <FounderNotes
        tone="primary"
        intro="Why the MVP looks and works the way it does — what's in, what's deliberately out, and the CTA strategy."
        notes={[
          {
            title: "Essential MVP elements",
            points: [
              "One search bar with three inputs (location, service, pet) — the three questions every pet parent has.",
              "Six service categories as quick chips, so most visits need zero typing.",
              "Provider cards show only what decides a visit: open/closed, distance, rating, key tags and fee.",
              "Emergency SOS sits above the directory — in a crisis nobody should scroll or filter.",
            ],
          },
          {
            title: "Filters & provider information",
            points: [
              "Five high-intent filters: Open 24/7, Home Visits, ICU Facility, Verified NGO, Rating 4.0+. They combine (all must match).",
              "Pet type is a first-class filter because exotic/bird care is rare and hard to find.",
              "Sort by nearest or top rated; free-text search covers names, areas and services.",
              "Filters stay pinned while scrolling so people can refine without losing their place.",
            ],
          },
          {
            title: "CTA strategy",
            points: [
              "Primary per card: Book Appointment (clinics/labs/boarding) or Call/Dispatch (ambulances/NGOs) — the CTA matches the provider type.",
              "Secondary: Directions and Call Now as icon buttons, always visible.",
              "Supply side: 'List Your Business' is sticky in the header and repeated in a dedicated band.",
              "Trust loop: 'Submit a Correction' on every card keeps data fresh without a big ops team.",
            ],
          },
          {
            title: "Attractive, intuitive & mobile-friendly",
            points: [
              "Warm white + emerald palette signals calm and care; red is reserved only for emergencies.",
              "Mobile: stacked search, horizontally scrolling filter chips, thumb-reachable buttons and a floating SOS button.",
              "Next steps: live availability from clinics, WhatsApp booking, reviews with photos, Gujarati/Hindi language toggle.",
            ],
          },
        ]}
      />

      {/* Floating mobile SOS */}
      <a
        href={`tel:${SOS_PHONE}`}
        aria-label="Call emergency pet ambulance"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-sos-gradient px-5 py-3.5 font-extrabold text-sos-foreground shadow-lift animate-pulse-ring md:hidden"
      >
        <Siren className="size-5" /> SOS
      </a>

      <BookingDialog provider={booking} onClose={() => setBooking(null)} />
      <CorrectionDialog provider={correcting} onClose={() => setCorrecting(null)} />
      <ListBusinessDialog open={listOpen} onOpenChange={setListOpen} />
    </div>
  );
}
