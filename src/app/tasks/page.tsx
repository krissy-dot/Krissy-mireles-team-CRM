import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { contacts, tasks } from "@/lib/mock-data";
import { relativeDay, isOverdue } from "@/lib/format";

export default function TasksPage() {
  const sorted = [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return (
    <div>
      <PageHeader title="Follow-Ups" subtitle="Everything on your plate, in order" />
      <div className="px-8 pb-8">
        <div className="bg-panel border border-border rounded-xl overflow-hidden">
          {sorted.map((task) => {
            const contact = contacts.find((c) => c.id === task.contactId);
            const overdue = isOverdue(task.dueDate);
            return (
              <Link
                key={task.id}
                href={`/contacts/${task.contactId}`}
                className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-b-0 hover:bg-background transition-colors"
              >
                <input
                  type="checkbox"
                  defaultChecked={task.done}
                  disabled
                  className="w-4 h-4 rounded border-border accent-accent shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-navy">{task.title}</div>
                  <div className="text-xs text-muted mt-0.5">{contact?.name}</div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                    overdue ? "bg-red-50 text-red-600" : "bg-accent-soft text-accent"
                  }`}
                >
                  {relativeDay(task.dueDate)}
                </span>
              </Link>
            );
          })}
          {sorted.length === 0 && (
            <div className="p-8 text-center text-sm text-muted">Nothing on your plate. 🎉</div>
          )}
        </div>
      </div>
    </div>
  );
}
