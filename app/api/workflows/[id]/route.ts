// app/api/workflows/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflowId = params.id;

    // 1. Delete from Database
    await db.workflow.delete({
      where: {
        id: workflowId,
        // Outside the demo, also check 'userId' here for security
        // userId: session.user.id
      },
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Delete failed:", error);
    return NextResponse.json(
      { error: "Failed to delete workflow" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workflow = await db.workflow.findUnique({
      where: { id: params.id },
      include: { nodes: true }, // We need the nodes to draw the canvas
    });

    if (!workflow) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(workflow);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}