// app/api/workflows/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db"; // Ensure this path matches your db.ts location

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