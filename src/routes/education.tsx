import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Briefcase,
  CalendarClock,
  Check,
  Clock,
  Layers,
  PlayCircle,
  Quote,
  Rocket,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";

import eduHero from "@/assets/edu-hero.jpg";
import { RegistrationDialog, type RegMode } from "@/components/education/RegistrationDialog";
import { FounderNotes } from "@/components/site/FounderNotes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROGRAMS, PROJECTS } from "@/lib/programs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "AI Education — Practical AI & digital-skills programs" },
      {
        name: "description",
        content:
          "Live, project-based AI programs for students and young professionals: automation, generative AI design and prompt engineering.",
      },
      { property: "og:title", content: "Master Practical AI & Build Future-Proof Digital Systems" },
      {
        property: "og:description",
        content: "Cohort-based AI automation, design and content programs. Book a free demo class.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EducationPage,
});

const VALUE_BADGES = [
  { icon: Rocket, label: "Build 4+ real projects" },
  { icon: Users, label: "Live mentor cohorts" },
  { icon: Award, label: "Industry certificate" },
  { icon: Briefcase, label: "Internship & freelance support" },
];

function EducationPage() {
  const [reg, setReg] = useState<{ open: boolean; mode: RegMode; programId?: string | undefined }>({ open: false, mode: "enroll" });
  const [curriculum, setCurriculum] = useState(PROGRAMS[0]!.id);
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [activeProject, setActiveProject] = useState(0);

  const openReg = (mode: RegMode, programId?: string) => setReg({ open: true, mode, programId });
  const cur = PROGRAMS.find((p) => p.id === curriculum)!;
  const projects = PROJECTS.filter((p) => projectFilter === "all" || p.program === projectFilter);
  const shown = projects[Math.min(activeProject, projects.length - 1)];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div className="bg-dot-grid-ink absolute inset-0" />
        <div className="bg-edu-glow absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="animate-rise">
            <Badge variant="edu" className="px-3 py-1">
              <CalendarClock className="mr-1.5 size-3.5" /> Next cohort starts in 12 days · 40 seats
            </Badge>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
              Master Practical AI & Build{" "}
              <span className="font-serif font-normal italic text-edu">Future-Proof</span> Digital Systems
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-muted">
              Hands-on programs for students and young professionals. Less theory, more shipping — automate workflows,
              design with AI and build content engines employers and clients pay for.
            </p>
            <div className="mt-6 grid max-w-lg grid-cols-2 gap-2">
              {VALUE_BADGES.map((v) => (
                <div key={v.label} className="flex items-center gap-2 rounded-xl border border-ink-foreground/10 bg-ink-foreground/5 px-3 py-2 text-sm font-medium">
                  <v.icon className="size-4 shrink-0 text-edu" /> {v.label}
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="edu" size="xl" asChild>
                <a href="#programs">
                  Explore Programs <ArrowRight />
                </a>
              </Button>
              <Button variant="outline-ink" size="xl" onClick={() => openReg("demo")}>
                <PlayCircle /> Book Free Demo Class
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-ink-muted">
              <div className="flex">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="-ml-2 grid size-8 place-items-center rounded-full border-2 border-ink bg-edu-soft text-xs font-bold text-edu first:ml-0">
                    {["A", "M", "K", "I"][i]}
                  </span>
                ))}
              </div>
              <span>
                <strong className="text-ink-foreground">2,400+ learners</strong> · 4.9
                <Star className="mx-1 inline size-3.5 fill-star text-star" />
                average
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2rem] border border-ink-foreground/10 shadow-lift">
              <img src={eduHero} alt="Students building AI automation projects together" width={1536} height={1024} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-lift sm:left-auto sm:w-72">
              <p className="text-xs font-bold uppercase tracking-wider text-edu">Outcome snapshot</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                {[
                  ["87%", "ship a client project"],
                  ["₹35k", "avg. first freelance gig"],
                  ["6 wks", "to first portfolio"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display text-lg font-extrabold">{n}</p>
                    <p className="text-[10px] leading-tight text-muted-foreground">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGO / TOOLS STRIP */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-6 text-sm font-semibold text-muted-foreground sm:px-6">
          <span className="text-xs uppercase tracking-wider">Tools you'll master</span>
          {["ChatGPT", "Claude", "n8n", "Make", "Figma", "Lovable", "Canva", "Midjourney"].map((t) => (
            <span key={t} className="font-display text-base">{t}</span>
          ))}
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-edu">Programs</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Pick a path. Ship real work by week two.</h2>
          <p className="mt-3 text-muted-foreground">Every program ends with portfolio projects reviewed by industry mentors.</p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {PROGRAMS.map((p, i) => (
            <article
              key={p.id}
              className={cn(
                "group relative flex flex-col rounded-3xl border bg-card p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift",
                i === 0 ? "border-edu/50 ring-1 ring-edu/30" : "border-border",
              )}
            >
              {i === 0 && (
                <span className="absolute -top-3 left-6 rounded-full bg-edu px-3 py-1 text-xs font-bold text-edu-foreground">Most popular</span>
              )}
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Clock className="size-3.5" /> {p.duration} <span>·</span> {p.format}
              </div>
              <h3 className="mt-3 text-xl font-bold leading-snug">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.tagline}</p>

              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">Skills covered</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <Badge key={s} variant="tag">{s}</Badge>
                ))}
              </div>

              <p className="mt-5 text-xs font-bold uppercase tracking-wider text-muted-foreground">You'll build</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {p.outcomes.map((o) => (
                  <li key={o} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-edu" /> {o}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <div className="flex items-end justify-between border-t border-border pt-4">
                  <div>
                    <p className="font-display text-2xl font-extrabold">{p.price}</p>
                    <p className="text-xs text-muted-foreground">EMI from ₹1,299/mo · {p.level}</p>
                  </div>
                  <span className="text-xs font-semibold text-sos">{p.seatsLeft} seats left</span>
                </div>
                <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
                  <Button variant="edu" size="lg" onClick={() => openReg("enroll", p.id)}>
                    Enroll Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setCurriculum(p.id);
                      document.getElementById("curriculum")?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Syllabus
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CURRICULUM */}
      <section id="curriculum" className="scroll-mt-28 bg-edu-soft/50">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-edu">Curriculum preview</p>
            <h2 className="mt-2 text-3xl font-bold">Week by week, project by project.</h2>
            <div className="mt-6 grid gap-2">
              {PROGRAMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCurriculum(p.id)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
                    curriculum === p.id ? "border-edu bg-card shadow-soft" : "border-transparent hover:bg-card/60",
                  )}
                >
                  {p.title}
                  <ArrowRight className={cn("size-4 transition", curriculum === p.id ? "text-edu" : "opacity-0")} />
                </button>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {cur.tools.map((t) => (
                <Badge key={t} variant="edu">{t}</Badge>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-2 shadow-soft sm:p-4">
            <Accordion type="single" collapsible defaultValue="m-0" key={cur.id}>
              {cur.modules.map((m, i) => (
                <AccordionItem key={m.title} value={`m-${i}`} className="px-3">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-4 text-left">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-edu-soft font-display text-sm font-bold text-edu">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block text-xs font-semibold text-muted-foreground">{m.week}</span>
                        <span className="block font-display text-base font-bold">{m.title}</span>
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="ml-14 space-y-2">
                      {m.topics.map((t) => (
                        <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BadgeCheck className="size-4 text-edu" /> {t}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="m-3 flex flex-col items-start justify-between gap-3 rounded-2xl bg-ink p-4 text-ink-foreground sm:flex-row sm:items-center">
              <p className="text-sm">Not sure it's for you? Sit in on a live class first.</p>
              <Button variant="edu" onClick={() => openReg("demo", cur.id)}>
                Book Free Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-edu">Student project showcase</p>
            <h2 className="mt-2 text-3xl font-bold">Real projects. Real results.</h2>
          </div>
          <div className="scrollbar-none flex gap-1 overflow-x-auto rounded-full border border-border bg-card p-1">
            {[{ id: "all", title: "All" }, ...PROGRAMS.map((p) => ({ id: p.id, title: p.title.split(" ").slice(0, 2).join(" ") }))].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setProjectFilter(f.id);
                  setActiveProject(0);
                }}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition",
                  projectFilter === f.id ? "bg-ink text-ink-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.title}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-3">
            {projects.map((p, i) => (
              <button
                key={p.title}
                onClick={() => setActiveProject(i)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition",
                  shown === p ? "border-edu bg-edu-soft shadow-soft" : "border-border bg-card hover:border-edu/40",
                )}
              >
                <p className="font-display font-bold">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.student}</p>
              </button>
            ))}
          </div>
          {shown && (
            <div key={shown.title} className="relative animate-rise overflow-hidden rounded-3xl bg-ink p-8 text-ink-foreground">
              <div className="bg-edu-glow absolute inset-0" />
              <div className="relative">
                <Layers className="size-8 text-edu" />
                <h3 className="mt-4 text-2xl font-bold">{shown.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{shown.student}</p>
                <div className="mt-6 rounded-2xl border border-ink-foreground/10 bg-ink-foreground/5 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-edu">Result</p>
                  <p className="mt-1 font-display text-xl font-bold">{shown.result}</p>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {shown.stack.map((s, i) => (
                    <span key={s} className="flex items-center gap-2">
                      <span className="rounded-lg bg-ink-foreground/10 px-3 py-1.5 text-sm font-semibold">{s}</span>
                      {i < shown.stack.length - 1 && <ArrowRight className="size-4 text-edu" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { q: "I automated my dad's shop billing in week 3. Now I freelance for 4 local businesses.", n: "Rohan D.", r: "2nd-year B.Com" },
            { q: "The mentors review your work like a real design lead would. My portfolio finally looks professional.", n: "Sneha P.", r: "UI designer" },
            { q: "My carousel engine saves me 6 hours a week. Best ₹8k I've spent on my career.", n: "Arjun M.", r: "Marketing associate" },
          ].map((t) => (
            <figure key={t.n} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <Quote className="size-6 text-edu" />
              <blockquote className="mt-3 text-sm leading-relaxed">{t.q}</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-bold">{t.n}</span> <span className="text-muted-foreground">· {t.r}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-edu p-8 text-edu-foreground sm:p-12">
          <div className="bg-dot-grid-ink absolute inset-0" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Your first AI project starts this weekend.</h2>
              <p className="mt-2 opacity-90">Free 60-minute live demo. Build a mini automation with a mentor.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="ink" size="xl" onClick={() => openReg("demo")}>
                <PlayCircle /> Book Free Demo Class
              </Button>
              <Button variant="outline-ink" size="xl" className="border-edu-foreground/40 text-edu-foreground" onClick={() => openReg("enroll")}>
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FounderNotes
        tone="edu"
        intro="How the landing page is structured to turn curious visitors into registered learners."
        notes={[
          {
            title: "Page structure",
            points: [
              "Hero → tools strip → programs → curriculum → project showcase → testimonials → final CTA.",
              "Each section answers one objection in order: 'Is it practical?', 'Which program?', 'What will I learn?', 'Does it work?'.",
            ],
          },
          {
            title: "Value proposition",
            points: [
              "Practical over theoretical: every program is defined by what you'll build, not lectures.",
              "Outcome badges (projects, mentors, certificate, freelance support) sit right under the headline.",
              "Pricing, EMI and seats-left are visible on each card to reduce friction and create urgency honestly.",
            ],
          },
          {
            title: "Registration & lead-capture journey",
            points: [
              "Two CTAs everywhere: 'Enroll Now' (high intent) and 'Book Free Demo Class' (low commitment).",
              "A 4-step modal asks one thing at a time — name, contact, goal — so the first step feels effortless.",
              "Instant confirmation preview (ticket + what happens next) builds trust and reduces no-shows.",
              "Production wiring: form → CRM (HubSpot/Airtable) → WhatsApp confirmation via n8n → counsellor call task.",
            ],
          },
        ]}
      />

      <RegistrationDialog
        open={reg.open}
        onOpenChange={(o) => setReg((r) => ({ ...r, open: o }))}
        mode={reg.mode}
        programId={reg.programId}
      />
    </div>
  );
}
