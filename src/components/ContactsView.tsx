"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StageBadge from "@/components/StageBadge";
import { Contact, STAGES, Stage } from "@/lib/types";
import { relativeDay, initials } from "@/lib/format";

export default function ContactsView({ contacts }: { contacts: Contact[] }) {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchesStage = stageFilter === "All" || c.stage === stageFilter;
      const matchesQuery =
        query.trim() === "" ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.interest.toLowerCase().includes(query.toLowerCase());
      return matchesStage && matchesQuery;
    });
  }, [contacts, query, stageFilter]);

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <input
          type="text"
          placeholder="Search contacts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 max-w-sm px-3 py-2 rounded-lg border border-border bg-panel text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setStageFilter("All")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            stageFilter === "All"
              ? "bg-navy text-white border-navy"
              : "bg-panel text-muted border-border hover:border-navy"
          }`}
        >
          All ({contacts.length})
        </button>
        {STAGES.map((stage) => (
          <button
            key={stage}
            onClick={() => setStageFilter(stage)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              stageFilter === stage
                ? "bg-navy text-white border-navy"
                : "bg-panel text-muted border-border hover:border-navy"
            }`}
          >
            {stage} ({contacts.filter((c) => c.stage === stage).length})
          </button>
        ))}
      </div>

      <div className="bg-panel border border-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted">No contacts match.</div>
        ) : (
          filtered.map((c) => (
            <Link
              key={c.id}
              href={`/contacts/${c.id}`}
              className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-b-0 hover:bg-background transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {initials(c.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-navy">{c.name}</div>
                <div className="text-xs text-muted mt-0.5 truncate">{c.interest}</div>
              </div>
              <div className="text-xs text-muted w-28 shrink-0 hidden md:block">{c.phone}</div>
              <div className="text-xs text-muted w-24 shrink-0 hidden lg:block">
                Last: {relativeDay(c.lastContact)}
              </div>
              <StageBadge stage={c.stage} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
