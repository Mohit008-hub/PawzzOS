import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  Check,
  Instagram,
  Linkedin,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Type,
  Wand2,
} from "lucide-react";
import { useState } from "react";

import { ArchitectureDiagram } from "@/components/studio/ArchitectureDiagram";
import { CarouselPreview } from "@/components/studio/CarouselPreview";
import type { SlideTheme } from "@/components/studio/SlideCard";
import { FounderNotes } from "@/components/site/FounderNotes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  SAMPLE_HOOKS,
  SAMPLE_RESEARCH,
  SAMPLE_SLIDES,
  SAMPLE_TOPIC,
  type Hook,
  type Platform,
  type Research,
  type SlideSet,
} from "@/lib/carousel";
import { researchTopic, writeSlides } from "@/lib/carousel.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/content-studio")({
  head: () => ({
    meta: [
      { title: "AI Content System — Idea to Instagram & LinkedIn carousel" },
      {
        name: "description",
        content:
          "Type a raw idea and watch AI research it, write hooks and slide copy, and render an editable carousel ready to export.",
      },
      { property: "og:title", content: "AI Content System — Carousels without a designer" },
      {
        property: "og:description",
        content: "Founder prompt → AI research & hooks → slide copy → editable on-brand carousel. Plus the automation stack.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudioPage,
});

type Status = "idle" | "running" | "done" | "error";

const SUGGESTIONS = [
  "5 Daily Habits for Healthy Dogs",
  "Signs your cat needs a vet today",
  "How to help street dogs in summer",
  "3 AI automations every student should build",
];

const THEMES: { id: SlideTheme; label: string; swatch: string }[] = [
  { id: "emerald", label: "Emerald", swatch: "slide-theme-emerald" },
  { id: "sunset", label: "Sunset", swatch: "slide-theme-sunset" },
  { id: "ink", label: "Ink", swatch: "slide-theme-ink" },
];

function StudioPage() {
  const research = useServerFn(researchTopic);
  const write = useServerFn(writeSlides);

  const [topic, setTopic] = useState(SAMPLE_TOPIC);
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [brand, setBrand] = useState("Practo for Animals");
  const [handle, setHandle] = useState("@practoforanimals");
  const [theme, setTheme] = useState<SlideTheme>("emerald");

  const [isSample, setIsSample] = useState(true);
  const [s1, setS1] = useState<Status>("done");
  const [s2, setS2] = useState<Status>("done");
  const [error, setError] = useState<string | null>(null);
  const [res, setRes] = useState<Research>(SAMPLE_RESEARCH);
  const [hooks, setHooks] = useState<Hook[]>(SAMPLE_HOOKS);
  const [hookIdx, setHookIdx] = useState(2);
  const [set, setSet] = useState<SlideSet>(SAMPLE_SLIDES);

  const busy = s1 === "running" || s2 === "running";

  async function runSlides(r: Research, hook: string) {
    setS2("running");
    const out = await write({
      data: { topic, platform, brand, hook, angle: r.angle, insights: r.insights },
    }).catch(() => ({ ok: false as const, error: "Network error — please try again.", status: 0 }));
    if (!out.ok) {
      setS2("error");
      setError(out.error);
      return;
    }
    setSet(out.data);
    setS2("done");
  }

  async function generate() {
    if (topic.trim().length < 3) {
      setError("Enter a topic or idea with at least 3 characters.");
      return;
    }
    setError(null);
    setIsSample(false);
    setS1("running");
    setS2("idle");
    const out = await research({ data: { topic, platform, brand } }).catch(() => ({
      ok: false as const,
      error: "Network error — please try again.",
      status: 0,
    }));
    if (!out.ok) {
      setS1("error");
      setError(out.error);
      return;
    }
    setRes(out.data.research);
    setHooks(out.data.hooks);
    setHookIdx(0);
    setS1("done");
    await runSlides(out.data.research, out.data.hooks[0]?.text ?? topic);
  }

  async function useHook(k: number) {
    if (busy) return;
    setHookIdx(k);
    setError(null);
    setIsSample(false);
    await runSlides(res, hooks[k]?.text ?? topic);
  }

  return (
    <div>
      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-border bg-studio-soft/60">
        <div className="bg-dot-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <Badge variant="studio" className="px-3 py-1">
            <Sparkles className="mr-1.5 size-3.5" /> Live AI pipeline · no designer needed
          </Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] text-balance sm:text-5xl">
            One raw idea in. A <span className="font-serif font-normal italic text-studio">ready-to-post</span> carousel out.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            AI researches your topic, writes scroll-stopping hooks and slide copy, then renders on-brand Instagram & LinkedIn slides
            you can tweak inline and export.
          </p>
        </div>
      </section>

      <section id="generator" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-10 sm:px-6">
        <Tabs defaultValue="generator">
          <TabsList className="h-auto rounded-full bg-card p-1 shadow-soft">
            <TabsTrigger value="generator" className="rounded-full px-4 py-2 data-[state=active]:bg-studio data-[state=active]:text-studio-foreground">
              <Wand2 className="mr-1.5 size-4" /> Carousel Generator
            </TabsTrigger>
            <TabsTrigger value="architecture" className="rounded-full px-4 py-2 data-[state=active]:bg-studio data-[state=active]:text-studio-foreground">
              Automation Architecture
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              {/* INPUT PANEL */}
              <aside className="h-fit rounded-3xl border border-border bg-card p-5 shadow-soft lg:sticky lg:top-24">
                <label className="text-sm font-bold">Your raw topic or idea</label>
                <Textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value.slice(0, 200))}
                  rows={3}
                  className="mt-2 resize-none rounded-xl text-base"
                  placeholder="e.g. 5 Daily Habits for Healthy Dogs"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTopic(s)}
                      className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:border-studio/50 hover:text-studio"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <p className="mt-5 text-sm font-bold">Platform</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {(
                    [
                      ["instagram", Instagram, "Instagram"],
                      ["linkedin", Linkedin, "LinkedIn"],
                    ] as const
                  ).map(([id, Icon, label]) => (
                    <button
                      key={id}
                      onClick={() => setPlatform(id)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition",
                        platform === id ? "border-studio bg-studio-soft text-studio" : "border-border hover:border-studio/40",
                      )}
                    >
                      <Icon className="size-4" /> {label}
                    </button>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm font-bold">Brand</p>
                    <Input value={brand} onChange={(e) => setBrand(e.target.value.slice(0, 40))} className="mt-2 rounded-xl" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Handle</p>
                    <Input value={handle} onChange={(e) => setHandle(e.target.value.slice(0, 40))} className="mt-2 rounded-xl" />
                  </div>
                </div>

                <p className="mt-5 text-sm font-bold">Visual theme</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        "overflow-hidden rounded-xl border-2 text-xs font-semibold transition",
                        theme === t.id ? "border-studio" : "border-transparent",
                      )}
                    >
                      <span className={cn(t.swatch, "slide-surface flex h-12 items-end p-2")}>
                        <span className="slide-accent-bg rounded-full px-2 py-0.5 text-[10px]">Aa</span>
                      </span>
                      <span className="block bg-muted py-1">{t.label}</span>
                    </button>
                  ))}
                </div>

                <Button variant="studio" size="xl" className="mt-6 w-full" onClick={generate} disabled={busy}>
                  {busy ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  {busy ? "Generating…" : "Generate carousel"}
                </Button>
                {error && (
                  <p className="mt-3 flex gap-2 rounded-xl bg-sos-soft p-3 text-sm text-sos">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {error}
                  </p>
                )}
                {isSample && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Showing the sample carousel for “{SAMPLE_TOPIC}”. Hit Generate to run the live AI pipeline.
                  </p>
                )}
              </aside>

              {/* PIPELINE */}
              <div className="grid gap-6">
                <PipelineStep n={1} title="AI topic research & hook generation" icon={Search} status={s1}>
                  {s1 === "done" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3 text-sm">
                        <InfoRow icon={Target} label="Audience" value={res.audience} />
                        <InfoRow icon={Sparkles} label="Angle" value={res.angle} />
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Key insights</p>
                          <ul className="mt-1.5 space-y-1.5">
                            {res.insights.map((x) => (
                              <li key={x} className="flex gap-2">
                                <Check className="mt-0.5 size-4 shrink-0 text-studio" />
                                <span>{x}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Pick a cover hook</p>
                        <div className="mt-1.5 grid gap-2">
                          {hooks.map((h, k) => (
                            <button
                              key={h.text}
                              onClick={() => useHook(k)}
                              disabled={busy}
                              className={cn(
                                "rounded-xl border p-3 text-left transition disabled:cursor-wait",
                                hookIdx === k ? "border-studio bg-studio-soft" : "border-border hover:border-studio/40",
                              )}
                            >
                              <span className="flex items-center justify-between">
                                <Badge variant={hookIdx === k ? "studio" : "tag"}>{h.style}</Badge>
                                {hookIdx === k ? (
                                  <Check className="size-4 text-studio" />
                                ) : (
                                  <RefreshCw className="size-3.5 text-muted-foreground" />
                                )}
                              </span>
                              <span className="mt-1.5 block font-display text-sm font-bold">{h.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </PipelineStep>

                <PipelineStep n={2} title="Slide-by-slide copy outline" icon={Type} status={s2}>
                  {s2 === "done" && (
                    <ol className="grid gap-2">
                      {set.slides.map((s, k) => (
                        <li key={k} className="grid grid-cols-[32px_1fr] gap-3 rounded-xl border border-border p-3">
                          <span className="grid size-8 place-items-center rounded-lg bg-studio-soft font-display text-sm font-bold text-studio">{k + 1}</span>
                          <div>
                            <p className="font-display font-bold">{s.headline}</p>
                            <p className="text-sm text-muted-foreground">{s.body}</p>
                            <p className="mt-1 text-xs font-semibold text-studio">Callout · {s.callout}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </PipelineStep>

                <PipelineStep n={3} title="Interactive visual carousel preview" icon={Wand2} status={s2 === "done" ? "done" : s2 === "running" ? "running" : "idle"}>
                  {s2 === "done" && (
                    <CarouselPreview
                      slides={set.slides}
                      onChange={(slides) => setSet((x) => ({ ...x, slides }))}
                      theme={theme}
                      platform={platform}
                      brand={brand || "Brand"}
                      handle={handle || "@brand"}
                      caption={set.caption}
                      hashtags={set.hashtags}
                    />
                  )}
                </PipelineStep>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="mt-6 grid gap-6">
            <ArchitectureDiagram />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  t: "Recommended stack",
                  d: [
                    "AI: Claude Sonnet (voice) or GPT (structure) via API",
                    "Automation: n8n self-hosted (~₹500/mo) or Make",
                    "Design: Canva Pro Brand Kit + Autofill, or Placid",
                    "Storage: Airtable / Notion content calendar",
                    "Publishing: Buffer or Meta Business Suite",
                  ],
                },
                {
                  t: "Founder's weekly routine",
                  d: [
                    "Mon (10 min): drop 5 raw ideas into the form",
                    "Automation runs overnight → 5 carousels ready",
                    "Tue (20 min): review, tweak words in Canva, approve",
                    "Scheduler posts Wed–Sun automatically",
                    "Fri: analytics row feeds best hooks back into prompts",
                  ],
                },
                {
                  t: "Quality guardrails",
                  d: [
                    "Brand voice guide + 3 best past posts as few-shot examples",
                    "JSON schema with word limits per field",
                    "Locked template fonts/colors; only text is dynamic",
                    "Human approval step before anything is published",
                    "Vet-reviewed facts for health content",
                  ],
                },
              ].map((c) => (
                <div key={c.t} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="text-lg font-bold">{c.t}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {c.d.map((x) => (
                      <li key={x} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-studio" /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <FounderNotes
        tone="studio"
        intro="How this replaces an in-house designer for Instagram and LinkedIn carousels."
        notes={[
          {
            title: "The workflow",
            points: [
              "Raw idea → AI research → 3 hooks → slide-by-slide copy → template render → founder review → export/schedule.",
              "Splitting research and copy into two AI steps lets the founder pick the hook — the single biggest driver of reach.",
              "Every AI output is structured (headline/body/callout), so it drops straight into design templates.",
            ],
          },
          {
            title: "What runs live in this prototype",
            points: [
              "Steps 1 and 2 call a real AI model; step 3 renders on-brand slide templates in the browser.",
              "Inline editing and PNG export (1080×1350) simulate the 'minor edits & export' stage.",
              "In production, step 3 is swapped for Canva Autofill or Placid so the founder gets an editable Canva file.",
            ],
          },
          {
            title: "Why these tools",
            points: [
              "Claude/GPT: strong writing and reliable JSON. n8n/Make: visual, no-code, cheap to run.",
              "Canva: the founder already knows it, Brand Kit keeps consistency. Placid: fully API-driven alternative.",
              "Total running cost: roughly ₹2–4k/month vs. ₹30k+/month for a junior designer.",
            ],
          },
        ]}
      />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5" /> {label}
      </p>
      <p className="mt-1">{value}</p>
    </div>
  );
}

function PipelineStep({
  n,
  title,
  icon: Icon,
  status,
  children,
}: {
  n: number;
  title: string;
  icon: typeof Search;
  status: Status;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-3xl border bg-card p-5 shadow-soft transition", status === "running" ? "border-studio/60" : "border-border")}>
      <header className="flex items-center gap-3">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl",
            status === "done" ? "bg-studio text-studio-foreground" : status === "error" ? "bg-sos-soft text-sos" : "bg-studio-soft text-studio",
          )}
        >
          {status === "running" ? <Loader2 className="size-5 animate-spin" /> : status === "done" ? <Check className="size-5" /> : <Icon className="size-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Step {n}</p>
          <h2 className="font-display text-lg font-bold leading-tight">{title}</h2>
        </div>
        <Badge variant={status === "done" ? "studio" : status === "error" ? "sos" : "tag"}>
          {status === "idle" ? "Waiting" : status === "running" ? "Running" : status === "done" ? "Done" : "Failed"}
        </Badge>
      </header>
      {status === "running" && (
        <div className="mt-4 grid gap-2">
          {[0, 1, 2].map((k) => (
            <div
              key={k}
              className="h-4 animate-shimmer rounded-full bg-[linear-gradient(90deg,var(--muted),var(--studio-soft),var(--muted))] bg-[length:200%_100%]"
              style={{ width: `${90 - k * 18}%` }}
            />
          ))}
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </section>
  );
}
