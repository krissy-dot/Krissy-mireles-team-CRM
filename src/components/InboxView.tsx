"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Contact, Message } from "@/lib/types";
import { initials, relativeDay } from "@/lib/format";

const CHANNEL_ICON: Record<Message["channel"], string> = {
  email: "✉",
  text: "\u{1F4AC}",
};

export default function InboxView({
  contacts,
  messages,
}: {
  contacts: Contact[];
  messages: Message[];
}) {
  const conversations = useMemo(() => {
    const byContact = new Map<string, Message[]>();
    for (const m of messages) {
      const list = byContact.get(m.contactId) ?? [];
      list.push(m);
      byContact.set(m.contactId, list);
    }
    return Array.from(byContact.entries())
      .map(([contactId, msgs]) => {
        const sorted = [...msgs].sort((a, b) =>
          `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)
        );
        const last = sorted[sorted.length - 1];
        return {
          contact: contacts.find((c) => c.id === contactId)!,
          messages: sorted,
          last,
          needsReply: last.direction === "inbound",
        };
      })
      .filter((c) => c.contact)
      .sort((a, b) => `${b.last.date}${b.last.time}`.localeCompare(`${a.last.date}${a.last.time}`));
  }, [contacts, messages]);

  const [selectedId, setSelectedId] = useState(conversations[0]?.contact.id ?? "");
  const selected = conversations.find((c) => c.contact.id === selectedId) ?? conversations[0];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-panel border border-border rounded-xl overflow-hidden">
      <div className="w-80 shrink-0 border-r border-border overflow-y-auto">
        {conversations.map((c) => (
          <button
            key={c.contact.id}
            onClick={() => setSelectedId(c.contact.id)}
            className={`w-full text-left flex gap-3 px-4 py-3 border-b border-border transition-colors ${
              selected?.contact.id === c.contact.id ? "bg-accent-soft" : "hover:bg-background"
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {initials(c.contact.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-sm truncate ${
                    c.needsReply ? "font-semibold text-navy" : "font-medium text-navy"
                  }`}
                >
                  {c.contact.name}
                </span>
                <span className="text-[11px] text-muted shrink-0">{relativeDay(c.last.date)}</span>
              </div>
              <div className="text-xs text-muted truncate mt-0.5">
                {CHANNEL_ICON[c.last.channel]} {c.last.direction === "outbound" ? "You: " : ""}
                {c.last.body}
              </div>
            </div>
            {c.needsReply && <span className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0" />}
          </button>
        ))}
      </div>

      {selected && (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <Link
                href={`/contacts/${selected.contact.id}`}
                className="text-sm font-semibold text-navy hover:text-accent"
              >
                {selected.contact.name}
              </Link>
              <div className="text-xs text-muted mt-0.5">
                {selected.contact.phone} · {selected.contact.email}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {selected.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.direction === "outbound" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md rounded-2xl px-4 py-3 text-sm ${
                    m.direction === "outbound"
                      ? "bg-navy text-white"
                      : "bg-background border border-border text-navy"
                  }`}
                >
                  {m.subject && <div className="font-semibold mb-1">{m.subject}</div>}
                  <div>{m.body}</div>
                  <div
                    className={`text-[11px] mt-1.5 ${
                      m.direction === "outbound" ? "text-white/60" : "text-muted"
                    }`}
                  >
                    {CHANNEL_ICON[m.channel]} {relativeDay(m.date)} · {m.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Write a reply..."
                disabled
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-muted"
              />
              <button
                disabled
                className="px-4 py-2 rounded-lg bg-navy/40 text-white text-sm font-medium cursor-not-allowed"
              >
                Send
              </button>
            </div>
            <div className="text-[11px] text-muted mt-2">
              Sending connects once texting/email are wired up to GHL.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
