import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sectors, sectorBySlug } from "@/content/sectors";
import { articles } from "@/content/articles";
import { faqs } from "@/content/faqs";
import { SectorExplorer } from "@/components/sector-explorer";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";

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
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="text-sm text-gray-500">
        <Link href="/sector" className="hover:text-primary-600">
          {isEn ? "Sectors" : "सेक्टरहरू"}
        </Link>{" "}
        / {isEn ? s.titleEn : s.titleNe}
      </nav>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-4xl">{s.icon}</span>
        <div>
          <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
            {isEn ? s.titleEn : s.titleNe}
          </h1>
          <p className="text-sm text-gray-600">
            {isEn ? s.taglineEn : s.taglineNe}
          </p>
        </div>
      </div>

      {/* sector switcher */}
      <div className="mt-5 flex flex-wrap gap-2">
        {sectors.map((o) => (
          <Link
            key={o.slug}
            href={`/sector/${o.slug}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
              o.slug === s.slug
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-primary-200 text-primary-800 hover:bg-primary-50"
            }`}
          >
            {o.icon} {isEn ? o.titleEn : o.titleNe}
          </Link>
        ))}
      </div>

      {/* the interactive breakdown */}
      <div className="mt-6">
        <SectorExplorer
          sector={s.key}
          defaultBase={s.defaultBase}
          baseLabelNe={s.baseLabelNe}
          baseLabelEn={s.baseLabelEn}
        />
      </div>

      {/* quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href={s.calculatorHref}
          className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
        >
          🧮 {isEn ? "Full calculator" : "पूरा calculator"}
        </Link>
        <Link
          href={s.registrationHref}
          className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
        >
          📝 {isEn ? "Registration help" : "सूचीकरण सहायता"}
        </Link>
        <Link
          href="/eligibility"
          className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
        >
          ✅ {isEn ? "Check eligibility" : "योग्यता जाँच्नुहोस्"}
        </Link>
      </div>

      {/* relevant guides */}
      {guides.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-primary-900">
            📖 {isEn ? "Guides for you" : "तपाईंका लागि guides"}
          </h2>
          <div className="mt-3 space-y-3">
            {guides.map((a) => {
              const useEn = isEn && Boolean(a.en);
              return (
                <Link
                  key={a.slug}
                  href={`/school/${a.categorySlug}/${a.slug}`}
                  className="block rounded-xl border border-primary-100 bg-white p-4 shadow-sm transition hover:border-primary-400"
                >
                  <p className="font-semibold text-primary-900">
                    {useEn && a.en ? a.en.title : a.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {useEn && a.en ? a.en.shortAnswer : a.shortAnswer}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* relevant FAQs */}
      {sectorFaqs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-primary-900">
            ❓ {isEn ? "Common questions" : "धेरै सोधिने प्रश्न"}
          </h2>
          <ul className="mt-3 space-y-2">
            {sectorFaqs.map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/faq/${f.slug}`}
                  className="block rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm text-gray-800 hover:border-primary-400"
                >
                  {isEn && f.en ? f.en.question : f.question}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
