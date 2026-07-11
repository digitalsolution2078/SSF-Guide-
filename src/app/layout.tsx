import type { ReactNode } from "react";

// Root layout only passes through — the real <html> lives in [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
