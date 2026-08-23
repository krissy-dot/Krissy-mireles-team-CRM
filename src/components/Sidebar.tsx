"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Dashboard", icon: "home" },
  { href: "/inbox", label: "Inbox", icon: "inbox" },
  { href: "/contacts", label: "Contacts", icon: "people" },
  { href: "/pipeline", label: "Pipeline", icon: "pipeline" },
  { href: "/deals", label: "Deals", icon: "deals" },
  { href: "/calendar", label: "Calendar", icon: "calendar" },
  { href: "/tasks", label: "Follow-Ups", icon: "check" },
];

function Icon({ name }: { name: string }) {
  const common = "w-5 h-5";
  switch (name) {
    case "home":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "inbox":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3.5 6.5h17v11a1.5 1.5 0 0 1-1.5 1.5h-14a1.5 1.5 0 0 1-1.5-1.5v-11Z" strokeLinejoin="round" />
          <path d="M3.5 12h5l1.5 2.5h4L15.5 12h5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "people":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
          <circle cx="17" cy="9" r="2.3" />
          <path d="M15.5 13.2c2.5.3 4.5 2.5 4.5 5.8" strokeLinecap="round" />
        </svg>
      );
    case "pipeline":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="4.5" height="16" rx="1" />
          <rect x="9.75" y="4" width="4.5" height="11" rx="1" />
          <rect x="16.5" y="4" width="4.5" height="7" rx="1" />
        </svg>
      );
    case "deals":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5v9M9.5 9.8c0-1.3 1.1-2.1 2.5-2.1s2.5.7 2.5 1.9c0 2.6-5 1.3-5 3.9 0 1.2 1.1 1.9 2.5 1.9s2.5-.8 2.5-2.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M3.5 9.5h17" strokeLinecap="round" />
          <path d="M8 3v3.5M16 3v3.5" strokeLinecap="round" />
        </svg>
      );
    case "check":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
          <path d="M8 12.5l2.5 2.5L16 9.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 bg-navy text-white flex flex-col h-screen sticky top-0">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="text-lg font-semibold tracking-tight">Home Base</div>
        <div className="text-xs text-white/50 mt-0.5">CRM</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-accent text-navy"
                  : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-white/10 text-xs text-white/40">
        Signed in as <span className="text-white/70">Mom</span>
      </div>
    </aside>
  );
}
