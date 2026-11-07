"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * Compact नेपाली | EN toggle — both options always visible, current path
 * preserved on switch. Nepali is the primary language.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const base = "px-2.5 py-1.5 text-xs font-bold transition whitespace-nowrap sm:px-3 sm:text-sm";
  const active = "bg-ink-900 text-white";
  const inactive = "text-ink-600 hover:text-ink-900";

  return (
    <div
      className="flex overflow-hidden rounded-full border border-ink-300 bg-white"
      role="group"
      aria-label="Language / भाषा"
    >
      <Link href={pathname} locale="ne" className={`${base} ${locale === "ne" ? active : inactive}`}>
        ने
      </Link>
      <Link href={pathname} locale="en" className={`${base} ${locale === "en" ? active : inactive}`}>
        EN
      </Link>
    </div>
  );
}
