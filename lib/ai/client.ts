import OpenAI from "openai";
import { AppNode } from "@/lib/utils/types";
import { v4 as uuidv4 } from "uuid";

/**
 * AI Service Layer - Workflow Parser
 * --------------------------------
 * Acts as the translation adapter between unstructured user intent (Natural Language)
 * and the structured domain model (Nodes/Edges).
 * * @param userInput - The raw string description (e.g., "Email me every Friday")
 * @returns Promise<AppNode[]> - A hydrated array of nodes ready for the canvas.
 */
export async function parseWorkflowFromAI(userInput: string): Promise<AppNode[]> {
  /*
   * CONFIGURATION CHECK
   * -------------------
   * Fail fast if the environment is not set up.
   * In a real production setup, this check should happen at app startup (e.g. in `instrumentation.ts`)
   * rather than per-request to avoid runtime surprises.
   */
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API Key");
  }

  // Stateless client instantiation is fine for serverless (Next.js),
  // but ensure `maxRetries` is configured for production stability.
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  /*
   * PROMPT ENGINEERING / SYSTEM INSTRUCTION
   * ---------------------------------------
   * This defines the "API Contract" with the LLM.
   * ARCHITECTURE NOTE:
   * Hardcoding prompts in TS files is brittle.
   * Recommendation: Move this to a separate `prompts.ts` file or a CMS
   * so non-engineers can iterate on the prompt without redeploying the backend.
   */
  const systemPrompt = `
    You are an automation expert. Convert the user's request into a JSON array of workflow nodes.

    AVAILABLE NODE TYPES:
    - TRIGGER: "gmail-new-email"
    - TRIGGER: "schedule-cron"
    - ACTION: "slack-send-message" (Requires config: { channelId })
    - ACTION: "gmail-send-email" (Requires config: { to })

    RULES:
    1. Response must be a JSON object with a "nodes" key.
    2. Example: { "nodes": [ { "type": "TRIGGER", ... } ] }
  `;

  const completion = await openai.chat.completions.create({
    /*
     * MODEL SELECTION STRATEGY
     * ------------------------
     * Switched to 'gpt-3.5-turbo' (from GPT-4).
     * Rationale: Strict JSON generation based on a fixed schema is a low-reasoning task.
     * GPT-3.5 offers significantly lower latency (~500ms vs ~2s) and 1/10th the cost,
     * which is critical for a "real-time" UI feeling.
     */
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userInput }
    ],
    // Enforcing JSON mode reduces hallucination significantly
    response_format: { type: "json_object" },
  });

  const responseContent = completion.choices[0].message.content;

  // Structured logging helps trace "What did the AI actually say?" during debugging
  console.log("🤖 RAW AI RESPONSE:", responseContent);

  if (!responseContent) throw new Error("No response from AI");

  /*
   * DEFENSIVE PARSING
   * -----------------
   * Even with `response_format: json_object`, models sometimes wrap content
   * in Markdown code blocks (```json ... ```).
   * This regex sanitizer ensures JSON.parse doesn't choke on formatting artifacts.
   */
  const cleanJson = responseContent.replace(/```json/g, "").replace(/```/g, "").trim();

  let data;
  try {
    data = JSON.parse(cleanJson);
  } catch (e) {
    console.error("JSON Parse Error:", e);
    // In production, we should retry the request with a higher temperature
    // or a specific "Fix JSON" prompt.
    throw new Error("AI returned invalid JSON");
  }

  // Validation: Ensure 'nodes' exists before mapping
  const rawNodes = data.nodes || [];

  /*
   * DATA TRANSFORMATION / HYDRATION
   * -------------------------------
   * The AI gives us "Pure Data" (types and config).
   * We must hydrate this with "System Data" (IDs, coordinates, timestamps).
   */
  return rawNodes.map((node: any, index: number) => ({
    id: uuidv4(),
    workflowId: "temp-ai", // Placeholder until saved to DB
    type: node.type.toUpperCase(),
    connectorType: node.connectorType,
    config: node.config || {},

    // Auto-Layout Algorithm:
    // Staggers nodes diagonally (X+250, Y+50) so they don't stack on top of each other.
    // A more advanced version would use a DAGre layout engine.
    positionX: 100 + (index * 250),
    positionY: 100 + (index * 50),

    parentId: null,
    childId: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
}