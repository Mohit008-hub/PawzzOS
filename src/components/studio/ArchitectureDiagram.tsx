import { ArrowDown, ArrowRight, Bot, Image as ImageIcon, LayoutTemplate, Lightbulb, Play, Workflow } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NODES = [
  {
    id: "prompt",
    icon: Lightbulb,
    title: "Founder Prompt",
    tools: "Google Form · Notion · WhatsApp · this dashboard",
    input: "Raw idea, e.g. “5 daily habits for healthy dogs”",
    output: "Topic + platform + brand row in Airtable / Sheets",
    detail: "The founder drops ideas anywhere they already work. A form or a Notion database row becomes the trigger — no new tool to learn.",
    time: "1 min",
  },
  {
    id: "llm",
    icon: Bot,
    title: "Claude / ChatGPT API",
    tools: "Claude Sonnet or GPT via API, optional Perplexity for research",
    input: "Topic + brand voice guide + few-shot examples",
    output: "JSON: research, 3 hooks, 5 slides (headline / body / callout), caption, hashtags",
    detail: "Two chained prompts: (1) research & hooks, (2) slide copy from the chosen hook. Structured JSON output means every field maps 1:1 to a template layer.",
    time: "~20 s",
  },
  {
    id: "automation",
    icon: Workflow,
    title: "n8n / Make Automation",
    tools: "n8n (self-hosted, cheapest) or Make (no-code, fastest)",
    input: "Trigger from the idea row + AI JSON",
    output: "Mapped fields → template API calls, approval message to founder",
    detail: "Orchestrates the whole run: calls the AI, validates JSON, picks the brand template, sends to Canva/Placid, then posts a preview to Slack/WhatsApp for approval.",
    time: "~5 s",
  },
  {
    id: "template",
    icon: LayoutTemplate,
    title: "Canva / Placid Template API",
    tools: "Canva Autofill API (Brand Kit) or Placid / Bannerbear",
    input: "Headline, body, callout per slide + theme + logo",
    output: "5 on-brand 1080×1350 slides, editable in Canva",
    detail: "Designer-made templates with locked brand fonts and colors. Only text layers are dynamic, so quality stays consistent without a designer on every post.",
    time: "~15 s",
  },
  {
    id: "output",
    icon: ImageIcon,
    title: "Auto Carousel Output",
    tools: "Canva editor link · PNG/PDF export · Buffer / Meta scheduler",
    input: "Rendered slides + caption",
    output: "Founder reviews, tweaks a word, exports or schedules",
    detail: "The founder gets an editable Canva link plus ready PNGs/PDF. One-click approve sends it to Buffer or Meta Business Suite for scheduling.",
    time: "2–5 min review",
  },
] as const;

export function ArchitectureDiagram() {
  const [active, setActive] = useState(0);
  const [running, setRunning] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function simulate() {
    let k = 0;
    const tick = () => {
      setRunning(k);
      setActive(k);
      k++;
      if (k < NODES.length) timer.current = setTimeout(tick, 900);
      else timer.current = setTimeout(() => setRunning(-1), 1200);
    };
    tick();
  }

  const node = NODES[active] ?? NODES[0];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-ink p-5 text-ink-foreground sm:p-8">
      <div className="bg-dot-grid-ink absolute inset-0" />
      <div className="relative">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-studio">Backend automation stack</p>
            <h3 className="mt-1 text-2xl font-bold">From one idea to a ready-to-post carousel</h3>
          </div>
          <Button variant="studio" onClick={simulate} disabled={running >= 0}>
            <Play /> {running >= 0 ? "Running…" : "Simulate a run"}
          </Button>
        </div>

        <div className="mt-8 flex flex-col items-stretch gap-2 lg:flex-row">
          {NODES.map((n, k) => (
            <div key={n.id} className="flex flex-col items-center gap-2 lg:flex-1 lg:flex-row lg:items-stretch">
              <button
                onClick={() => setActive(k)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition lg:h-full",
                  active === k
                    ? "border-studio bg-studio/20 shadow-lg"
                    : "border-ink-foreground/15 bg-ink-foreground/5 hover:border-ink-foreground/30",
                  running === k && "animate-pulse",
                )}
              >
                <span className={cn("grid size-10 place-items-center rounded-xl", active === k ? "bg-studio text-studio-foreground" : "bg-ink-foreground/10")}>
                  <n.icon className="size-5" />
                </span>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-ink-muted">Step {k + 1}</p>
                <p className="font-display text-sm font-bold leading-tight">{n.title}</p>
                <p className="mt-1 text-[11px] text-ink-muted">{n.time}</p>
              </button>
              {k < NODES.length - 1 && (
                <span className={cn("shrink-0 self-center transition", running > k ? "text-studio" : "text-ink-muted")}>
                  <ArrowRight className="hidden size-5 lg:block" />
                  <ArrowDown className="size-5 lg:hidden" />
                </span>
              )}
            </div>
          ))}
        </div>

        <div key={node.id} className="mt-6 grid animate-rise gap-4 rounded-2xl border border-ink-foreground/10 bg-ink-foreground/5 p-5 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-display text-lg font-bold">{node.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{node.detail}</p>
            <p className="mt-3 text-xs font-semibold text-studio">Tools: {node.tools}</p>
          </div>
          <div className="grid gap-3 text-sm">
            <div className="rounded-xl bg-ink-foreground/5 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Input</p>
              <p className="mt-1">{node.input}</p>
            </div>
            <div className="rounded-xl bg-ink-foreground/5 p-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Output</p>
              <p className="mt-1">{node.output}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
