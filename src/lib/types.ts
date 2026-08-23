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

export type Task = {
  id: string;
  contactId: string;
  title: string;
  dueDate: string;
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
