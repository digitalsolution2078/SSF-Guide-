import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./locale-switcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");

  return (
    <header className="sticky top-0 z-40 border-b border-primary-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-lg bg-primary-600 px-2 py-1 text-sm font-bold text-white">
            SSF
          </span>
          <span className="hidden text-lg font-semibold text-primary-800 sm:inline">
            {brand("name")}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
          <Link href="/school" className="hover:text-primary-600">
            {t("school")}
          </Link>
          <Link href="/sector" className="hover:text-primary-600">
            {t("sectors")}
          </Link>
          <Link href="/calculators" className="hover:text-primary-600">
            {t("calculators")}
          </Link>
          <Link href="/ask" className="hover:text-primary-600">
            {t("ask")}
          </Link>
          <Link href="/blog" className="hover:text-primary-600">
            {t("blog")}
          </Link>
          <Link href="/services" className="hover:text-primary-600">
            {t("services")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="text-lg text-gray-500 hover:text-primary-600"
          >
            🔍
          </Link>
          <LocaleSwitcher />
          <Link
            href="/request"
            className="hidden rounded-lg bg-action-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-action-600 sm:block"
          >
            {t("help")}
          </Link>

          {/* Mobile menu — JS-free disclosure */}
          <details className="group relative md:hidden">
            <summary
              aria-label="Menu"
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-lg text-2xl leading-none text-gray-700 [&::-webkit-details-marker]:hidden"
            >
              <span className="group-open:hidden">☰</span>
              <span className="hidden group-open:inline">✕</span>
            </summary>
            <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-primary-100 bg-white p-2 shadow-xl">
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
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700"
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
