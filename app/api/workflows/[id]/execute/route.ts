import { NextRequest, NextResponse } from "next/server";
import { WorkflowEngine } from "@/lib/workflows/engine";

/**
 * Workflow Execution Endpoint
 * * Trigger a specific workflow manually via API.
 * * @route POST /api/workflows/[id]/execute
 */
export const dynamic = 'force-dynamic';
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Note: If upgrading to Next.js 15, `params` becomes a Promise and must be awaited.
    const { id } = params;

    /*
     * ARCHITECTURE NOTE
     * -----------------
     * Instantiating the engine per-request is acceptable for low-throughput,
     * but if initialization involves heavy DB connection pooling, consider
     * refactoring to a Singleton pattern or DI container to prevent
     * connection exhaustion in serverless/lambda environments.
     */
    const engine = new WorkflowEngine();

    /*
     * TODO: DYNAMIC PAYLOAD INJECTION
     * -------------------------------
     * Currently hardcoded for manual testing.
     * Refactor: Parse `await req.json()` here to allow external webhooks
     * or UI inputs to pass dynamic payload data rather than this static mock.
     */
    const triggerData = {
      source: "manual-test",
      timestamp: new Date().toISOString()
    };

    // Execute core logic
    const result = await engine.runWorkflow(id, triggerData);

    // Handle "Expected" Failures (Logic errors, validation issues)
    if (!result.success) {
      // Logging specific failure reasons is critical for debugging async workflows
      console.warn(`[Workflow Failure] ID: ${id}`, result.error);

      return NextResponse.json(
        { success: false, error: result.error },
        // 422 (Unprocessable Entity) is semantically better than 500
        // when the server works but the workflow logic rejected the run.
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      executionId: result.executionId
    });

  } catch (error: any) {
    // Handle "Unexpected" Failures (Crashes, DB timeouts)
    console.error("[System Error] Workflow Execution:", error);

    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
