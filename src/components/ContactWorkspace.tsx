"use client";

import { useState } from "react";
import { Activity, Message } from "@/lib/types";
import { relativeDay } from "@/lib/format";

const ACTIVITY_ICON: Record<Activity["type"], string> = {
  call: "☎",
  text: "\u{1F4AC}",
  email: "✉",
  note: "\u{1F4CC}",
  showing: "\u{1F3E0}",
};

const MESSAGE_ICON: Record<Message["channel"], string> = {
  email: "✉",
  text: "\u{1F4AC}",
};

type Tab = "text" | "call" | "email" | "note";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "text", label: "Text", icon: "\u{1F4AC}" },
  { key: "call", label: "Log Call", icon: "☎" },
  { key: "email", label: "Email", icon: "✉" },
  { key: "note", label: "Note", icon: "\u{1F4CC}" },
];

export default function ContactWorkspace({
  messages,
  activity,
}: {
  messages: Message[];
  activity: Activity[];
}) {
  const [tab, setTab] = useState<Tab>("text");

  const feed = [
    ...messages.map((m) => ({
      id: m.id,
      date: m.date,
      time: m.time,
      kind: "message" as const,
      message: m,
    })),
    ...activity.map((a) => ({
      id: a.id,
      date: a.date,
      time: "",
      kind: "activity" as const,
      activity: a,
    })),
  ].sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));

  return (
    <div className="bg-panel border border-border rounded-xl overflow-hidden">
        <div className="flex border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-accent text-navy"
                  : "border-transparent text-muted hover:text-navy"
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-b border-border bg-background">
          {tab === "text" && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a text message..."
                disabled
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-panel text-sm text-muted"
              />
              <button disabled className="px-4 py-2 rounded-lg bg-navy/40 text-white text-sm font-medium cursor-not-allowed">
                Send
              </button>
            </div>
          )}
          {tab === "call" && (
            <div className="flex gap-2">
              <select disabled className="px-3 py-2 rounded-lg border border-border bg-panel text-sm text-muted">
                <option>Answered</option>
                <option>No Answer</option>
                <option>Voicemail</option>
              </select>
              <input
                type="text"
                placeholder="Quick note about the call..."
                disabled
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-panel text-sm text-muted"
              />
              <button disabled className="px-4 py-2 rounded-lg bg-navy/40 text-white text-sm font-medium cursor-not-allowed">
                Log Call
              </button>
            </div>
          )}
          {tab === "email" && (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Subject"
                disabled
                className="w-full px-3 py-2 rounded-lg border border-border bg-panel text-sm text-muted"
              />
              <textarea
                placeholder="Write an email..."
                disabled
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-border bg-panel text-sm text-muted resize-none"
              />
              <div className="flex justify-end">
                <button disabled className="px-4 py-2 rounded-lg bg-navy/40 text-white text-sm font-medium cursor-not-allowed">
                  Send Email
                </button>
              </div>
            </div>
          )}
          {tab === "note" && (
            <div className="space-y-2">
              <textarea
                placeholder="Add a note..."
                disabled
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border bg-panel text-sm text-muted resize-none"
              />
              <div className="flex justify-end">
                <button disabled className="px-4 py-2 rounded-lg bg-navy/40 text-white text-sm font-medium cursor-not-allowed">
                  Save Note
                </button>
              </div>
            </div>
          )}
          <div className="text-[11px] text-muted mt-2">
            Sending/logging connects once texting, email, and calling are wired up to GHL.
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-[26rem] overflow-y-auto">
          {feed.map((item) =>
            item.kind === "message" ? (
              <div
                key={item.id}
                className={`flex ${item.message.direction === "outbound" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-sm rounded-2xl px-4 py-3 text-sm ${
                    item.message.direction === "outbound"
                      ? "bg-navy text-white"
                      : "bg-background border border-border text-navy"
                  }`}
                >
                  {item.message.subject && (
                    <div className="font-semibold mb-1">{item.message.subject}</div>
                  )}
                  <div>{item.message.body}</div>
                  <div
                    className={`text-[11px] mt-1.5 ${
                      item.message.direction === "outbound" ? "text-white/60" : "text-muted"
                    }`}
                  >
                    {MESSAGE_ICON[item.message.channel]} {relativeDay(item.message.date)} · {item.message.time}
                  </div>
                </div>
              </div>
            ) : (
              <div key={item.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-accent-soft text-accent flex items-center justify-center text-xs shrink-0">
                  {ACTIVITY_ICON[item.activity.type]}
                </div>
                <div>
                  <div className="text-sm text-navy">{item.activity.summary}</div>
                  <div className="text-xs text-muted mt-0.5">{relativeDay(item.activity.date)}</div>
                </div>
              </div>
            )
          )}
          {feed.length === 0 && <div className="text-sm text-muted">No activity yet.</div>}
        </div>
      </div>
  );
}
