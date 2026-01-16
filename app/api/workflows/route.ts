import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AppNode } from "@/lib/utils/types";

/**
 * Workflow Management API
 * * Handles creation and retrieval of workflow definitions.
 * * @route POST /api/workflows
 * * @route GET /api/workflows
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, nodes, userId } = body;

    // Fallback ID is acceptable for MVP/Demo but should be replaced
    // by session-based authentication (e.g., NextAuth) in production.
    const targetUserId = userId || "demo-user-123";

    /*
     * DATABASE TRANSACTION
     * --------------------
     * We wrap these operations in a transaction to ensure atomicity.
     * If node creation fails, we do not want an orphaned "empty" workflow record
     * cluttering the database. It's all or nothing.
     */
    const workflow = await db.$transaction(async (tx) => {
      /*
       * 1. SELF-HEALING / UPSERT PATTERN
       * --------------------------------
       * This block prevents "Foreign Key Constraint" violations during development
       * or when running against a fresh DB that hasn't been seeded.
       * Ideally, user existence is guaranteed by auth middleware upstream,
       * but this acts as a final safety net.
       */
      await tx.user.upsert({
        where: { id: targetUserId },
        update: {}, // No-op if user exists
        create: {
          id: targetUserId,
          email: "demo@example.com",
          name: "Demo User",
        },
      });

      // 2. Create the parent Workflow entity
      const newWorkflow = await tx.workflow.create({
        data: {
          userId: targetUserId,
          name: name || "Untitled Workflow",
          status: "DRAFT",
        },
      });

      // 3. Bulk Insert Nodes
      if (nodes && nodes.length > 0) {
        /*
         * TODO: LINKED LIST LOGIC REVIEW
         * ------------------------------
         * The current implementation assumes a strictly linear array (A -> B -> C).
         * If the frontend supports branching (A -> B & C), relying on array index
         * (index - 1) for parent linkage will break.
         * Future Refactor: Accept an explicit adjacency list or edge array from the UI.
         */
        await tx.workflowNode.createMany({
          data: nodes.map((node: AppNode, index: number) => ({
            workflowId: newWorkflow.id,
            type: node.type,
            connectorType: node.connectorType,
            config: node.config as any, // 'any' cast used here due to loose JSON schema in Prisma
            positionX: node.positionX,
            positionY: node.positionY,
            // Naive linking based on array position
            parentId: index > 0 ? nodes[index - 1].id : null,
            childId: index < nodes.length - 1 ? nodes[index + 1].id : null,
          })),
        });
      }

      return newWorkflow;
    });

    return NextResponse.json({ success: true, workflowId: workflow.id });

  } catch (error: any) {
    // Critical: Log the error stack to capture DB-specific validation messages
    console.error("❌ Error creating workflow:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Fetch all workflows for the dashboard list.
 * Includes a count of executions to display usage metrics efficiently.
 */
export async function GET(req: NextRequest) {
  // Performance Note: 'include' can be expensive on large tables.
  // If execution history grows large, switch to a separate aggregation query.
  const workflows = await db.workflow.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { executions: true } } }
  });

  return NextResponse.json(workflows);
}