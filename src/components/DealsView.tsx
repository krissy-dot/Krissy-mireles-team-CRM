"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Contact, Deal, DEAL_STAGES, DealStage, DealType } from "@/lib/types";
import { formatCurrency, initials, relativeDay } from "@/lib/format";

type TypeFilter = DealType | "all";

const TYPE_TABS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "buyer", label: "Buyers" },
  { key: "seller", label: "Sellers" },
  { key: "lease", label: "Leases" },
];

const STAGE_COLOR: Record<DealStage, string> = {
  "Submitting Offers": "bg-purple-400",
  "Active Option Contract": "bg-amber-400",
  Pending: "bg-blue-400",
  Closed: "bg-green-400",
};

export default function DealsView({ contacts, deals }: { contacts: Contact[]; deals: Deal[] }) {
  const [dealList, setDealList] = useState(deals);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<DealStage | null>(null);

  function moveDeal(id: string, stage: DealStage) {
    setDealList((prev) => prev.map((d) => (d.id === id ? { ...d, stage } : d)));
  }

  const filtered = useMemo(
    () => dealList.filter((d) => typeFilter === "all" || d.type === typeFilter),
    [dealList, typeFilter]
  );

  const counts = useMemo(
    () => ({
      all: dealList.length,
      buyer: dealList.filter((d) => d.type === "buyer").length,
      seller: dealList.filter((d) => d.type === "seller").length,
      lease: dealList.filter((d) => d.type === "lease").length,
    }),
    [dealList]
  );

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {TYPE_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTypeFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              typeFilter === t.key
                ? "bg-navy text-white border-navy"
                : "bg-panel text-muted border-border hover:border-navy"
            }`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-2">
          {DEAL_STAGES.map((stage) => {
            const stageDeals = filtered.filter((d) => d.stage === stage);
            const total = stageDeals.reduce((sum, d) => sum + d.value, 0);
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
                  if (id) moveDeal(id, stage);
                  setDraggedId(null);
                  setOverStage(null);
                }}
                className={`w-72 shrink-0 rounded-xl transition-colors ${
                  overStage === stage ? "bg-accent-soft/60" : ""
                }`}
              >
                <div className={`h-1.5 rounded-full mb-3 ${STAGE_COLOR[stage]}`} />
                <div className="mb-3 px-1">
                  <h3 className="text-sm font-semibold text-navy">{stage}</h3>
                  <div className="text-xs text-muted mt-0.5">
                    {stageDeals.length} deal{stageDeals.length === 1 ? "" : "s"}
                    {total > 0 && <> · {formatCurrency(total)}</>}
                  </div>
                </div>
                <div className="space-y-3 min-h-16 px-1">
                  {stageDeals.map((d) => {
                    const contact = contacts.find((c) => c.id === d.contactId);
                    return (
                      <Link
                        key={d.id}
                        href={contact ? `/contacts/${contact.id}` : "#"}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", d.id);
                          e.dataTransfer.effectAllowed = "move";
                          setDraggedId(d.id);
                        }}
                        onDragEnd={() => {
                          setDraggedId(null);
                          setOverStage(null);
                        }}
                        className={`block bg-panel border border-border rounded-xl p-4 hover:border-accent transition-colors cursor-grab active:cursor-grabbing ${
                          draggedId === d.id ? "opacity-40" : ""
                        }`}
                      >
                        <div className="text-sm font-medium text-navy">{d.title}</div>
                        <div className="text-sm font-semibold text-green-700 mt-1">
                          {formatCurrency(d.value)}
                        </div>
                        <div className="text-xs text-muted mt-2">
                          {d.closeDateLabel}: {relativeDay(d.closeDate)}
                        </div>
                        {contact && (
                          <div className="flex items-center gap-2 mt-3">
                            <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
                              {initials(contact.name)}
                            </div>
                            <span className="text-xs text-muted truncate">{contact.name}</span>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                  {stageDeals.length === 0 && (
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
    </div>
  );
}
