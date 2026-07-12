"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

const WA_LINK = "https://whatsapp.digitalsolutionnepal.com";

/** Floating action buttons (bottom-right): AI chat + WhatsApp. */
export function FloatingActions() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 print:hidden">
      {open && (
        <>
          <Link
            href="/ask"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-full bg-primary-600 py-2.5 pl-4 pr-5 text-sm font-bold text-white shadow-xl transition hover:bg-primary-700"
          >
            🤖 {isEn ? "Ask the SSF AI" : "SSF AI सँग सोध्नुहोस्"}
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-green-600 py-2.5 pl-4 pr-5 text-sm font-bold text-white shadow-xl transition hover:bg-green-700"
          >
            💬 {isEn ? "Chat on WhatsApp" : "WhatsApp मा कुरा गर्नुहोस्"}
          </a>
        </>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={isEn ? "Help options" : "सहायता options"}
        className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-xl transition hover:scale-105 ${
          open ? "bg-gray-700 text-white" : "bg-action-500 text-white"
        }`}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
