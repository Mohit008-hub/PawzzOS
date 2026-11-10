import { CheckCircle2, Flag } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Provider } from "@/lib/providers";

import { Field } from "./ListBusinessDialog";

const ISSUES = ["Wrong phone number", "Wrong timings", "Wrong address / location", "Permanently closed", "Services listed incorrectly", "Other"];

export function CorrectionDialog({ provider, onClose }: { provider: Provider | null; onClose: () => void }) {
  const [issues, setIssues] = useState<string[]>([]);
  const [detail, setDetail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function close() {
    onClose();
    setTimeout(() => {
      setDone(false);
      setIssues([]);
      setDetail("");
      setError("");
    }, 300);
  }

  return (
    <Dialog open={!!provider} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto size-14 text-primary" />
            <h3 className="mt-4 text-xl font-bold">Thanks for keeping listings accurate</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We'll verify with {provider?.name} and update the listing, usually within 48 hours.
            </p>
            <Button variant="hero" className="mt-6" onClick={close}>
              Close
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            <DialogHeader>
              <div className="mb-1 grid size-11 place-items-center rounded-2xl bg-sos-soft text-sos">
                <Flag className="size-5" />
              </div>
              <DialogTitle>Submit a correction</DialogTitle>
              <DialogDescription>{provider?.name}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-wrap gap-2">
              {ISSUES.map((i) => {
                const on = issues.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIssues((s) => (on ? s.filter((x) => x !== i) : [...s, i]))}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                      on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50",
                    )}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
            <Field label="What's the correct information?" error={error}>
              <Textarea value={detail} onChange={(e) => setDetail(e.target.value.slice(0, 500))} rows={3} placeholder="e.g. They now close at 8 PM on Sundays" />
            </Field>
            <Button
              variant="hero"
              onClick={() => {
                if (issues.length === 0) return setError("Pick at least one issue");
                setDone(true);
              }}
            >
              Send correction
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
