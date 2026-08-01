import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3.5">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-serif text-xl font-medium tracking-tight text-primary-800">
            SSF
          </span>
          <span className="hidden text-sm font-medium text-ink-500 group-hover:text-ink-800 sm:inline">
            {brand("name")}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-600 md:flex">
          {[
            { href: "/school", label: t("school") },
            { href: "/sector", label: t("sectors") },
            { href: "/calculators", label: t("calculators") },
            { href: "/ask", label: t("ask") },
            { href: "/blog", label: t("blog") },
            { href: "/services", label: t("services") },
            { href: "/downloads", label: "Downloads" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-primary-600 after:transition-all hover:text-ink-900 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/search"
            aria-label="Search"
            className="text-ink-400 transition-colors hover:text-primary-600"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Link>
          <LocaleSwitcher />
          <Link
            href="/request"
            className="hidden rounded-full bg-action-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-action-600 sm:block"
          >
            {t("help")}
          </Link>

          {/* Mobile menu — JS-free disclosure */}
          <details className="group relative md:hidden">
            <summary
              aria-label="Menu"
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-ink-700 [&::-webkit-details-marker]:hidden"
            >
              <svg className="group-open:hidden" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              <svg className="hidden group-open:block" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </summary>
            <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-ink-200 bg-white p-2 shadow-card">
              {[
                { href: "/school", label: t("school") },
                { href: "/sector", label: t("sectors") },
                { href: "/calculators", label: t("calculators") },
                { href: "/blog", label: t("blog") },
                { href: "/ask", label: t("ask") },
                { href: "/services", label: t("services") },
                { href: "/downloads", label: "Downloads" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 hover:text-primary-700"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/request"
                className="mt-1 block rounded-lg bg-action-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-action-600"
              >
                {t("help")}
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
