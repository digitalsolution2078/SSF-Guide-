import type { Metadata } from "next";
import { faqs } from "@/content/faqs";
import { categories } from "@/content/categories";
import { categoryIcon } from "@/content/icon-map";
import { getPublishedDbFaqs } from "@/lib/db-faqs";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/faq",
    title: isEn ? "SSF FAQ — frequently asked questions" : "SSF FAQ — धेरै सोधिने प्रश्नहरू",
    description: isEn
      ? "Where does the 31% go? What happens after leaving a job? When is the pension paid? — sourced answers to common SSF questions."
      : "३१% कहाँ जान्छ? जागिर छाडेपछि के हुन्छ? Pension कहिले? — SSF सम्बन्धी प्रश्नका स्रोतसहितका उत्तर।",
  });
}

function QuestionRow({ href, question, popular, isEn }: { href: string; question: string; popular?: boolean; isEn: boolean }) {
  return (
    <li>
      <Link href={href} className="card card-hover group flex items-start gap-3 px-4 py-3.5 text-sm text-ink-800">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 font-display text-xs font-bold text-primary-700">
          ?
        </span>
        <span className="min-w-0 flex-1 group-hover:text-ink-900">
          {question}
          {popular && (
            <span className="badge-action ml-2 align-middle">{isEn ? "Popular" : "लोकप्रिय"}</span>
          )}
        </span>
        <Icon name="chevronRight" size={16} className="mt-0.5 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
      </Link>
    </li>
  );
}

export default async function FaqIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const dbFaqs = await getPublishedDbFaqs();
  return (
    <div>
      <PageHero
        icon="help"
        eyebrow="FAQ"
        title={isEn ? "Frequently Asked Questions (FAQ)" : "धेरै सोधिने प्रश्नहरू (FAQ)"}
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: "FAQ" }]}
      />

      <div className="container-page py-12 md:py-14">
        <div className="space-y-12">
          {categories.map((c) => {
            const categoryFaqs = faqs.filter((f) => f.categorySlug === c.slug);
            if (categoryFaqs.length === 0) return null;
            return (
              <section key={c.slug}>
                <div className="flex items-center gap-3">
                  <span className="icon-tile h-10 w-10">
                    <Icon name={categoryIcon(c.slug)} size={18} />
                  </span>
                  <h2 className="text-xl md:text-2xl">{isEn ? c.titleEn : c.titleNe}</h2>
                </div>
                <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {categoryFaqs.map((f) => (
                    <QuestionRow
                      key={f.slug}
                      href={`/faq/${f.slug}`}
                      question={isEn && f.en ? f.en.question : f.question}
                      popular={f.popular}
                      isEn={isEn}
                    />
                  ))}
                </ul>
              </section>
            );
          })}

          {dbFaqs.length > 0 && (
            <section>
              <div className="flex items-center gap-3">
                <span className="icon-tile h-10 w-10">
                  <Icon name="chat" size={18} />
                </span>
                <h2 className="text-xl md:text-2xl">{isEn ? "More questions" : "थप प्रश्नहरू"}</h2>
              </div>
              <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {dbFaqs.map((f) => (
                  <QuestionRow key={f.id} href={`/faq/${f.slug}`} question={f.question} popular={f.popular} isEn={isEn} />
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="surface mt-12 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div className="flex items-start gap-3">
            <span className="icon-tile">
              <Icon name="chat" size={20} />
            </span>
            <div>
              <p className="font-semibold text-ink-900">{isEn ? "Didn't find your answer?" : "प्रश्नको उत्तर भेटिएन?"}</p>
              <p className="mt-0.5 text-sm text-ink-500">
                {isEn
                  ? "Ask the SSF AI or get help from Digital Solution."
                  : "SSF AI लाई सोध्नुहोस् वा Digital Solution बाट सहायता लिनुहोस्।"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <Link href="/ask" className="btn-outline">
              {isEn ? "Ask the SSF AI" : "SSF AI लाई सोध्नुहोस्"}
            </Link>
            <Link href="/request" className="btn-accent">
              {isEn ? "Get help from Digital Solution" : "Digital Solution बाट सहायता लिनुहोस्"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
