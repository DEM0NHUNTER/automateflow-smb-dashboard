import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AppNode } from "@/lib/utils/types";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, nodes, userId } = body;

    // Default to the hardcoded demo ID if none provided
    const targetUserId = userId || "demo-user-123";

    // ▼▼▼ THE FIX IS HERE: Added ': Prisma.TransactionClient' ▼▼▼
    const workflow = await db.$transaction(async (tx: Prisma.TransactionClient) => {

      // 1. SELF-HEALING: Ensure the User exists
      await tx.user.upsert({
        where: { id: targetUserId },
        update: {},
        create: {
          id: targetUserId,
          email: "demo@example.com",
          name: "Demo User",
        },
      });

      // 2. Create Workflow
      const newWorkflow = await tx.workflow.create({
        data: {
          userId: targetUserId,
          name: name || "Untitled Workflow",
          status: "DRAFT",
        },
      });

      // 3. Create Nodes
      if (nodes && nodes.length > 0) {
        await tx.workflowNode.createMany({
          data: nodes.map((node: AppNode, index: number) => ({
            workflowId: newWorkflow.id,
            type: node.type,
            connectorType: node.connectorType,
            config: node.config as any,
            positionX: node.positionX,
            positionY: node.positionY,
            parentId: index > 0 ? nodes[index - 1].id : null,
            childId: index < nodes.length - 1 ? nodes[index + 1].id : null,
          })),
        });
      }

      return newWorkflow;
    });

    return NextResponse.json({ success: true, workflowId: workflow.id });

  } catch (error: any) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const workflows = await db.workflow.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { executions: true } } }
  });

  return NextResponse.json(workflows);
}