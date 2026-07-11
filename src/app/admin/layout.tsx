import type { ReactNode } from "react";
import { Mukta } from "next/font/google";
import "../globals.css";

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = { robots: { index: false } };

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ne" className={mukta.className}>
      <body>{children}</body>
    </html>
  );
}
