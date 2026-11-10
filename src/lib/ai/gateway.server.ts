import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, NoObjectGeneratedError, Output, streamText } from "ai";
import type { z } from "zod/v4";

import { createLovableAiGatewayRunIdFetch } from "./run-id";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

export class AiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/** Streams a structured-output call through Lovable AI Gateway and returns the parsed object. */
export async function generateStructured<T>(opts: {
  schema: z.ZodType<T>;
  instructions: string;
  prompt: string;
  runId?: string;
}): Promise<{ data: T; runId?: string | undefined }> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AiError("AI is not configured for this app yet.", 401);

  const runIdFetch = createLovableAiGatewayRunIdFetch(opts.runId);
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  let streamError: unknown;
  const result = streamText({
    model: provider.responses(MODEL),
    instructions: opts.instructions,
    prompt: opts.prompt,
    output: Output.object({ schema: opts.schema }),
    onError: ({ error }) => {
      streamError = error;
    },
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  try {
    const data = (await result.output) as T;
    return { data, runId: runIdFetch.getRunId() };
  } catch (error) {
    throw toAiError(streamError ?? error);
  }
}

function toAiError(error: unknown): AiError {
  if (APICallError.isInstance(error)) {
    const status = error.statusCode ?? 500;
    if (status === 429) return new AiError("Too many requests right now — please wait a moment and try again.", 429);
    if (status === 402) return new AiError("AI credits have run out for this workspace. Add credits to keep generating.", 402);
    if (status === 403) return new AiError("AI access is blocked for this workspace right now.", 403);
    return new AiError("The AI service had a problem. Please try again shortly.", status);
  }
  if (NoObjectGeneratedError.isInstance(error)) {
    return new AiError("The AI response didn't come back in the right shape. Try again or rephrase the topic.", 422);
  }
  console.error("AI call failed", error);
  return new AiError("Something went wrong generating content. Please try again.", 500);
}
