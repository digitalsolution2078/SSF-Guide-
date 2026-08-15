"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
}

const GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "मुख्य",
    items: [
      { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
      { href: "/admin/leads", label: "Leads Inbox", icon: "📋" },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/blog", label: "Blog", icon: "📰" },
      { href: "/admin/content", label: "FAQs", icon: "✍️" },
      { href: "/admin/knowledge", label: "AI Knowledge", icon: "🧠" },
      { href: "/admin/testimonials", label: "Testimonials", icon: "⭐" },
    ],
  },
  {
    title: "Growth",
    items: [
      { href: "/admin/notifications", label: "Push Notifications", icon: "🔔" },
      { href: "/admin/questions", label: "Unanswered Qs", icon: "❓" },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/rates", label: "Rate Manager", icon: "⚙️" },
      { href: "/admin/security", label: "Security · 2FA", icon: "🔒" },
    ],
  },
];

function isActive(pathname: string, item: NavItem): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

/** Sidebar navigation (desktop). */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
      {GROUPS.map((g) => (
        <div key={g.title}>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-eyebrow text-ink-400">
            {g.title}
          </p>
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active = isActive(pathname, item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-lg border-l-2 px-3 py-2 text-sm transition-colors ${
                      active
                        ? "border-primary-600 bg-primary-50 font-semibold text-primary-800"
                        : "border-transparent text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                    }`}
                  >
                    <span className="text-base leading-none opacity-90">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** Horizontal scrollable navigation (mobile top bar). */
export function AdminNavMobile() {
  const pathname = usePathname();
  const items = GROUPS.flatMap((g) => g.items);
  return (
    <nav className="flex gap-1.5 overflow-x-auto px-3 pb-2 [scrollbar-width:none] lg:hidden">
      {items.map((item) => {
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "border-primary-600 bg-primary-50 text-primary-800"
                : "border-ink-200 bg-white text-ink-600 hover:border-ink-400"
            }`}
          >
            {item.icon} {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
