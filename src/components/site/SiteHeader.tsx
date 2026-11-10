import { Link, useLocation } from "@tanstack/react-router";
import { GraduationCap, PawPrint, Sparkles, Store, Workflow } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListBusinessDialog } from "@/components/animals/ListBusinessDialog";
import { AccountMenu } from "@/components/site/AccountMenu";

const tabs = [
  { to: "/", label: "Practo for Animals", short: "Animal Care", icon: PawPrint, tone: "primary" },
  { to: "/education", label: "AI Education", short: "AI Education", icon: GraduationCap, tone: "edu" },
  { to: "/content-studio", label: "AI Content System", short: "Content AI", icon: Workflow, tone: "studio" },
] as const;

const activeTone = {
  primary: "bg-primary text-primary-foreground shadow-glow",
  edu: "bg-edu text-edu-foreground shadow-md",
  studio: "bg-studio text-studio-foreground shadow-md",
} as const;

export function SiteHeader() {
  const { pathname } = useLocation();
  const [listOpen, setListOpen] = useState(false);

  const cta =
    pathname === "/" ? (
      <Button variant="hero" size="sm" onClick={() => setListOpen(true)}>
        <Store /> <span className="hidden sm:inline">List Your Business</span>
        <span className="sm:hidden">List</span>
      </Button>
    ) : pathname.startsWith("/education") ? (
      <Button variant="edu" size="sm" asChild>
        <a href="#programs">
          <GraduationCap /> <span className="hidden sm:inline">Explore Programs</span>
          <span className="sm:hidden">Programs</span>
        </a>
      </Button>
    ) : (
      <Button variant="studio" size="sm" asChild>
        <a href="#generator">
          <Sparkles /> <span className="hidden sm:inline">Generate a Carousel</span>
          <span className="sm:hidden">Generate</span>
        </a>
      </Button>
    );

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-gradient text-primary-foreground shadow-glow">
            <PawPrint className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold tracking-tight">Founder Suite</span>
            <span className="block text-[11px] text-muted-foreground">Care · Learn · Create</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 rounded-full border border-border bg-card p-1 shadow-soft md:flex">
          {tabs.map((t) => {
            const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  active ? activeTone[t.tone] : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <t.icon className="size-4" />
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {cta}
          <AccountMenu />
        </div>
      </div>

      {/* Mobile tabs */}
      <nav className="scrollbar-none flex gap-1 overflow-x-auto border-t border-border/60 px-3 py-2 md:hidden">
        {tabs.map((t) => {
          const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex flex-1 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-all",
                active ? activeTone[t.tone] : "bg-muted text-muted-foreground",
              )}
            >
              <t.icon className="size-3.5" />
              {t.short}
            </Link>
          );
        })}
      </nav>

      <ListBusinessDialog open={listOpen} onOpenChange={setListOpen} />
    </header>
  );
}
