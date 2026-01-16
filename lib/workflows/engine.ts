import { db } from "@/lib/db";
import { AppNode, WorkflowContext } from "@/lib/utils/types";

/**
 * Core Workflow Orchestration Engine
 * ----------------------------------
 * Responsible for the lifecycle of a single workflow execution.
 * * ARCHITECTURAL DECISIONS:
 * 1. Execution Model: Currently uses a recursive Depth-First Traversal (DFT).
 * - Pro: Simple to implement for linear chains.
 * - Con: Risk of stack overflow on extremely long chains (1000+ nodes).
 * - Future: Refactor to an iterative loop with a queue for better stack safety.
 * * 2. State Management: Uses a `context` object passed by reference to accumulate
 * results, allowing downstream nodes to access data from upstream nodes (e.g. Step 1 -> Step 5).
 */
export class WorkflowEngine {
  /**
   * Main Entry Point
   * ----------------
   * Orchestrates the setup, execution, and teardown of a workflow run.
   * * @param workflowId - The ID of the definition to run.
   * @param triggerData - The initial payload (webhook body, email content, etc.)
   */
  async runWorkflow(workflowId: string, triggerData: any = {}) {
    /*
     * AUDIT-FIRST PATTERN
     * -------------------
     * We create the log entry *before* doing any work.
     * This ensures that even if the server crashes immediately after this line,
     * we have a record that an execution was ATTEMPTED (stuck in PENDING).
     * This is critical for debugging "silent failures" in production.
     */
    const execution = await db.executionLog.create({
      data: {
        workflowId,
        status: "PENDING",
        triggerData,
      },
    });

    try {
      /*
       * PERFORMANCE NOTE: "Load All" Strategy
       * -------------------------------------
       * We fetch the workflow and ALL nodes in a single query.
       * For typical user workflows (5-50 nodes), this minimizes DB round-trips.
       * For massive enterprise workflows, we might need to paginate or lazy-load nodes.
       */
      const workflow = await db.workflow.findUnique({
        where: { id: workflowId },
        include: { nodes: true },
      });

      if (!workflow || (workflow.status !== "ACTIVE" && workflow.status !== "DRAFT")) {
        // Allowing DRAFT status enables the "Test Run" feature in the editor
        throw new Error("Workflow not found or inactive");
      }

      /*
       * TRIGGER VALIDATION
       * ------------------
       * We identify the root by finding the node with no parent.
       * Assumption: The graph is a strict Linked List or Tree.
       * If we support detached sub-graphs in the future, this logic needs validaton.
       */
      const startNode = workflow.nodes.find(
        (n) => n.type === "TRIGGER" && !n.parentId
      );

      if (!startNode) {
        throw new Error("No valid trigger node found. Workflow must start with a Trigger.");
      }

      // Initialize the "Bus" that carries state through the execution
      const context: WorkflowContext = {
        workflowId,
        executionId: execution.id,
        triggerData,
        stepResults: {},
      };

      /*
       * TECHNICAL DEBT: Type Casting
       * ----------------------------
       * Prisma types (Json objects) are looser than our strict `AppNode` interfaces.
       * We cast here to satisfy TS, but a runtime Zod validation step would be safer
       * to ensure the DB content matches our expected schema.
       */
      await this.executeNode(startNode as unknown as AppNode, context, workflow.nodes as unknown as AppNode[]);

      // Mark Complete
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

      // FAILURE RECOVERY
      // We explicitly capture the error message to display in the user's history dashboard.
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
   * Recursive Execution Handler
   * ---------------------------
   * Executes the current node and recursively calls the next one.
   * NOTE: This is strictly serial (Node A -> Node B).
   * Parallel execution (Promise.all) would be needed for branching paths.
   */
  private async executeNode(
    node: AppNode,
    context: WorkflowContext,
    allNodes: AppNode[]
  ) {
    console.log(`[Executing Node] ${node.connectorType} (${node.id})`);

    // A. EXECUTE LOGIC
    // Delegate the actual business logic to the service layer
    const result = await this.runServiceLogic(node, context);

    // B. STATE PERSISTENCE
    // Save the output so downstream nodes can reference it (e.g. `{{step_1.email_id}}`)
    context.stepResults[node.id] = result;

    // C. TRAVERSAL
    // Simple Linked-List pointer logic.
    if (node.childId) {
      const nextNode = allNodes.find((n) => n.id === node.childId);
      if (nextNode) {
        await this.executeNode(nextNode, context, allNodes);
      }
    }
  }

  /**
   * Service Dispatcher
   * ------------------
   * Routes the node type to the specific API handler.
   * * ! ARCHITECTURE CRITIQUE: Open/Closed Principle Violation
   * --------------------------------------------------------
   * Currently, adding a new integration (e.g., Notion) requires modifying this core class.
   * REFACTOR GOAL: Move to the Strategy Pattern or a Registry Map.
   * Example: `serviceRegistry.get(node.connectorType).execute(node, context)`
   * This would allow us to add new plugins without touching the engine core.
   */
  private async runServiceLogic(node: AppNode, context: WorkflowContext) {
    switch (node.connectorType) {
      // --- ACTIONS ---
      case "slack-send-message":
        // TODO: Extract to `services/slack.ts`
        console.log(`> 🟢 Sending Slack Message to ${(node.config as any).channelId || 'general'}`);
        return { sent: true, ts: Date.now() };

      case "gmail-send-email":
        // TODO: Extract to `services/gmail.ts`
        console.log(`> 🟢 Sending Email to ${(node.config as any).to || 'unknown'}`);
        return { sent: true, messageId: "mock-id-123" };

      // --- TRIGGERS (Pass-through) ---
      // In a polling architecture, these would contain logic.
      // In this webhook/event-driven architecture, they largely act as data pass-throughs.
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