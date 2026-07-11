import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("footer");
  const d = useTranslations("disclaimer");

  return (
    <footer className="mt-16 border-t border-primary-100 bg-primary-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 rounded-xl border border-primary-200 bg-white p-5 text-sm text-gray-700">
          <p className="mb-1 font-semibold text-primary-800">
            {d("headline")}
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>{d("independent")}</li>
            <li>{d("verified")}</li>
            <li>{d("official")}</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-600">
          <Link href="/about" className="hover:text-primary-600">
            {t("about")}
          </Link>
          <Link href="/contact" className="hover:text-primary-600">
            {t("contact")}
          </Link>
          <a
            href="https://ssf.gov.np"
            rel="noopener noreferrer"
            target="_blank"
            className="hover:text-primary-600"
          >
            {t("officialSSF")} ↗
          </a>
          <Link href="/privacy" className="hover:text-primary-600">
            {t("privacy")}
          </Link>
          <Link href="/terms" className="hover:text-primary-600">
            {t("terms")}
          </Link>
          <Link href="/disclaimer" className="hover:text-primary-600">
            {t("disclaimer")}
          </Link>
          <Link href="/report-correction" className="hover:text-primary-600">
            {t("correction")}
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          © {new Date().getFullYear()} Digital Solution ·{" "}
          <span>SSF Guide Nepal</span>
        </p>
      </div>
    </footer>
  );
}
