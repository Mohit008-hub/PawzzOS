// Shared (client + server safe) carousel types and the built-in sample.
export type Platform = "instagram" | "linkedin";
export type Research = { audience: string; angle: string; insights: string[] };
export type Hook = { text: string; style: string };
export type Slide = { headline: string; body: string; callout: string };
export type SlideSet = { slides: Slide[]; caption: string; hashtags: string[] };

export type StepResult<T> = { ok: true; data: T } | { ok: false; error: string; status: number };

export const SAMPLE_TOPIC = "5 Daily Habits for Healthy Dogs";

export const SAMPLE_RESEARCH: Research = {
  audience: "First-time dog parents in Indian cities, 22–35, busy with work",
  angle: "Small daily rituals beat expensive vet visits — prevention you can do in 15 minutes a day.",
  insights: [
    "Most dog health issues vets see are preventable with routine care (dental, weight, parasites).",
    "Indian summers make hydration and walk timing critical — early morning and late evening.",
    "Mental stimulation reduces destructive behaviour as much as physical exercise.",
    "Weekly 2-minute body checks catch ticks, lumps and skin issues early.",
  ],
};

export const SAMPLE_HOOKS: Hook[] = [
  { text: "Your dog doesn't need more toys. It needs these 5 habits.", style: "Contrarian" },
  { text: "15 minutes a day can add years to your dog's life.", style: "Benefit-led" },
  { text: "Vets wish every dog parent did these 5 things daily.", style: "Authority" },
];

export const SAMPLE_SLIDES: SlideSet = {
  slides: [
    {
      headline: "Vets wish every dog parent did these 5 things daily",
      body: "Small rituals. Big health wins. Save this for later.",
      callout: "Swipe →",
    },
    {
      headline: "1. Walk at the right time",
      body: "Go before 8 AM or after 6 PM. Hot pavement burns paws — test it with your palm for 5 seconds.",
      callout: "30–60 min/day",
    },
    {
      headline: "2. Fresh water, twice a day",
      body: "Refill and rinse the bowl morning and evening. Add a second bowl in summer.",
      callout: "Dehydration is the #1 summer risk",
    },
    {
      headline: "3. Brush teeth & check the body",
      body: "2 minutes of brushing + a quick feel for ticks, lumps and sore spots. Catch problems early.",
      callout: "80% of dogs have dental disease by age 3",
    },
    {
      headline: "4. Feed the brain, not just the bowl",
      body: "Sniff walks, lick mats and 5-minute training sessions tire dogs out more than fetch. Need a vet? Find one near you on Practo for Animals.",
      callout: "Follow for more pet-care tips",
    },
  ],
  caption:
    "Healthy dogs aren't built at the vet — they're built at home, one small habit at a time. Which of these does your pup already do? 🐾 Save this and share it with a fellow dog parent.",
  hashtags: ["#DogCare", "#PetParents", "#DogHealth", "#AhmedabadDogs", "#PractoForAnimals"],
};
