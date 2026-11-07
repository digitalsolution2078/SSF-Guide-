"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";
import { BrandMark, Icon, type IconName } from "./icons";

interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  desc?: string;
}
interface NavGroup {
  key: string;
  label: string;
  desc: string;
  icon: IconName;
  items: NavItem[];
}

/**
 * Site header — grouped navigation (Learn / Tools / Hospitals / Help) with
 * hover/focus dropdowns on desktop and a full-screen sheet on mobile.
 */
export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const isEn = locale === "en";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile sheet on navigation and lock body scroll while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const groups: NavGroup[] = [
    {
      key: "learn",
      label: t("learn"),
      desc: t("learnDesc"),
      icon: "book",
      items: [
        { href: "/school", label: t("school"), icon: "school", desc: isEn ? "8 topics · guides + videos" : "८ विषय · guide + भिडियो" },
        { href: "/sector", label: t("sectors"), icon: "compass" },
        { href: "/faq", label: t("faq"), icon: "help" },
        { href: "/blog", label: t("blog"), icon: "newspaper" },
        { href: "/downloads", label: t("downloads"), icon: "download" },
        { href: "/sources", label: t("sources"), icon: "file" },
      ],
    },
    {
      key: "tools",
      label: t("tools"),
      desc: t("toolsDesc"),
      icon: "calculator",
      items: [
        { href: "/calculators", label: t("calculators"), icon: "calculator", desc: isEn ? "21 calculators & planners" : "२१ क्याल्कुलेटर र planner" },
        { href: "/calculators/contribution", label: t("contribution"), icon: "percent" },
        { href: "/calculators/financial-planner", label: t("planner"), icon: "trending" },
        { href: "/rates", label: t("rates"), icon: "landmark" },
        { href: "/assessment", label: t("assessment"), icon: "sparkles" },
        { href: "/eligibility", label: t("eligibility"), icon: "checkCircle" },
        { href: "/checklists", label: t("checklists"), icon: "list" },
      ],
    },
    {
      key: "help",
      label: t("servicesGroup"),
      desc: t("servicesDesc"),
      icon: "users",
      items: [
        { href: "/ask", label: t("ask"), icon: "chat", desc: isEn ? "Instant answers, 24/7" : "तुरुन्त उत्तर, २४/७" },
        { href: "/services", label: t("services"), icon: "briefcase" },
        { href: "/request", label: t("request"), icon: "send" },
        { href: "/track", label: t("track"), icon: "locate" },
        { href: "/contact", label: t("contact"), icon: "phone" },
      ],
    },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  const groupActive = (g: NavGroup) => g.items.some((i) => isActive(i.href));

  return (
    // NB: no backdrop-filter here — it would become the containing block for the
    // fixed-position mobile sheet below and collapse it to the header's height.
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white print:hidden">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="SSF Guide Nepal — home">
          <BrandMark size={34} />
          <span className="leading-tight">
            <span className="block font-display text-[17px] font-bold tracking-tight text-ink-900">SSF Guide</span>
            <span className="hidden text-[11px] font-medium uppercase tracking-eyebrow text-ink-400 sm:block">
              Nepal · Digital Solution
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {groups.map((g) => (
            <div key={g.key} className="group relative">
              <button
                type="button"
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-ink-100 hover:text-ink-900 ${
                  groupActive(g) ? "text-primary-700" : "text-ink-700"
                }`}
                aria-haspopup="true"
              >
                {g.label}
                <Icon name="chevronDown" size={14} className="text-ink-400 transition group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 w-[22rem] translate-y-1 pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="rounded-2xl border border-ink-200 bg-white p-2 shadow-pop">
                  <p className="px-3 pb-2 pt-1.5 text-xs text-ink-400">{g.desc}</p>
                  {g.items.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition hover:bg-primary-50 ${
                        isActive(it.href) ? "bg-primary-50 text-primary-800" : "text-ink-800"
                      }`}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-ink-600">
                        <Icon name={it.icon} size={16} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-semibold">{it.label}</span>
                        {it.desc && <span className="block text-xs text-ink-400">{it.desc}</span>}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Link
            href="/hospitals"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-health-50 ${
              isActive("/hospitals") ? "text-health-700" : "text-ink-700 hover:text-health-700"
            }`}
          >
            <Icon name="hospital" size={16} className="text-health-600" />
            {t("hospitals")}
          </Link>
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/search"
            aria-label={t("search")}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-600 transition hover:bg-ink-100 hover:text-ink-900"
          >
            <Icon name="search" size={20} />
          </Link>
          <LocaleSwitcher />
          <Link href="/request" className="btn-accent hidden md:inline-flex">
            {t("help")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("close") : t("menu")}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-800 transition hover:bg-ink-100 lg:hidden"
          >
            <Icon name={open ? "x" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto bg-white lg:hidden animate-fade-up"
        >
          <div className="container-page py-4">
            <form action="/search" method="get" className="relative">
              <Icon name="search" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                name="q"
                placeholder={isEn ? "Search guides, FAQs, hospitals…" : "Guide, FAQ, अस्पताल खोज्नुहोस्…"}
                className="input pl-10"
              />
            </form>

            <Link
              href="/hospitals"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-health-200 bg-health-50 px-4 py-3.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-health-700 shadow-sm">
                <Icon name="hospital" size={20} />
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-health-900">{t("hospitalsAll")}</span>
                <span className="block text-xs text-health-700">
                  {isEn ? "123 hospitals · 7 provinces · map links" : "१२३ अस्पताल · ७ प्रदेश · नक्सासहित"}
                </span>
              </span>
              <Icon name="chevronRight" size={18} className="text-health-600" />
            </Link>

            {groups.map((g) => (
              <section key={g.key} className="mt-6">
                <p className="eyebrow">{g.label}</p>
                <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {g.items.map((it) => (
                    <li key={it.href}>
                      <Link
                        href={it.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] ${
                          isActive(it.href) ? "bg-primary-50 font-semibold text-primary-800" : "text-ink-800 hover:bg-ink-50"
                        }`}
                      >
                        <Icon name={it.icon} size={18} className="text-ink-500" />
                        {it.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <div className="mt-8 flex gap-2 pb-24">
              <Link href="/request" className="btn-accent flex-1">
                {t("help")}
              </Link>
              <Link href="/ask" className="btn-outline flex-1">
                {t("ask")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
