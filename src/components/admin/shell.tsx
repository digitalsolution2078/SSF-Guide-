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
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-gray-950 lg:flex">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
          <span className="rounded-lg bg-primary-600 px-2 py-1 text-sm font-bold text-white">
            SSF
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Guide Nepal</p>
            <p className="text-[11px] text-gray-500">Admin Console</p>
          </div>
        </div>
        <AdminNav />
        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-gray-200">{email}</p>
              <p className="text-[11px] text-gray-500">{role}</p>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex-1 rounded-lg border border-white/10 px-2 py-1.5 text-center text-xs text-gray-300 hover:bg-white/5"
            >
              🌐 Site हेर्नुहोस्
            </Link>
            <form action={logoutAction} className="flex-1">
              <button className="w-full rounded-lg border border-white/10 px-2 py-1.5 text-xs text-gray-300 hover:bg-white/5">
                Logout
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <span className="rounded bg-primary-600 px-1.5 py-0.5 text-xs font-bold text-white">
                SSF
              </span>
              Admin
            </span>
            <form action={logoutAction}>
              <button className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-600">
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
