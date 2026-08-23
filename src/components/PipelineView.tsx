"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Contact, Stage, STAGES } from "@/lib/types";
import { initials, relativeDay } from "@/lib/format";

const DRAG_THRESHOLD = 6;

export default function PipelineView({ contacts }: { contacts: Contact[] }) {
  const router = useRouter();
  const [list, setList] = useState(contacts);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);

  // Refs are the source of truth for logic (state can lag a render behind
  // during rapid pointer events); state below only drives visuals.
  const dragIdRef = useRef<string | null>(null);
  const overStageRef = useRef<Stage | null>(null);
  const movedRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  function moveCard(id: string, stage: Stage) {
    setList((prev) => prev.map((c) => (c.id === id ? { ...c, stage } : c)));
  }

  function handlePointerDown(e: React.PointerEvent, id: string) {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
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
    const stage = (stageEl?.dataset.stage as Stage) ?? null;
    overStageRef.current = stage;
    setOverStage(stage);
  }

  function handlePointerUp(e: React.PointerEvent, id: string, href: string) {
    if (dragIdRef.current !== id) return;
    if (movedRef.current && overStageRef.current) {
      moveCard(id, overStageRef.current);
    } else if (!movedRef.current) {
      router.push(href);
    }
    dragIdRef.current = null;
    overStageRef.current = null;
    setDragId(null);
    setDragPos(null);
    setOverStage(null);
  }

  const draggedContact = list.find((c) => c.id === dragId);

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-2">
        {STAGES.map((stage) => {
          const stageContacts = list.filter((c) => c.stage === stage);
          return (
            <div
              key={stage}
              data-stage={stage}
              className={`w-64 shrink-0 rounded-xl transition-colors ${
                overStage === stage && dragId ? "bg-accent-soft/60" : ""
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
                  <div
                    key={c.id}
                    onPointerDown={(e) => handlePointerDown(e, c.id)}
                    onPointerMove={(e) => handlePointerMove(e, c.id)}
                    onPointerUp={(e) => handlePointerUp(e, c.id, `/contacts/${c.id}`)}
                    style={{ touchAction: "none" }}
                    className={`bg-panel border border-border rounded-xl p-4 hover:border-accent transition-colors cursor-grab active:cursor-grabbing select-none ${
                      dragId === c.id ? "opacity-40" : ""
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
                  </div>
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

      {dragId && dragPos && draggedContact && (
        <div
          className="fixed z-50 pointer-events-none bg-navy text-white text-xs font-medium px-3 py-2 rounded-lg shadow-lg"
          style={{ left: dragPos.x + 12, top: dragPos.y + 12 }}
        >
          {draggedContact.name}
        </div>
      )}
    </div>
  );
}
