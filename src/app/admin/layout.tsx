import type { ReactNode } from "react";
import { Mukta } from "next/font/google";
import { getSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/shell";
import "../globals.css";

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = { robots: { index: false } };

export default async function AdminRootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  return (
    <html lang="ne" className={mukta.className}>
      <body className="bg-ink-50">
        {session ? (
          <AdminShell email={session.email} role={session.role}>
            {children}
          </AdminShell>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
