import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StageBadge from "@/components/StageBadge";
import { contacts, tasks } from "@/lib/mock-data";
import { relativeDay, initials } from "@/lib/format";

const ACTIVITY_ICON: Record<string, string> = {
  call: "☎",
  text: "\u{1F4AC}",
  email: "✉",
  note: "\u{1F4CC}",
  showing: "\u{1F3E0}",
};

export default async function ContactDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact = contacts.find((c) => c.id === id);
  if (!contact) notFound();

  const contactTasks = tasks.filter((t) => t.contactId === contact.id);
  const sortedActivity = [...contact.activity].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <div className="px-8 pt-8 pb-6">
        <Link href="/contacts" className="text-sm text-muted hover:text-navy">
          ← Back to Contacts
        </Link>
      </div>

      <div className="px-8 flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-navy text-white flex items-center justify-center text-lg font-semibold shrink-0">
            {initials(contact.name)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-navy">{contact.name}</h1>
              <StageBadge stage={contact.stage} />
            </div>
            <div className="text-sm text-muted mt-1">
              {contact.phone} · {contact.email}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors">
            ☎ Call
          </button>
          <button className="px-4 py-2 rounded-lg border border-border text-navy text-sm font-medium hover:border-navy transition-colors">
            💬 Text
          </button>
          <button className="px-4 py-2 rounded-lg border border-border text-navy text-sm font-medium hover:border-navy transition-colors">
            ✉ Email
          </button>
        </div>
      </div>

      <div className="px-8 grid grid-cols-3 gap-6 pb-8">
        <div className="col-span-2 bg-panel border border-border rounded-xl p-5">
          <h2 className="font-semibold text-navy mb-4">Activity</h2>
          <div className="space-y-4">
            {sortedActivity.map((a) => (
              <div key={a.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-accent-soft text-accent flex items-center justify-center text-xs shrink-0">
                  {ACTIVITY_ICON[a.type]}
                </div>
                <div>
                  <div className="text-sm text-navy">{a.summary}</div>
                  <div className="text-xs text-muted mt-0.5">{relativeDay(a.date)}</div>
                </div>
              </div>
            ))}
            {sortedActivity.length === 0 && (
              <div className="text-sm text-muted">No activity yet.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-panel border border-border rounded-xl p-5">
            <h2 className="font-semibold text-navy mb-3">Details</h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted text-xs">Interest</dt>
                <dd className="text-navy mt-0.5">{contact.interest}</dd>
              </div>
              <div>
                <dt className="text-muted text-xs">Source</dt>
                <dd className="text-navy mt-0.5">{contact.source}</dd>
              </div>
              <div>
                <dt className="text-muted text-xs">Last Contact</dt>
                <dd className="text-navy mt-0.5">{relativeDay(contact.lastContact)}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-panel border border-border rounded-xl p-5">
            <h2 className="font-semibold text-navy mb-3">Tasks</h2>
            <div className="space-y-2">
              {contactTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm">
                  <span className="text-navy">{t.title}</span>
                  <span className="text-xs text-muted">{relativeDay(t.dueDate)}</span>
                </div>
              ))}
              {contactTasks.length === 0 && (
                <div className="text-sm text-muted">No open tasks.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
