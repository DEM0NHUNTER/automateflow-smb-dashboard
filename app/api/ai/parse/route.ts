import { NextRequest, NextResponse } from "next/server";
import { parseWorkflowFromAI } from "@/lib/ai/client";

/**
 * AI Workflow Generation Endpoint
 * * Receives a natural language prompt and orchestrates the AI service
 * to generate a structured node-based workflow.
 * * @route POST /api/workflows/generate
 * @param req - Expects JSON body: { prompt: string }
 * @returns JSON containing an array of workflow nodes or an error object.
 */
export async function POST(req: NextRequest) {
  try {
    // TODO: Implement Zod/Yup validation here to ensure 'prompt' exists and meets length requirements.
    const { prompt } = await req.json();

    // Logging for observability (Consider moving to a structured logger like Pino in production)
    console.log("📝 Received Prompt:", prompt);

    /* * DEV/PREVIEW MODE SAFEGUARD
     * --------------------------
     * Fallback to static mock data if the OpenAI provider is not configured.
     * This prevents the application from crashing in CI/CD pipelines or
     * local environments where API keys are restricted.
     */
    if (!process.env.OPENAI_API_KEY) {
      console.log("⚠️ No Key - Returning Mock Data");
      return NextResponse.json({
        nodes: [
          {
            id: "mock-1",
            type: "TRIGGER",
            connectorType: "gmail-new-email",
            config: {},
            positionX: 100, positionY: 100
          },
          {
            id: "mock-2",
            type: "ACTION",
            connectorType: "slack-send-message",
            config: { channelId: "#mock" },
            positionX: 350, positionY: 100
          }
        ]
      });
    }

    /*
     * REAL EXECUTION FLOW
     * -------------------
     * Offloads the heavy lifting to the AI client service.
     * This abstraction keeps the route handler clean and testable.
     */
    const nodes = await parseWorkflowFromAI(prompt);
    console.log("✅ AI Parsed Nodes:", nodes.length);

    return NextResponse.json({ nodes });

  } catch (error: any) {
    // Ensure we capture the specific error message from the AI service wrapper
    console.error("❌ API Error:", error.message);

    // Return a 500 to signal to the frontend that the generation failed specifically
    // (vs. a 400 for bad input), allowing the UI to show a "Retry" state.
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}