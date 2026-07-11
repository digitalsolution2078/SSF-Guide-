import type { ReactNode } from "react";
import { Noto_Sans_Devanagari } from "next/font/google";
import "../globals.css";

const noto = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = { robots: { index: false } };

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ne" className={noto.className}>
      <body>{children}</body>
    </html>
  );
}
