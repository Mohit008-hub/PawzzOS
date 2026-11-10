import { Link, useLocation } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Shown inside a dialog when an action needs an account. */
export function SignInGate({
  title,
  description,
  tone = "primary",
}: {
  title: string;
  description: string;
  tone?: "primary" | "edu";
}) {
  const { pathname } = useLocation();
  return (
    <div className="py-4 text-center">
      <span
        className={cn(
          "mx-auto grid size-14 place-items-center rounded-2xl",
          tone === "edu" ? "bg-edu-soft text-edu" : "bg-secondary text-secondary-foreground",
        )}
      >
        <LockKeyhole className="size-6" />
      </span>
      <h3 className="mt-4 font-display text-2xl font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Button variant={tone === "edu" ? "edu" : "hero"} size="lg" asChild>
          <Link to="/auth" search={{ redirect: pathname }}>Sign in</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/auth" search={{ redirect: pathname, mode: "signup" }}>Create account</Link>
        </Button>
      </div>
    </div>
  );
}
