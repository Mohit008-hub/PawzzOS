import { Lightbulb } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type Note = { title: string; points: string[] };

const toneMap = {
  primary: "bg-secondary text-secondary-foreground",
  edu: "bg-edu-soft text-edu",
  studio: "bg-studio-soft text-studio",
} as const;

/** "Why it's built this way" — product thinking that accompanies each prototype. */
export function FounderNotes({
  tone,
  intro,
  notes,
}: {
  tone: keyof typeof toneMap;
  intro: string;
  notes: Note[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-soft md:grid-cols-[320px_1fr] md:p-10">
        <div>
          <span className={cn("inline-flex size-11 items-center justify-center rounded-2xl", toneMap[tone])}>
            <Lightbulb className="size-5" />
          </span>
          <h2 className="mt-4 text-2xl font-bold">Product notes</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</p>
        </div>
        <Accordion type="single" collapsible defaultValue="n-0" className="w-full">
          {notes.map((n, i) => (
            <AccordionItem key={n.title} value={`n-${i}`}>
              <AccordionTrigger className="text-left font-display text-base font-semibold">
                {n.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {n.points.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/40" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
