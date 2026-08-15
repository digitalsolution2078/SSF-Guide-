import type { ReactNode } from "react";
import Link from "next/link";
import { AdminNav, AdminNavMobile } from "./nav";
import { logoutAction } from "@/app/admin/actions";

export function AdminShell({
  email,
  role,
  children,
}: {
  email: string;
  role: string;
  children: ReactNode;
}) {
  const initial = (email[0] ?? "A").toUpperCase();
  return (
    <div className="min-h-screen bg-ink-50">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-ink-200 bg-white lg:flex">
        <div className="flex items-baseline gap-2 border-b border-ink-200 px-5 py-4">
          <span className="font-serif text-xl font-medium tracking-tight text-primary-800">
            SSF
          </span>
          <div>
            <p className="text-sm font-medium text-ink-800">Guide Nepal</p>
            <p className="text-[11px] uppercase tracking-eyebrow text-ink-400">Admin Console</p>
          </div>
        </div>
        <AdminNav />
        <div className="border-t border-ink-200 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-ink-700">{email}</p>
              <p className="text-[11px] text-ink-400">{role}</p>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 rounded-lg border border-ink-200 px-2 py-1.5 text-center text-xs text-ink-600 transition-colors hover:border-ink-400 hover:text-ink-900"
            >
              Site ↗
            </Link>
            <form action={logoutAction} className="flex-1">
              <button className="w-full rounded-lg border border-ink-200 px-2 py-1.5 text-xs text-ink-600 transition-colors hover:border-ink-400 hover:text-ink-900">
                Logout
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 border-b border-ink-200 bg-white/90 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="flex items-baseline gap-2 text-sm text-ink-900">
              <span className="font-serif text-lg font-medium text-primary-800">SSF</span>
              <span className="font-medium">Admin</span>
            </span>
            <form action={logoutAction}>
              <button className="rounded-lg border border-ink-200 px-3 py-1 text-xs text-ink-600">
                Logout
              </button>
            </form>
          </div>
          <AdminNavMobile />
        </header>

        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
