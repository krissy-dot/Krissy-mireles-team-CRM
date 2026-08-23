import { EventType } from "@/lib/types";

export const EVENT_ICON: Record<EventType, string> = {
  showing: "\u{1F3E0}",
  closing: "\u{1F3C6}",
  "listing-appointment": "\u{1F4CB}",
  "open-house": "\u{1F6AA}",
  call: "☎",
};

export const EVENT_LABEL: Record<EventType, string> = {
  showing: "Showing",
  closing: "Closing",
  "listing-appointment": "Listing Appt",
  "open-house": "Open House",
  call: "Call",
};

const EVENT_STYLE: Record<EventType, string> = {
  showing: "bg-accent-soft text-accent",
  closing: "bg-green-50 text-green-700",
  "listing-appointment": "bg-purple-50 text-purple-700",
  "open-house": "bg-blue-50 text-blue-700",
  call: "bg-gray-100 text-gray-600",
};

export default function EventTypeBadge({ type }: { type: EventType }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${EVENT_STYLE[type]}`}>
      {EVENT_ICON[type]} {EVENT_LABEL[type]}
    </span>
  );
}
