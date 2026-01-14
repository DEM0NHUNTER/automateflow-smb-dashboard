// lib/utils/types.ts

import { WorkflowNode } from "@prisma/client";

// 1. Registry of supported services
export type ServiceProvider = "google" | "slack" | "notion";

// 2. Connector Types (The specific capabilities)
export type TriggerType =
  | "gmail-new-email"
  | "schedule-cron"
  | "sheets-new-row";

export type ActionType =
  | "slack-send-message"
  | "gmail-send-email"
  | "sheets-update-row";

// 3. Configuration Interfaces (The shape of the JSON blob)
export interface BaseNodeConfig {
  [key: string]: any;
}

export interface GmailTriggerConfig extends BaseNodeConfig {
  subjectFilter?: string;
  senderFilter?: string;
}

export interface ScheduleTriggerConfig extends BaseNodeConfig {
  cronExpression: string; // "0 9 * * 1" (Every Monday at 9am)
  timezone: string;
}

export interface SlackActionConfig extends BaseNodeConfig {
  channelId: string;
  messageTemplate: string; // "New lead: {{email_subject}}"
}

// 4. The Unified Node Definition for Frontend/Engine
export interface AppNode extends WorkflowNode {
  // We override the loose DB types with specific ones for application logic
  connectorType: TriggerType | ActionType;
  config: GmailTriggerConfig | ScheduleTriggerConfig | SlackActionConfig;
}

// 5. Execution Context (Passed between nodes during runtime)
export interface WorkflowContext {
  workflowId: string;
  executionId: string;
  triggerData: any;      // Data from the first node
  stepResults: Record<string, any>; // Results from previous steps
}