import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { contacts, tasks } from "@/lib/mock-data";
import { relativeDay, isOverdue, initials } from "@/lib/format";

const ACTIVITY_ICON: Record<string, string> = {
  call: "☎",
  text: "\u{1F4AC}",
  email: "✉",
  note: "\u{1F4CC}",
  showing: "\u{1F3E0}",
};

export default function Dashboard() {
  const activeLeads = contacts.filter(
    (c) => c.stage !== "Closed" && c.stage !== "Past Client"
  ).length;

  const closedThisMonth = contacts.filter((c) => c.stage === "Closed").length;

  const openTasks = tasks
    .filter((t) => !t.done)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const dueToday = openTasks.filter((t) => !isOverdue(t.dueDate) && relativeDay(t.dueDate) === "Today");

  const recentActivity = contacts
    .flatMap((c) => c.activity.map((a) => ({ ...a, contact: c })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  const stats = [
    { label: "Active Leads", value: activeLeads },
    { label: "Follow-Ups Due Today", value: dueToday.length },
    { label: "Closed", value: closedThisMonth },
    { label: "Total Contacts", value: contacts.length },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Here's what's happening today" />

      <div className="px-8 grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-panel border border-border rounded-xl p-5">
            <div className="text-3xl font-semibold text-navy">{s.value}</div>
            <div className="text-sm text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="px-8 grid grid-cols-2 gap-6 pb-8">
        <div className="bg-panel border border-border rounded-xl p-5">
          <h2 className="font-semibold text-navy mb-4">Follow-Ups</h2>
          <div className="space-y-3">
            {openTasks.map((task) => {
              const contact = contacts.find((c) => c.id === task.contactId);
              const overdue = isOverdue(task.dueDate);
              return (
                <Link
                  key={task.id}
                  href={`/contacts/${task.contactId}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-accent transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-navy">{task.title}</div>
                    <div className="text-xs text-muted mt-0.5">{contact?.name}</div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      overdue ? "bg-red-50 text-red-600" : "bg-accent-soft text-accent"
                    }`}
                  >
                    {relativeDay(task.dueDate)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-panel border border-border rounded-xl p-5">
          <h2 className="font-semibold text-navy mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((a) => (
              <Link
                key={a.id}
                href={`/contacts/${a.contact.id}`}
                className="flex gap-3 items-start hover:opacity-70 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {initials(a.contact.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-navy">
                    <span className="font-medium">{a.contact.name}</span>{" "}
                    <span className="text-muted">
                      {ACTIVITY_ICON[a.type]} {a.summary}
                    </span>
                  </div>
                  <div className="text-xs text-muted mt-0.5">{relativeDay(a.date)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
