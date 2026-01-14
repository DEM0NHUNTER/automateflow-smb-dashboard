import { NextRequest, NextResponse } from "next/server";
import { WorkflowEngine } from "@/lib/workflows/engine";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Initialize the engine
    const engine = new WorkflowEngine();

    // Run the workflow with some dummy trigger data (for testing)
    const result = await engine.runWorkflow(id, {
      source: "manual-test",
      timestamp: new Date().toISOString()
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      executionId: result.executionId
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}