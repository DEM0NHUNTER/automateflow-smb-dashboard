// lib/utils/constants.ts
import { TriggerType, ActionType } from "./types";

/**
 * Global Registry of Node Definitions
 * ---------------------------------
 * This constant serves as the "Single Source of Truth" for UI presentation logic.
 * It maps the technical enum keys (used in the DB/Backend) to user-facing assets.
 * * * TYPE SAFETY STRATEGY:
 * By using `Record<TriggerType | ActionType, ...>`, TypeScript enforces exhaustiveness.
 * If a developer adds a new type to the `TriggerType` union in `types.ts` but
 * forgets to add its metadata here, the build will fail. This prevents runtime
 * UI crashes where a node appears with missing labels or icons.
 */
export const NODE_METADATA: Record<TriggerType | ActionType, {
  label: string;
  provider: "google" | "slack" | "system"; // Useful for grouping/filtering in the sidebar
  description: string;
  icon: string; // Currently local static assets; consider CDN URLs for production scaling
}> = {
  // --- TRIGGERS ---

  "gmail-new-email": {
    label: "New Email",
    provider: "google",
    description: "Triggers when a new email matches criteria",
    icon: "/icons/gmail.svg"
  },
  "schedule-cron": {
    label: "Scheduled Time",
    provider: "system",
    description: "Triggers at a specific time or interval",
    icon: "/icons/clock.svg"
  },
  "sheets-new-row": {
    label: "New Row",
    provider: "google",
    description: "Triggers when a new row is added",
    icon: "/icons/sheets.svg"
  },

  // --- ACTIONS ---

  "slack-send-message": {
    label: "Send Slack Message",
    provider: "slack",
    description: "Sends a message to a channel or user",
    icon: "/icons/slack.svg"
  },
  "gmail-send-email": {
    label: "Send Email",
    provider: "google",
    description: "Sends an email via Gmail",
    icon: "/icons/gmail.svg"
  },
  "sheets-update-row": {
    label: "Update Row",
    provider: "google",
    description: "Updates a specific row in Sheets",
    icon: "/icons/sheets.svg"
  }
};