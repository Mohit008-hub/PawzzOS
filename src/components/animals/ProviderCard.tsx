import { CalendarCheck, Flag, Home, MapPin, Navigation, Phone, ShieldCheck, Siren, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { directionsUrl, type Provider } from "@/lib/providers";

export function ProviderCard({
  p,
  onBook,
  onCorrect,
}: {
  p: Provider;
  onBook: (p: Provider) => void;
  onCorrect: (p: Provider) => void;
}) {
  const bookable = p.category !== "Pet Ambulance" && p.category !== "Rescue NGOs";
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          width={1024}
          height={768}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <Badge variant={p.openNow ? "open" : "closed"} className="bg-card/95 backdrop-blur">
            <span className={p.openNow ? "mr-1.5 size-1.5 rounded-full bg-primary" : "mr-1.5 size-1.5 rounded-full bg-muted-foreground"} />
            {p.openNow ? "Open now" : "Closed"}
          </Badge>
          <span className="rounded-full bg-card/95 px-2.5 py-0.5 text-xs font-semibold backdrop-blur">
            {p.distanceKm.toFixed(1)} km
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</p>
            <h3 className="mt-1 truncate text-lg font-bold">{p.name}</h3>
          </div>
          <div className="shrink-0 text-right">
            <span className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-sm font-bold text-secondary-foreground">
              <Star className="size-3.5 fill-star text-star" />
              {p.rating.toFixed(1)}
            </span>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{p.reviews.toLocaleString("en-IN")} reviews</p>
          </div>
        </div>

        <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          <span className="line-clamp-1">{p.address}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{p.hours}{p.fee ? ` · ${p.fee}` : ""}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.open247 && (
            <Badge variant="sos">
              <Siren className="mr-1 size-3" />
              24/7
            </Badge>
          )}
          {p.icu && <Badge variant="tag">ICU</Badge>}
          {p.homeVisits && (
            <Badge variant="tag">
              <Home className="mr-1 size-3" />
              Home visits
            </Badge>
          )}
          {p.verifiedNgo && (
            <Badge variant="open">
              <ShieldCheck className="mr-1 size-3" />
              Verified NGO
            </Badge>
          )}
          {p.services.slice(0, 2).map((s) => (
            <Badge key={s} variant="tag">
              {s}
            </Badge>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2">
            {bookable ? (
              <Button variant="hero" onClick={() => onBook(p)}>
                <CalendarCheck /> Book Appointment
              </Button>
            ) : (
              <Button variant={p.category === "Pet Ambulance" ? "sos" : "hero"} asChild>
                <a href={`tel:${p.phone}`}>
                  <Phone /> {p.category === "Pet Ambulance" ? "Dispatch now" : "Call helpline"}
                </a>
              </Button>
            )}
            <Button variant="outline" size="icon" asChild aria-label={`Directions to ${p.name}`}>
              <a href={directionsUrl(p)} target="_blank" rel="noreferrer">
                <Navigation />
              </a>
            </Button>
            <Button variant="outline" size="icon" asChild aria-label={`Call ${p.name}`}>
              <a href={`tel:${p.phone}`}>
                <Phone />
              </a>
            </Button>
          </div>
          <button
            type="button"
            onClick={() => onCorrect(p)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            <Flag className="size-3" /> Submit a correction
          </button>
        </div>
      </div>
    </article>
  );
}
