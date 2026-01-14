// lib/utils/constants.ts
import { TriggerType, ActionType } from "./types";

export const NODE_METADATA: Record<TriggerType | ActionType, {
  label: string;
  provider: "google" | "slack" | "system";
  description: string;
  icon: string; // Path to icon or component name
}> = {
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
  "slack-send-message": {
    label: "Send Slack Message",
    provider: "slack",
    description: "Sends a message to a channel or user",
    icon: "/icons/slack.svg"
  },
  // Add more as we build
  "sheets-new-row": {
    label: "New Row",
    provider: "google",
    description: "Triggers when a new row is added",
    icon: "/icons/sheets.svg"
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