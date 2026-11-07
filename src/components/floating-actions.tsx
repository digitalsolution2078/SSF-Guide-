"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "./icons";

const WA_LINK = "https://whatsapp.digitalsolutionnepal.com";

/** Floating help button (bottom-right): AI chat + WhatsApp. Sits above the mobile tab bar. */
export function FloatingActions() {
  const locale = useLocale();
  const isEn = locale === "en";
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-30 flex flex-col items-end gap-2.5 md:bottom-6 print:hidden">
      {open && (
        <>
          <Link
            href="/ask"
            onClick={() => setOpen(false)}
            className="btn-primary rounded-full py-2.5 pl-4 pr-5 shadow-pop animate-fade-up"
          >
            <Icon name="chat" size={18} />
            {isEn ? "Ask the SSF AI" : "SSF AI सँग सोध्नुहोस्"}
          </Link>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn rounded-full bg-[#25D366] py-2.5 pl-4 pr-5 text-white shadow-pop hover:bg-[#1ebe5b] animate-fade-up"
          >
            <Icon name="phone" size={18} />
            {isEn ? "Chat on WhatsApp" : "WhatsApp मा कुरा गर्नुहोस्"}
          </a>
        </>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={isEn ? "Help options" : "सहायता विकल्प"}
        className={`flex h-[52px] w-[52px] items-center justify-center rounded-full text-white shadow-pop transition hover:scale-105 ${
          open ? "bg-ink-800" : "bg-action-500"
        }`}
      >
        <Icon name={open ? "x" : "chat"} size={24} />
      </button>
    </div>
  );
}
