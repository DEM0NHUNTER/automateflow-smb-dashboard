import { db } from "@/lib/db";
import { AppNode, WorkflowContext } from "@/lib/utils/types";

export class WorkflowEngine {
  /**
   * Main entry point.
   * 1. Creates an Execution Log (PENDING)
   * 2. Loads the workflow from DB
   * 3. Validates the trigger
   * 4. Starts the execution loop
   * 5. Updates Log (SUCCESS/FAILED)
   */
  async runWorkflow(workflowId: string, triggerData: any = {}) {
    // 1. Create an Execution Log entry immediately
    const execution = await db.executionLog.create({
      data: {
        workflowId,
        status: "PENDING",
        triggerData,
      },
    });

    try {
      // 2. Fetch the workflow and all its nodes
      const workflow = await db.workflow.findUnique({
        where: { id: workflowId },
        include: { nodes: true },
      });

      if (!workflow || workflow.status !== "ACTIVE" && workflow.status !== "DRAFT") {
        // Note: We allow DRAFT for testing purposes right now
        throw new Error("Workflow not found");
      }

      // 3. Find the Root Trigger Node (the one with no parent)
      // In our linear linked list, the start node has no parentId.
      const startNode = workflow.nodes.find(
        (n) => n.type === "TRIGGER" && !n.parentId
      );

      if (!startNode) {
        throw new Error("No valid trigger node found. Workflow must start with a Trigger.");
      }

      // 4. Initialize Context
      // This object passes data between steps (e.g., Step 1 output -> Step 2 input)
      const context: WorkflowContext = {
        workflowId,
        executionId: execution.id,
        triggerData,
        stepResults: {},
      };

      // 5. Start Execution Loop
      // We cast to 'AppNode' because Prisma types are slightly different from our app types
      await this.executeNode(startNode as unknown as AppNode, context, workflow.nodes as unknown as AppNode[]);

      // 6. Mark Success
      await db.executionLog.update({
        where: { id: execution.id },
        data: {
          status: "SUCCESS",
          completedAt: new Date(),
          resultData: context.stepResults,
        },
      });

      return { success: true, executionId: execution.id };

    } catch (error: any) {
      console.error("Workflow Execution Failed:", error);

      // 7. Log Failure
      await db.executionLog.update({
        where: { id: execution.id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          error: error.message,
        },
      });

      return { success: false, error: error.message };
    }
  }

  /**
   * Recursive function to run a single node and then find its child.
   */
  private async executeNode(
    node: AppNode,
    context: WorkflowContext,
    allNodes: AppNode[]
  ) {
    console.log(`[Executing Node] ${node.connectorType} (${node.id})`);

    // A. EXECUTE LOGIC based on connector type
    const result = await this.runServiceLogic(node, context);

    // B. Store result in context for future nodes to use
    context.stepResults[node.id] = result;

    // C. Find next node
    if (node.childId) {
      const nextNode = allNodes.find((n) => n.id === node.childId);
      if (nextNode) {
        await this.executeNode(nextNode, context, allNodes);
      }
    }
  }

  /**
   * The Switch Statement that routes to specific service logic.
   * This is where the actual API calls (Gmail, Slack, etc.) happen.
   */
  private async runServiceLogic(node: AppNode, context: WorkflowContext) {
    switch (node.connectorType) {
      // --- ACTIONS ---
      case "slack-send-message":
        // Mocking the Slack API call for now
        console.log(`> 🟢 Sending Slack Message to ${(node.config as any).channelId || 'general'}`);
        return { sent: true, ts: Date.now() };

      case "gmail-send-email":
        console.log(`> 🟢 Sending Email to ${(node.config as any).to || 'unknown'}`);
        return { sent: true, messageId: "mock-id-123" };

      // --- TRIGGERS (Pass-through) ---
      // Triggers usually just pass their initial data forward
      case "gmail-new-email":
        console.log(`> ⚡ Trigger: New Email Detected`);
        return context.triggerData;

      case "schedule-cron":
        console.log(`> ⚡ Trigger: Cron Schedule Fired`);
        return { time: new Date() };

      default:
        console.warn(`> ⚠️ Unknown connector type: ${node.connectorType}`);
        return { skipped: true };
    }
  }
}