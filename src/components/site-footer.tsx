import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const d = useTranslations("disclaimer");

  return (
    <footer className="mt-20 border-t border-ink-200 bg-ink-50">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand + disclaimer */}
          <div>
            <p className="font-serif text-xl text-ink-900">SSF Guide Nepal</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
              {d("headline")}
            </p>
            <ul className="mt-3 space-y-1 text-sm text-ink-500">
              <li>· {d("independent")}</li>
              <li>· {d("verified")}</li>
              <li>· {d("official")}</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <p className="eyebrow text-ink-400">{locale === "en" ? "Site" : "साइट"}</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-ink-600">
              <Link href="/about" className="hover:text-primary-700">{t("about")}</Link>
              <Link href="/contact" className="hover:text-primary-700">{t("contact")}</Link>
              <a href="https://ssf.gov.np" rel="noopener noreferrer" target="_blank" className="hover:text-primary-700">
                {t("officialSSF")} ↗
              </a>
              <Link href="/privacy" className="hover:text-primary-700">{t("privacy")}</Link>
              <Link href="/terms" className="hover:text-primary-700">{t("terms")}</Link>
              <Link href="/disclaimer" className="hover:text-primary-700">{t("disclaimer")}</Link>
              <Link href="/report-correction" className="hover:text-primary-700">{t("correction")}</Link>
            </div>
          </div>

          {/* Social + support */}
          <div>
            <p className="eyebrow text-ink-400">{locale === "en" ? "Follow" : "फलो गर्नुहोस्"}</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-ink-600">
              <a href="https://youtube.com/@rabinpaudel" target="_blank" rel="noopener" className="hover:text-primary-700">YouTube ↗</a>
              <a href="https://facebook.com/rabinpaudelofficial" target="_blank" rel="noopener" className="hover:text-primary-700">Facebook ↗</a>
              <a href="https://tiktok.com/@digitalsolution2079" target="_blank" rel="noopener" className="hover:text-primary-700">TikTok ↗</a>
              <a href="https://rabinpaudel.com" target="_blank" rel="noopener" className="hover:text-primary-700">rabinpaudel.com ↗</a>
            </div>
            <Link
              href="/donate"
              className="mt-5 inline-block rounded-full bg-action-500 px-4 py-2 text-xs font-semibold text-white hover:bg-action-600"
            >
              ♥ {locale === "en" ? "Support us" : "सहयोग गर्नुहोस्"}
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-ink-200 pt-6">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()}{" "}
            <a href="https://digitalsolutionnepal.com" target="_blank" rel="noopener" className="hover:text-primary-700">
              Digital Solution
            </a>{" "}
            · SSF Guide Nepal · +977 9705433699
          </p>
        </div>
      </div>
    </footer>
  );
}
