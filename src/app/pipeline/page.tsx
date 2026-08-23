import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { contacts } from "@/lib/mock-data";
import { STAGES } from "@/lib/types";
import { initials, relativeDay } from "@/lib/format";

export default function PipelinePage() {
  return (
    <div>
      <PageHeader title="Pipeline" subtitle="Every contact, by stage" />
      <div className="px-8 pb-8 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {STAGES.map((stage) => {
            const stageContacts = contacts.filter((c) => c.stage === stage);
            return (
              <div key={stage} className="w-64 shrink-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-sm font-semibold text-navy">{stage}</h3>
                  <span className="text-xs text-muted bg-panel border border-border rounded-full px-2 py-0.5">
                    {stageContacts.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {stageContacts.map((c) => (
                    <Link
                      key={c.id}
                      href={`/contacts/${c.id}`}
                      className="block bg-panel border border-border rounded-xl p-4 hover:border-accent transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center text-xs font-semibold shrink-0">
                          {initials(c.name)}
                        </div>
                        <div className="text-sm font-medium text-navy truncate">{c.name}</div>
                      </div>
                      <div className="text-xs text-muted truncate">{c.interest}</div>
                      <div className="text-xs text-muted mt-2">
                        Last: {relativeDay(c.lastContact)}
                      </div>
                    </Link>
                  ))}
                  {stageContacts.length === 0 && (
                    <div className="text-xs text-muted border border-dashed border-border rounded-xl p-4 text-center">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
