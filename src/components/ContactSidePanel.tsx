import Link from "next/link";
import EventTypeBadge from "@/components/EventTypeBadge";
import { CalendarEvent, Task } from "@/lib/types";
import { relativeDay } from "@/lib/format";

export default function ContactSidePanel({
  tasks,
  events,
}: {
  tasks: Task[];
  events: CalendarEvent[];
}) {
  return (
    <div className="space-y-6">
      <div className="bg-panel border border-border rounded-xl p-5">
        <h2 className="font-semibold text-navy mb-3">Tasks</h2>
        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center justify-between text-sm">
              <span className="text-navy">{t.title}</span>
              <span className="text-xs text-muted">{relativeDay(t.dueDate)}</span>
            </div>
          ))}
          {tasks.length === 0 && <div className="text-sm text-muted">No open tasks.</div>}
        </div>
      </div>

      <div className="bg-panel border border-border rounded-xl p-5">
        <h2 className="font-semibold text-navy mb-3">Appointments</h2>
        <div className="space-y-3">
          {events.map((e) => (
            <Link
              key={e.id}
              href="/calendar"
              className="block border border-border rounded-lg p-3 hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-navy">
                  {relativeDay(e.date)} · {e.time}
                </span>
                <EventTypeBadge type={e.type} />
              </div>
              <div className="text-sm text-navy">{e.title}</div>
            </Link>
          ))}
          {events.length === 0 && <div className="text-sm text-muted">Nothing scheduled.</div>}
        </div>
      </div>
    </div>
  );
}
