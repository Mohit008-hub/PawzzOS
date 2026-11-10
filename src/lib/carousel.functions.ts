import { createServerFn } from "@tanstack/react-start";
import { z } from "zod/v4";

import type { Hook, Research, SlideSet, StepResult } from "./carousel";

const platformSchema = z.enum(["instagram", "linkedin"]);

const step1Input = z.object({
  topic: z.string().trim().min(3).max(200),
  platform: platformSchema,
  brand: z.string().trim().max(120),
});

const step2Input = step1Input.extend({
  hook: z.string().trim().min(3).max(300),
  angle: z.string().max(600),
  insights: z.array(z.string().max(400)).max(8),
});

const researchSchema = z.object({
  audience: z.string(),
  angle: z.string(),
  insights: z.array(z.string()),
  hooks: z.array(z.object({ text: z.string(), style: z.string() })),
});

const slidesSchema = z.object({
  slides: z.array(z.object({ headline: z.string(), body: z.string(), callout: z.string() })),
  caption: z.string(),
  hashtags: z.array(z.string()),
});

const SYSTEM = `You are a senior social-media strategist and copywriter for a founder who runs "Practo for Animals" (an animal-care discovery platform in India) and an AI education brand. You write punchy, warm, expert, India-relevant carousel content. Plain language, no emojis inside slide copy, no clichés like "unlock" or "game-changer".`;

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => step1Input.parse(input))
  .handler(async ({ data }): Promise<StepResult<{ research: Research; hooks: Hook[] }>> => {
    const { generateStructured, AiError } = await import("./ai/gateway.server");
    try {
      const { data: out } = await generateStructured({
        schema: researchSchema,
        instructions: SYSTEM,
        prompt: `Step 1 — Topic research & hook generation for a ${data.platform} carousel.
Topic / raw idea: "${data.topic}"
Brand context: ${data.brand || "Practo for Animals"}

Return:
- audience: one sentence describing the exact target reader.
- angle: one sentence with the unique angle that makes this worth saving.
- insights: exactly 4 short, factual, specific insights (max 22 words each) the carousel should use.
- hooks: exactly 3 scroll-stopping cover hooks (max 12 words each), each with a different style label (e.g. Contrarian, Benefit-led, Authority, Curiosity, Number).`,
      });
      return {
        ok: true,
        data: {
          research: { audience: out.audience, angle: out.angle, insights: out.insights.slice(0, 5) },
          hooks: out.hooks.slice(0, 3),
        },
      };
    } catch (e) {
      const err = e instanceof AiError ? e : new AiError("Something went wrong.", 500);
      return { ok: false, error: err.message, status: err.status };
    }
  });

export const writeSlides = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => step2Input.parse(input))
  .handler(async ({ data }): Promise<StepResult<SlideSet>> => {
    const { generateStructured, AiError } = await import("./ai/gateway.server");
    try {
      const { data: out } = await generateStructured({
        schema: slidesSchema,
        instructions: SYSTEM,
        prompt: `Step 2 — Slide-by-slide copy for a 5-slide ${data.platform} carousel.
Topic: "${data.topic}"
Cover hook (use as slide 1 headline, you may tighten it): "${data.hook}"
Angle: ${data.angle}
Insights to draw from:
${data.insights.map((i) => `- ${i}`).join("\n")}
Brand: ${data.brand || "Practo for Animals"}

Rules:
- Exactly 5 slides. Slide 1 = cover (hook headline, short teaser body, callout like "Swipe →"). Slides 2–4 = one numbered, actionable point each. Slide 5 = final point or takeaway plus a soft CTA mentioning the brand.
- headline: max 9 words. body: max 28 words, concrete and specific. callout: max 7 words (a stat, tip, or CTA).
- caption: 2–3 sentences for the post caption${data.platform === "linkedin" ? ", professional but human" : ", warm and conversational"}.
- hashtags: 5 relevant hashtags, each starting with #.`,
      });
      return {
        ok: true,
        data: {
          slides: out.slides.slice(0, 5),
          caption: out.caption,
          hashtags: out.hashtags.slice(0, 6).map((h) => (h.startsWith("#") ? h : `#${h}`)),
        },
      };
    } catch (e) {
      const err = e instanceof AiError ? e : new AiError("Something went wrong.", 500);
      return { ok: false, error: err.message, status: err.status };
    }
  });
