import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// ⚠️ IMPORTANT: Keep this to prevent Vercel build errors
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📝 Received Prompt:", body.prompt);

    // --- 🟢 MOCK MODE ENGAGED ---
    // We strictly return this hardcoded data for testing purposes.
    
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

    return NextResponse.json({ nodes: mockNodes });
    
    // --- 🔴 REAL AI DISABLED BELOW ---
    /*
    if (!process.env.OPENAI_API_KEY) { ... }
    const nodes = await parseWorkflowFromAI(prompt);
    return NextResponse.json({ nodes });
    */

  } catch (error: any) {
    console.error("❌ API Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
