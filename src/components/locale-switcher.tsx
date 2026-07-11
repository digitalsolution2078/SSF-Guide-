"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/**
 * Prominent नेपाली | English toggle — both options always visible,
 * current path preserved on switch. Nepali is the primary language.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const base =
    "px-3 py-1.5 text-sm font-semibold transition whitespace-nowrap";
  const active = "bg-primary-600 text-white";
  const inactive = "text-gray-600 hover:text-primary-700";

  return (
    <div
      className="flex overflow-hidden rounded-full border-2 border-primary-200 bg-white"
      role="group"
      aria-label="Language / भाषा"
    >
      <Link
        href={pathname}
        locale="ne"
        className={`${base} ${locale === "ne" ? active : inactive}`}
      >
        नेपाली
      </Link>
      <Link
        href={pathname}
        locale="en"
        className={`${base} ${locale === "en" ? active : inactive}`}
      >
        English
      </Link>
    </div>
  );
}
