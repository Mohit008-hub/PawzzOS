import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-gradient text-primary-foreground">
            <PawPrint className="size-4" />
          </span>
          <div>
            <p className="font-display font-bold">Founder Suite</p>
            <p className="text-xs text-muted-foreground">
              Interactive prototype — Practo for Animals, AI Education & AI Content System.
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Practo for Animals</Link>
          <Link to="/education" className="hover:text-foreground">AI Education</Link>
          <Link to="/content-studio" className="hover:text-foreground">AI Content System</Link>
        </nav>
      </div>
    </footer>
  );
}
