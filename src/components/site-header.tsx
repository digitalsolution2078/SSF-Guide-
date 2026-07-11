import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  const t = useTranslations("nav");
  const brand = useTranslations("brand");
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-primary-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-lg bg-primary-600 px-2 py-1 text-sm font-bold text-white">
            SSF
          </span>
          <span className="text-lg font-semibold text-primary-800">
            {brand("name")}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
          <Link href="/school" className="hover:text-primary-600">
            {t("school")}
          </Link>
          <Link href="/calculators" className="hover:text-primary-600">
            {t("calculators")}
          </Link>
          <Link href="/ask" className="hover:text-primary-600">
            {t("ask")}
          </Link>
          <Link href="/services" className="hover:text-primary-600">
            {t("services")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="text-lg text-gray-500 hover:text-primary-600"
          >
            🔍
          </Link>
          <Link
            href="/"
            locale={locale === "ne" ? "en" : "ne"}
            className="text-sm text-gray-500 hover:text-primary-600"
          >
            {locale === "ne" ? "EN" : "ने"}
          </Link>
          <Link
            href="/request"
            className="rounded-lg bg-action-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-action-600"
          >
            {t("help")}
          </Link>
        </div>
      </div>
    </header>
  );
}
