"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PriorityBadge from "@/components/PriorityBadge";
import { Contact, Task } from "@/lib/types";
import { relativeDay, isOverdue, priorityRank, daysAgo } from "@/lib/format";

type Tab = "today" | "overdue" | "urgent" | "new";

const TABS: { key: Tab; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "overdue", label: "Overdue" },
  { key: "urgent", label: "Urgent" },
  { key: "new", label: "New" },
];

export default function TasksView({
  contacts,
  tasks,
}: {
  contacts: Contact[];
  tasks: Task[];
}) {
  const open = useMemo(() => tasks.filter((t) => !t.done), [tasks]);

  const buckets = useMemo(() => {
    const today = open
      .filter((t) => !isOverdue(t.dueDate) && relativeDay(t.dueDate) === "Today")
      .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));

    const overdue = open
      .filter((t) => isOverdue(t.dueDate))
      .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || daysAgo(b.dueDate) - daysAgo(a.dueDate));

    const urgent = open
      .filter((t) => t.priority === "urgent")
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    const fresh = open
      .filter((t) => daysAgo(t.createdAt) <= 1)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return { today, overdue, urgent, new: fresh };
  }, [open]);

  const [tab, setTab] = useState<Tab>("today");
  const list = buckets[tab];

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              tab === t.key
                ? "bg-navy text-white border-navy"
                : "bg-panel text-muted border-border hover:border-navy"
            }`}
          >
            {t.label} ({buckets[t.key].length})
          </button>
        ))}
      </div>

      <div className="bg-panel border border-border rounded-xl overflow-hidden">
        {list.map((task) => {
          const contact = contacts.find((c) => c.id === task.contactId);
          const overdue = isOverdue(task.dueDate);
          return (
            <Link
              key={task.id}
              href={`/contacts/${task.contactId}`}
              className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-b-0 hover:bg-background transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-navy">{task.title}</span>
                  <PriorityBadge priority={task.priority} />
                </div>
                <div className="text-xs text-muted mt-0.5">{contact?.name}</div>
              </div>
              {tab === "new" ? (
                <span className="text-xs text-muted shrink-0">
                  Created {relativeDay(task.createdAt)}
                </span>
              ) : (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                    overdue ? "bg-red-50 text-red-600" : "bg-accent-soft text-accent"
                  }`}
                >
                  {relativeDay(task.dueDate)}
                </span>
              )}
            </Link>
          );
        })}
        {list.length === 0 && (
          <div className="p-8 text-center text-sm text-muted">Nothing here. 🎉</div>
        )}
      </div>
    </div>
  );
}
