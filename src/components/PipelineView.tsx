"use client";

import { useState } from "react";
import Link from "next/link";
import { Contact, Stage, STAGES } from "@/lib/types";
import { initials, relativeDay } from "@/lib/format";

export default function PipelineView({ contacts }: { contacts: Contact[] }) {
  const [list, setList] = useState(contacts);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);

  function moveCard(id: string, stage: Stage) {
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, stage } : c)));
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-2">
        {STAGES.map((stage) => {
          const stageContacts = list.filter((c) => c.stage === stage);
          return (
            <div
              key={stage}
              onDragOver={(e) => {
                e.preventDefault();
                setOverStage(stage);
              }}
              onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/plain");
                if (id) moveCard(id, stage);
                setDraggedId(null);
                setOverStage(null);
              }}
              className={`w-64 shrink-0 rounded-xl transition-colors ${
                overStage === stage ? "bg-accent-soft/60" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-navy">{stage}</h3>
                <span className="text-xs text-muted bg-panel border border-border rounded-full px-2 py-0.5">
                  {stageContacts.length}
                </span>
              </div>
              <div className="space-y-3 min-h-16 px-1">
                {stageContacts.map((c) => (
                  <Link
                    key={c.id}
                    href={`/contacts/${c.id}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", c.id);
                      e.dataTransfer.effectAllowed = "move";
                      setDraggedId(c.id);
                    }}
                    onDragEnd={() => {
                      setDraggedId(null);
                      setOverStage(null);
                    }}
                    className={`block bg-panel border border-border rounded-xl p-4 hover:border-accent transition-colors cursor-grab active:cursor-grabbing ${
                      draggedId === c.id ? "opacity-40" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center text-xs font-semibold shrink-0">
                        {initials(c.name)}
                      </div>
                      <div className="text-sm font-medium text-navy truncate">{c.name}</div>
                    </div>
                    <div className="text-xs text-muted truncate">{c.interest}</div>
                    <div className="text-xs text-muted mt-2">Last: {relativeDay(c.lastContact)}</div>
                  </Link>
                ))}
                {stageContacts.length === 0 && (
                  <div className="text-xs text-muted border border-dashed border-border rounded-xl p-4 text-center">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
