"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildMonthGrid, MONTH_NAMES, WEEKDAY_LABELS } from "@/lib/calendar-grid";
import { CalendarEvent, Contact } from "@/lib/types";
import EventTypeBadge, { EVENT_ICON } from "@/components/EventTypeBadge";

export default function CalendarView({
  contacts,
  events,
}: {
  contacts: Contact[];
  events: CalendarEvent[];
}) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [today]);

  const [selectedDate, setSelectedDate] = useState(todayStr);

  const grid = useMemo(
    () => buildMonthGrid(cursor.getFullYear(), cursor.getMonth(), today),
    [cursor, today]
  );

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const list = map.get(e.date) ?? [];
      list.push(e);
      map.set(e.date, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.time.localeCompare(b.time));
    return map;
  }, [events]);

  const selectedEvents = eventsByDate.get(selectedDate) ?? [];

  function changeMonth(delta: number) {
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-panel border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-navy">
            {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="w-8 h-8 rounded-lg border border-border hover:border-navy text-muted hover:text-navy transition-colors"
            >
              ‹
            </button>
            <button
              onClick={() => {
                setCursor(new Date(today.getFullYear(), today.getMonth(), 1));
                setSelectedDate(todayStr);
              }}
              className="px-3 h-8 rounded-lg border border-border hover:border-navy text-xs font-medium text-muted hover:text-navy transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="w-8 h-8 rounded-lg border border-border hover:border-navy text-muted hover:text-navy transition-colors"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAY_LABELS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((cell) => {
            const dayEvents = eventsByDate.get(cell.dateStr) ?? [];
            const selected = cell.dateStr === selectedDate;
            return (
              <button
                key={cell.dateStr}
                onClick={() => setSelectedDate(cell.dateStr)}
                className={`min-h-20 text-left p-1.5 rounded-lg border transition-colors ${
                  selected
                    ? "border-accent bg-accent-soft"
                    : "border-transparent hover:border-border"
                } ${!cell.inCurrentMonth ? "opacity-35" : ""}`}
              >
                <span
                  className={`text-xs inline-flex items-center justify-center w-5 h-5 rounded-full ${
                    cell.isToday ? "bg-navy text-white font-semibold" : "text-navy"
                  }`}
                >
                  {cell.date.getDate()}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div key={e.id} className="text-[10px] truncate text-muted">
                      {EVENT_ICON[e.type]} {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-muted">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-panel border border-border rounded-xl p-5">
        <h2 className="font-semibold text-navy mb-4">
          {selectedDate === todayStr ? "Today" : selectedDate}
        </h2>
        <div className="space-y-3">
          {selectedEvents.map((e) => {
            const contact = contacts.find((c) => c.id === e.contactId);
            const body = (
              <div className="border border-border rounded-lg p-3 hover:border-accent transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-navy">{e.time}</span>
                  <EventTypeBadge type={e.type} />
                </div>
                <div className="text-sm text-navy">{e.title}</div>
                {contact && <div className="text-xs text-muted mt-0.5">{contact.name}</div>}
              </div>
            );
            return contact ? (
              <Link key={e.id} href={`/contacts/${contact.id}`}>
                {body}
              </Link>
            ) : (
              <div key={e.id}>{body}</div>
            );
          })}
          {selectedEvents.length === 0 && (
            <div className="text-sm text-muted">Nothing scheduled.</div>
          )}
        </div>
      </div>
    </div>
  );
}
