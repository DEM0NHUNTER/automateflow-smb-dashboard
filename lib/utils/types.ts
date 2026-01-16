// lib/utils/types.ts

import { WorkflowNode } from "@prisma/client";

/**
 * CORE DOMAIN DEFINITIONS
 * -----------------------
 * This file serves as the "Rosetta Stone" between the Database (Prisma),
 * the Runtime Engine (Node execution), and the Frontend (UI Config).
 */

// 1. Registry of supported services
// Used for grouping in the UI sidebar and filtering integrations.
export type ServiceProvider = "google" | "slack" | "notion";

/*
 * 2. CONNECTOR CAPABILITIES (The Registry)
 * ----------------------------------------
 * These union types act as the strict registry of what the engine can actually do.
 * ARCHITECTURE NOTE:
 * We use String Literals instead of Enums.
 * Why? They serialize natively to JSON (readable in DB) without the runtime overhead
 * or transpilation complexity of TypeScript Enums.
 */
export type TriggerType =
  | "gmail-new-email"
  | "schedule-cron"
  | "sheets-new-row";

export type ActionType =
  | "slack-send-message"
  | "gmail-send-email"
  | "sheets-update-row";

/*
 * 3. CONFIGURATION SCHEMAS (The Data Shape)
 * -----------------------------------------
 * Since the database stores 'config' as a generic JSON blob, we define
 * these interfaces to enforce structure at the application layer.
 */

// Base type allows for safe property access even on unknown node types
export interface BaseNodeConfig {
  [key: string]: any;
}

export interface GmailTriggerConfig extends BaseNodeConfig {
  subjectFilter?: string; // Optional: Only trigger on specific subjects
  senderFilter?: string;
}

export interface ScheduleTriggerConfig extends BaseNodeConfig {
  cronExpression: string; // Standard Cron: "0 9 * * 1" (Every Monday at 9am)
  timezone: string;       // Critical: Cron without timezone is a common bug source
}

export interface SlackActionConfig extends BaseNodeConfig {
  channelId: string;
  // Supports template variables e.g. "New lead: {{email_subject}}"
  messageTemplate: string;
}

/*
 * 4. THE HYBRID ENTITY (Frontend & Engine Model)
 * ----------------------------------------------
 * This is the most important type in the system.
 * It extends the raw Database Entity (`WorkflowNode` from Prisma) but
 * NARROWS the generic fields into specific, strongly-typed unions.
 *
 * - `type` becomes the specific TriggerType/ActionType unions.
 * - `config` becomes the specific Config interfaces.
 */
export interface AppNode extends WorkflowNode {
  // Overriding Prisma's loose 'string' type with our strict Union
  connectorType: TriggerType | ActionType;

  // Overriding Prisma's loose 'Json' type with our specific Interfaces
  config: GmailTriggerConfig | ScheduleTriggerConfig | SlackActionConfig;
}

/*
 * 5. RUNTIME EXECUTION CONTEXT
 * ----------------------------
 * The "Bus" that carries state as the engine moves from node to node.
 * This object is hydrated at the start of a run and mutated as steps complete.
 */
export interface WorkflowContext {
  workflowId: string;
  executionId: string;

  // The initial payload that started the workflow (e.g., the specific email)
  triggerData: any;

  // The Ledger: A map of all outputs from previous steps.
  // usage: stepResults['node-1'].output
  stepResults: Record<string, any>;
}