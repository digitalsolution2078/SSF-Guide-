import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sectors, sectorBySlug } from "@/content/sectors";
import { sectorIcon } from "@/content/icon-map";
import { articles } from "@/content/articles";
import { faqs } from "@/content/faqs";
import { SectorExplorer } from "@/components/sector-explorer";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";
import { Icon } from "@/components/icons";
import { PageHero, SectionHead } from "@/components/ui";

export function generateStaticParams() {
  return sectors.map((s) => ({ sector: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; sector: string }>;
}): Promise<Metadata> {
  const { locale, sector } = await params;
  const s = sectorBySlug(sector);
  if (!s) return pageSeo({ locale, path: `/sector/${sector}` });
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: `/sector/${sector}`,
    title: isEn
      ? `${s.titleEn} — SSF contribution, breakdown & guide`
      : `${s.titleNe} — SSF योगदान, breakdown र guide`,
    description: isEn ? s.taglineEn : s.taglineNe,
  });
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ locale: string; sector: string }>;
}) {
  const { locale, sector } = await params;
  const s = sectorBySlug(sector);
  if (!s) notFound();
  const isEn = locale === "en";

  const inSector = (cats: readonly string[]) =>
    cats.some((c) => s.userCategories.includes(c as never));

  const guides = articles.filter((a) => inSector(a.userCategories)).slice(0, 6);
  const sectorFaqs = faqs.filter((f) => inSector(f.userCategories)).slice(0, 6);

  return (
    <div>
      <PageHero
        icon={sectorIcon(s.key)}
        eyebrow={isEn ? "By sector" : "क्षेत्र अनुसार"}
        title={isEn ? s.titleEn : s.titleNe}
        lead={isEn ? s.taglineEn : s.taglineNe}
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: isEn ? "Sectors" : "सेक्टरहरू", href: "/sector" },
          { label: isEn ? s.titleEn : s.titleNe },
        ]}
      >
        {/* sector switcher */}
        <div className="flex flex-wrap gap-2">
          {sectors.map((o) => (
            <Link
              key={o.slug}
              href={`/sector/${o.slug}`}
              className={`chip ${o.slug === s.slug ? "chip-active" : ""}`}
            >
              <Icon name={sectorIcon(o.key)} size={14} className={o.slug === s.slug ? "text-white/80" : "text-ink-400"} />
              {isEn ? o.titleEn : o.titleNe}
            </Link>
          ))}
        </div>
      </PageHero>

      {/* the interactive breakdown */}
      <section className="container-page py-10">
        <SectorExplorer
          sector={s.key}
          defaultBase={s.defaultBase}
          baseLabelNe={s.baseLabelNe}
          baseLabelEn={s.baseLabelEn}
        />

        {/* quick actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={s.calculatorHref} className="btn-primary">
            <Icon name="calculator" size={16} />
            {isEn ? "Full calculator" : "पूरा calculator"}
          </Link>
          <Link href={s.registrationHref} className="btn-outline">
            <Icon name="file" size={16} />
            {isEn ? "Registration help" : "सूचीकरण सहायता"}
          </Link>
          <Link href="/eligibility" className="btn-outline">
            <Icon name="checkCircle" size={16} />
            {isEn ? "Check eligibility" : "योग्यता जाँच्नुहोस्"}
          </Link>
        </div>
      </section>

      {/* relevant guides */}
      {guides.length > 0 && (
        <section className="border-t border-ink-200 bg-ink-50">
          <div className="container-page py-14">
            <SectionHead
              eyebrow={isEn ? "Learn" : "सिकाइ"}
              title={isEn ? "Guides for you" : "तपाईंका लागि guides"}
              href="/school"
              linkLabel={isEn ? "All topics" : "सबै विषय"}
            />
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((a) => {
                const useEn = isEn && Boolean(a.en);
                return (
                  <Link
                    key={a.slug}
                    href={`/school/${a.categorySlug}/${a.slug}`}
                    className="card card-hover group flex flex-col p-5"
                  >
                    <p className="font-semibold leading-snug text-ink-900 group-hover:text-primary-700">
                      {useEn && a.en ? a.en.title : a.title}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-500">
                      {useEn && a.en ? a.en.shortAnswer : a.shortAnswer}
                    </p>
                    <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-primary-700">
                      {isEn ? "Read" : "पढ्नुहोस्"} <Icon name="arrowRight" size={14} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* relevant FAQs */}
      {sectorFaqs.length > 0 && (
        <section className="border-t border-ink-200">
          <div className="container-page py-14">
            <SectionHead
              eyebrow={isEn ? "FAQ" : "प्रश्नोत्तर"}
              title={isEn ? "Common questions" : "धेरै सोधिने प्रश्न"}
              href="/faq"
              linkLabel={isEn ? "All questions" : "सबै प्रश्न"}
            />
            <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {sectorFaqs.map((f) => (
                <li key={f.slug}>
                  <Link
                    href={`/faq/${f.slug}`}
                    className="card card-hover group flex items-start gap-3 px-4 py-3.5 text-sm text-ink-800"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 font-display text-xs font-bold text-primary-700">?</span>
                    <span className="group-hover:text-ink-900">{isEn && f.en ? f.en.question : f.question}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
