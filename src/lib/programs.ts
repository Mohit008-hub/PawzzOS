export type Program = {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  format: string;
  level: string;
  price: string;
  seatsLeft: number;
  skills: string[];
  outcomes: string[];
  tools: string[];
  modules: { week: string; title: string; topics: string[] }[];
};

export const PROGRAMS: Program[] = [
  {
    id: "automation",
    title: "AI Automation & No-Code Engineering",
    tagline: "Build workflows that run a business while you sleep.",
    duration: "8 weeks",
    format: "Live weekend cohort",
    level: "Beginner friendly",
    price: "₹14,999",
    seatsLeft: 12,
    skills: ["n8n & Make", "API basics", "AI agents", "Airtable / Sheets", "Webhooks"],
    outcomes: ["Lead-capture → CRM → WhatsApp bot", "AI inbox triage agent", "Freelance-ready portfolio of 4 automations"],
    tools: ["n8n", "Make", "ChatGPT", "Claude", "Airtable"],
    modules: [
      { week: "Week 1–2", title: "Automation thinking", topics: ["Map a business process", "Triggers, actions & data", "Your first Make scenario"] },
      { week: "Week 3–4", title: "APIs & AI in the loop", topics: ["REST & webhooks without code", "Calling GPT/Claude from n8n", "Structured outputs & error handling"] },
      { week: "Week 5–6", title: "Agents that do real work", topics: ["Tools & memory", "Email / WhatsApp agents", "Human-in-the-loop approvals"] },
      { week: "Week 7–8", title: "Capstone & go-to-market", topics: ["Build for a real client", "Pricing automation services", "Demo day"] },
    ],
  },
  {
    id: "genai-design",
    title: "Generative AI for Product Designers",
    tagline: "Ship UI, brand and prototypes 5× faster with AI.",
    duration: "6 weeks",
    format: "Live evenings + studio",
    level: "Some design basics",
    price: "₹12,499",
    seatsLeft: 8,
    skills: ["Figma + AI", "Midjourney / Firefly", "Design systems", "AI prototyping", "UX research with AI"],
    outcomes: ["A shipped landing page built with Lovable", "Brand kit generated & refined with AI", "Case study for your portfolio"],
    tools: ["Figma", "Lovable", "Midjourney", "Canva", "ChatGPT"],
    modules: [
      { week: "Week 1", title: "AI-native design process", topics: ["Where AI helps (and hurts)", "Prompting for visuals", "Moodboards in minutes"] },
      { week: "Week 2–3", title: "From wireframe to prototype", topics: ["Figma AI & plugins", "Design systems & tokens", "Clickable prototypes with Lovable"] },
      { week: "Week 4–5", title: "Brand & content at scale", topics: ["Image generation pipelines", "Canva templates & brand kits", "Accessibility checks"] },
      { week: "Week 6", title: "Portfolio sprint", topics: ["Case study writing", "Peer critique", "Showcase"] },
    ],
  },
  {
    id: "prompt-content",
    title: "Prompt Engineering & Content Engines",
    tagline: "Turn one idea into a month of on-brand content.",
    duration: "4 weeks",
    format: "Self-paced + live labs",
    level: "Beginner friendly",
    price: "₹7,999",
    seatsLeft: 20,
    skills: ["Prompt patterns", "Brand voice systems", "Carousel & reel scripts", "Content calendars", "Analytics loops"],
    outcomes: ["Personal prompt library (50+ prompts)", "Auto-carousel engine (idea → Canva)", "30-day content calendar"],
    tools: ["ChatGPT", "Claude", "Canva", "Placid", "Notion"],
    modules: [
      { week: "Week 1", title: "Prompting that works", topics: ["Role, context, constraints", "Few-shot & chain-of-thought", "Evaluating outputs"] },
      { week: "Week 2", title: "Brand voice & research", topics: ["Voice guides as prompts", "AI research workflows", "Hooks that stop the scroll"] },
      { week: "Week 3", title: "Content engines", topics: ["Carousel pipelines", "Template APIs (Canva/Placid)", "Scheduling & repurposing"] },
      { week: "Week 4", title: "Measure & iterate", topics: ["Reading analytics", "A/B testing hooks", "Final engine demo"] },
    ],
  },
];

export const LEARNING_GOALS = [
  { id: "job", label: "Land an AI-ready job", desc: "Portfolio + interview prep" },
  { id: "freelance", label: "Start freelancing", desc: "Sell automations & content" },
  { id: "business", label: "Grow my business", desc: "Automate ops & marketing" },
  { id: "explore", label: "Just exploring AI", desc: "Get practical foundations" },
] as const;

export const PROJECTS = [
  {
    title: "WhatsApp clinic receptionist",
    student: "Aarav, 21 · B.Tech student",
    program: "automation",
    stack: ["n8n", "WhatsApp API", "GPT"],
    result: "Books 60+ vet appointments/week for a local clinic",
  },
  {
    title: "D2C brand kit in a weekend",
    student: "Meera, 24 · Junior designer",
    program: "genai-design",
    stack: ["Midjourney", "Figma", "Lovable"],
    result: "Full brand + landing page shipped in 48 hours",
  },
  {
    title: "LinkedIn carousel engine",
    student: "Kabir, 26 · Marketing exec",
    program: "prompt-content",
    stack: ["Claude", "Make", "Canva"],
    result: "3× follower growth in 6 weeks, 2 hrs/week effort",
  },
  {
    title: "AI lead-scoring pipeline",
    student: "Isha, 23 · Sales associate",
    program: "automation",
    stack: ["Make", "Airtable", "Claude"],
    result: "Cut manual lead review time by 80%",
  },
] as const;
