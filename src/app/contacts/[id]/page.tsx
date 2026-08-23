import { notFound } from "next/navigation";
import Link from "next/link";
import StageBadge from "@/components/StageBadge";
import ContactWorkspace from "@/components/ContactWorkspace";
import ContactSidePanel from "@/components/ContactSidePanel";
import { contacts, tasks, messages, events } from "@/lib/mock-data";
import { relativeDay, initials } from "@/lib/format";

export default async function ContactDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact = contacts.find((c) => c.id === id);
  if (!contact) notFound();

  const contactTasks = tasks.filter((t) => t.contactId === contact.id && !t.done);
  const contactMessages = messages.filter((m) => m.contactId === contact.id);
  const contactEvents = events.filter((e) => e.contactId === contact.id);

  return (
    <div>
      <div className="px-8 pt-8 pb-6">
        <Link href="/contacts" className="text-sm text-muted hover:text-navy">
          ← Back to Contacts
        </Link>
      </div>

      <div className="px-8 pb-8 grid grid-cols-4 gap-6">
        <div className="bg-panel border border-border rounded-xl p-5 h-fit">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center text-base font-semibold shrink-0">
              {initials(contact.name)}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-navy truncate">{contact.name}</h1>
              <StageBadge stage={contact.stage} />
            </div>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted text-xs">Phone</dt>
              <dd className="text-navy mt-0.5">{contact.phone}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Email</dt>
              <dd className="text-navy mt-0.5">{contact.email}</dd>
            </div>
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

        <div className="col-span-2">
          <ContactWorkspace messages={contactMessages} activity={contact.activity} />
        </div>

        <ContactSidePanel tasks={contactTasks} events={contactEvents} />
      </div>
    </div>
  );
}
