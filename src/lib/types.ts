export type Stage =
  | "New Lead"
  | "Contacted"
  | "Showing"
  | "Under Contract"
  | "Closed"
  | "Past Client";

export const STAGES: Stage[] = [
  "New Lead",
  "Contacted",
  "Showing",
  "Under Contract",
  "Closed",
  "Past Client",
];

export type ActivityType = "call" | "text" | "email" | "note" | "showing";

export type Activity = {
  id: string;
  type: ActivityType;
  summary: string;
  date: string;
};

export type TaskPriority = "urgent" | "high" | "normal";

export type Task = {
  id: string;
  contactId: string;
  title: string;
  dueDate: string;
  createdAt: string;
  priority: TaskPriority;
  done: boolean;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  stage: Stage;
  source: string;
  interest: string;
  lastContact: string;
  activity: Activity[];
};

export type MessageChannel = "email" | "text";

export type Message = {
  id: string;
  contactId: string;
  channel: MessageChannel;
  direction: "inbound" | "outbound";
  subject?: string;
  body: string;
  date: string;
  time: string;
};

export type EventType = "showing" | "closing" | "listing-appointment" | "open-house" | "call";

export type CalendarEvent = {
  id: string;
  contactId?: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
};

export type DealType = "buyer" | "seller" | "lease";

export type DealStage = "Submitting Offers" | "Active Option Contract" | "Pending" | "Closed";

export const DEAL_STAGES: DealStage[] = [
  "Submitting Offers",
  "Active Option Contract",
  "Pending",
  "Closed",
];

export type Deal = {
  id: string;
  contactId: string;
  type: DealType;
  stage: DealStage;
  title: string;
  value: number;
  closeDate: string;
  closeDateLabel: "Close Date" | "Projected Close Date";
};
