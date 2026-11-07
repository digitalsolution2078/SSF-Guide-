import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BrandMark, Icon } from "./icons";
import { SSF_HOTLINE, SSF_CALL_CENTER } from "@/content/ssf-offices";

export function SiteFooter() {
  const locale = useLocale();
  const isEn = locale === "en";
  const t = useTranslations("footer");
  const n = useTranslations("nav");
  const d = useTranslations("disclaimer");

  const col = "flex flex-col gap-2.5 text-sm text-ink-600";
  const link = "hover:text-primary-700";

  return (
    <footer className="mt-20 border-t border-ink-200 bg-ink-50 pb-20 md:pb-0 print:hidden">
      <div className="container-page py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand + disclaimer */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <BrandMark size={32} />
              <p className="font-display text-lg font-bold text-ink-900">SSF Guide Nepal</p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">{d("independent")}</p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-500">
              <li className="flex gap-2"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-primary-500" />{d("verified")}</li>
              <li className="flex gap-2"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-primary-500" />{d("official")}</li>
            </ul>
            <div className="mt-5 rounded-2xl border border-ink-200 bg-white p-4 text-sm">
              <p className="font-semibold text-ink-900">
                {isEn ? "Official SSF helpline" : "आधिकारिक SSF हटलाइन"}
              </p>
              <p className="mt-1 text-ink-600">
                <a href={`tel:${SSF_HOTLINE}`} className="font-bold text-primary-700">{SSF_HOTLINE}</a>{" "}
                (NTC/NCELL, {isEn ? "toll-free" : "टोल फ्री"}) ·{" "}
                <a href={`tel:${SSF_CALL_CENTER.replace(/-/g, "")}`} className={link}>{SSF_CALL_CENTER}</a>
              </p>
              <p className="mt-1 text-xs text-ink-400">
                {isEn ? "Fund's own call centre — not Digital Solution." : "कोषको आफ्नै कल सेन्टर — Digital Solution होइन।"}
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow text-ink-400">{n("learn")}</p>
            <div className={`${col} mt-4`}>
              <Link href="/school" className={link}>{n("school")}</Link>
              <Link href="/sector" className={link}>{n("sectors")}</Link>
              <Link href="/faq" className={link}>{n("faq")}</Link>
              <Link href="/blog" className={link}>{n("blog")}</Link>
              <Link href="/downloads" className={link}>{n("downloads")}</Link>
              <Link href="/sources" className={link}>{n("sources")}</Link>
            </div>
          </div>

          <div>
            <p className="eyebrow text-ink-400">{n("tools")}</p>
            <div className={`${col} mt-4`}>
              <Link href="/calculators" className={link}>{n("calculators")}</Link>
              <Link href="/rates" className={link}>{n("rates")}</Link>
              <Link href="/hospitals" className={`${link} font-semibold text-health-700`}>{n("hospitalsAll")}</Link>
              <Link href="/loans" className={`${link} font-semibold text-primary-700`}>{n("loansAll")}</Link>
              <Link href="/assessment" className={link}>{n("assessment")}</Link>
              <Link href="/eligibility" className={link}>{n("eligibility")}</Link>
              <Link href="/checklists" className={link}>{n("checklists")}</Link>
            </div>
          </div>

          <div>
            <p className="eyebrow text-ink-400">{n("servicesGroup")}</p>
            <div className={`${col} mt-4`}>
              <Link href="/services" className={link}>{n("services")}</Link>
              <Link href="/request" className={link}>{n("request")}</Link>
              <Link href="/track" className={link}>{n("track")}</Link>
              <Link href="/ask" className={link}>{n("ask")}</Link>
              <Link href="/about" className={link}>{t("about")}</Link>
              <Link href="/contact" className={link}>{t("contact")}</Link>
              <a href="https://ssf.gov.np" rel="noopener noreferrer" target="_blank" className={`${link} inline-flex items-center gap-1`}>
                {t("officialSSF")} <Icon name="arrowUpRight" size={14} />
              </a>
              <a href="https://sosys.ssf.gov.np" rel="noopener noreferrer" target="_blank" className={`${link} inline-flex items-center gap-1`}>
                SOSYS {isEn ? "login" : "लगइन"} <Icon name="arrowUpRight" size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-200 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()}{" "}
            <a href="https://digitalsolutionnepal.com" target="_blank" rel="noopener" className={link}>
              Digital Solution Pvt. Ltd.
            </a>{" "}
            · Pokhara · +977 9705433699
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-500">
            <Link href="/privacy" className={link}>{t("privacy")}</Link>
            <Link href="/terms" className={link}>{t("terms")}</Link>
            <Link href="/disclaimer" className={link}>{t("disclaimer")}</Link>
            <Link href="/report-correction" className={link}>{t("correction")}</Link>
            <Link href="/donate" className={`${link} font-semibold text-action-600`}>
              ♥ {isEn ? "Support us" : "सहयोग गर्नुहोस्"}
            </Link>
          </div>
          <div className="flex gap-3 text-xs text-ink-500">
            <a href="https://youtube.com/@rabinpaudel" target="_blank" rel="noopener" className={link}>YouTube</a>
            <a href="https://facebook.com/rabinpaudelofficial" target="_blank" rel="noopener" className={link}>Facebook</a>
            <a href="https://tiktok.com/@digitalsolution2079" target="_blank" rel="noopener" className={link}>TikTok</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
