"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon, type IconName } from "./icons";

/**
 * Mobile bottom tab bar — the five destinations people actually need:
 * Home · Learn · Tools · Hospitals · Help. Hidden on ≥ md screens.
 */
export function BottomNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const isEn = locale === "en";

  const tabs: { href: string; label: string; icon: IconName; match: string[] }[] = [
    { href: "/", label: t("home"), icon: "home", match: ["/"] },
    { href: "/school", label: t("learn"), icon: "book", match: ["/school", "/faq", "/blog", "/sector", "/downloads"] },
    { href: "/calculators", label: t("tools"), icon: "calculator", match: ["/calculators", "/rates", "/assessment", "/eligibility", "/checklists"] },
    { href: "/hospitals", label: t("hospitals"), icon: "hospital", match: ["/hospitals"] },
    { href: "/request", label: isEn ? "Help" : "सहायता", icon: "help", match: ["/request", "/services", "/ask", "/track", "/contact"] },
  ];

  const active = (m: string[]) =>
    m.some((p) => (p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/")));

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden print:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const on = active(tab.match);
          const isHosp = tab.href === "/hospitals";
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={on ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 px-1 pb-2 pt-2.5 text-[11px] font-semibold ${
                  on ? (isHosp ? "text-health-700" : "text-primary-700") : "text-ink-500"
                }`}
              >
                <span
                  className={`flex h-7 w-12 items-center justify-center rounded-full transition ${
                    on ? (isHosp ? "bg-health-50" : "bg-primary-50") : ""
                  }`}
                >
                  <Icon name={tab.icon} size={20} strokeWidth={on ? 2.4 : 2} />
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
