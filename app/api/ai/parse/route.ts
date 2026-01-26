// Description: API route to parse user prompts into workflow nodes using AI (Mock Mode Enabled)
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt || "";
    console.log("📝 Received Prompt:", body.prompt);

    // --- 🟢 MOCK MODE ENGAGED ---
    // We strictly return this hardcoded data for testing purposes.
    const isDemo = process.env.NEXT_PUBLIC_IS_DEMO === 'true';
    if (isDemo) {
      console.log("🟢 DEMO MODE: Returning Mock Data");
    const mockNodes = [
      {
        id: uuidv4(),
        type: "TRIGGER",
        connectorType: "gmail-new-email",
        config: {
          subjectFilter: "Urgent",
          senderFilter: "boss@company.com"
        },
        positionX: 100,
        positionY: 100
      },
      {
        id: uuidv4(),
        type: "ACTION",
        connectorType: "slack-send-message",
        config: {
          channelId: "#alerts",
          messageTemplate: "🚨 Urgent email received from {{sender}}"
        },
        positionX: 400, // Shifted right to look nice on canvas
        positionY: 100
      },
      {
        id: uuidv4(),
        type: "ACTION",
        connectorType: "gmail-send-email",
        config: {
          to: "me@personal.com",
          subject: "Work Alert: Check Slack"
        },
        positionX: 700, // Shifted further right
        positionY: 100
      }
    ];

    console.log("⚠️ RETURNING MOCK AI RESPONSE (3 Nodes)");

    // Simulate a slight network delay (0.5s) to make the "Generating..." UI feel real
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
        nodes: mockNodes,
        isDemo: true
    });
    // 2. REAL AI LOGIC (Disabled in Demo Mode)
    // When they buy the code, they won't have NEXT_PUBLIC_IS_DEMO set,
    // so this code will run.
    /*
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI Key Missing");
    }
    // const nodes = await parseWorkflowFromAI(prompt);
    // return NextResponse.json({ nodes, isDemo: false });
    */
    return NextResponse.json({ error: "Real AI Not Configured" }, { status: 500 });
  } catch (error: any) {
    console.error("❌ API Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
