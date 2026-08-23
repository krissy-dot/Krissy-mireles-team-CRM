"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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

const DRAG_THRESHOLD = 6;

export default function DealsView({ contacts, deals }: { contacts: Contact[]; deals: Deal[] }) {
  const router = useRouter();
  const [dealList, setDealList] = useState(deals);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [overStage, setOverStage] = useState<DealStage | null>(null);

  // Refs are the source of truth for logic (state can lag a render behind
  // during rapid pointer events); state below only drives visuals.
  const dragIdRef = useRef<string | null>(null);
  const overStageRef = useRef<DealStage | null>(null);
  const movedRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  function moveDeal(id: string, stage: DealStage) {
    setDealList((prev) => prev.map((d) => (d.id === id ? { ...d, stage } : d)));
  }

  function handlePointerDown(e: React.PointerEvent, id: string) {
    if (e.button !== undefined && e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
    dragIdRef.current = id;
    overStageRef.current = null;
    setDragId(id);
    setDragPos({ x: e.clientX, y: e.clientY });
  }

  function handlePointerMove(e: React.PointerEvent, id: string) {
    if (dragIdRef.current !== id) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD) movedRef.current = true;
    setDragPos({ x: e.clientX, y: e.clientY });

    const el = document.elementFromPoint(e.clientX, e.clientY);
    const stageEl = el?.closest<HTMLElement>("[data-stage]");
    const stage = (stageEl?.dataset.stage as DealStage) ?? null;
    overStageRef.current = stage;
    setOverStage(stage);
  }

  function handlePointerUp(e: React.PointerEvent, id: string, href: string | null) {
    if (dragIdRef.current !== id) return;
    if (movedRef.current && overStageRef.current) {
      moveDeal(id, overStageRef.current);
    } else if (!movedRef.current && href) {
      router.push(href);
    }
    dragIdRef.current = null;
    overStageRef.current = null;
    setDragId(null);
    setDragPos(null);
    setOverStage(null);
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

  const draggedDeal = dealList.find((d) => d.id === dragId);

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
                data-stage={stage}
                className={`w-72 shrink-0 rounded-xl transition-colors ${
                  overStage === stage && dragId ? "bg-accent-soft/60" : ""
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
                      <div
                        key={d.id}
                        onPointerDown={(e) => handlePointerDown(e, d.id)}
                        onPointerMove={(e) => handlePointerMove(e, d.id)}
                        onPointerUp={(e) =>
                          handlePointerUp(e, d.id, contact ? `/contacts/${contact.id}` : null)
                        }
                        style={{ touchAction: "none" }}
                        className={`bg-panel border border-border rounded-xl p-4 hover:border-accent transition-colors cursor-grab active:cursor-grabbing select-none ${
                          dragId === d.id ? "opacity-40" : ""
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
                      </div>
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

      {dragId && dragPos && draggedDeal && (
        <div
          className="fixed z-50 pointer-events-none bg-navy text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg"
          style={{ left: dragPos.x + 12, top: dragPos.y + 12 }}
        >
          {draggedDeal.title}
        </div>
      )}
    </div>
  );
}
