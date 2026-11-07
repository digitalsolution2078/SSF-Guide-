import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, articleBySlug } from "@/content/articles";
import { articleHighlights } from "@/content/article-highlights";
import { categoryBySlug } from "@/content/categories";
import { faqs } from "@/content/faqs";
import { videoById } from "@/content/videos";
import { ContentBlocks } from "@/components/content-blocks";
import { SourceBlock, VerificationBadge } from "@/components/verification-badge";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Icon } from "@/components/icons";
import { Breadcrumbs, Callout } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";

const SECTION_LABELS: Record<string, string> = {
  MAIN: "",
  EXAMPLE: "उदाहरण",
  ELIGIBILITY: "योग्यता",
  DOCUMENTS: "आवश्यक कागजात",
  STEPS: "प्रक्रिया",
  MISTAKES: "सामान्य गल्ती",
  CAUTION: "सावधानी",
};

const SECTION_LABELS_EN: Record<string, string> = {
  MAIN: "",
  EXAMPLE: "Example",
  ELIGIBILITY: "Eligibility",
  DOCUMENTS: "Required documents",
  STEPS: "Process",
  MISTAKES: "Common mistakes",
  CAUTION: "Caution",
};

export function generateStaticParams() {
  return articles.map((a) => ({ category: a.categorySlug, slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return pageSeo({ locale, path: `/school/${category}/${slug}` });
  const useEn = locale === "en" && Boolean(article.en);
  const title = useEn && article.en ? article.en.title : article.title;
  const shortAnswer = useEn && article.en ? article.en.shortAnswer : article.shortAnswer;
  return pageSeo({
    locale,
    path: `/school/${article.categorySlug}/${article.slug}`,
    title,
    description: shortAnswer.slice(0, 155),
    type: "article",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  const base = articleBySlug(slug);
  if (!base || base.categorySlug !== category) notFound();
  const useEn = locale === "en" && Boolean(base.en);
  const article = useEn && base.en
    ? { ...base, title: base.en.title, shortAnswer: base.en.shortAnswer, sections: base.en.sections }
    : base;
  const cat = categoryBySlug(category)!;
  const hl = articleHighlights[slug];
  const highlights = hl ? (locale === "en" ? hl.en : hl.ne) : null;
  const relatedFaqs = faqs.filter((f) => f.relatedArticleSlug === slug);
  const articleVideos = article.videoIds
    .map((id) => videoById(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const BASE = "https://ssf.digitalsolutionnepal.com";
  const prefix = locale === "en" ? "/en" : "";
  const url = `${BASE}${prefix}/school/${category}/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "SSF School", item: `${BASE}${prefix}/school` },
          {
            "@type": "ListItem",
            position: 2,
            name: locale === "en" ? cat.titleEn : cat.titleNe,
            item: `${BASE}${prefix}/school/${category}`,
          },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
      {
        "@type": "Article",
        headline: article.title,
        description: article.shortAnswer,
        inLanguage: locale,
        datePublished: article.lastVerified,
        dateModified: article.lastVerified,
        author: { "@type": "Organization", name: "Digital Solution" },
        publisher: {
          "@type": "Organization",
          name: "Digital Solution",
          url: "https://digitalsolutionnepal.com",
        },
        mainEntityOfPage: url,
      },
    ],
  };

  const labels = useEn ? SECTION_LABELS_EN : SECTION_LABELS;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ───────── Article header ───────── */}
      <header className="border-b border-ink-200 bg-gradient-to-b from-ink-50 to-white">
        <div className="container-narrow pb-10 pt-8 md:pt-10">
          <Breadcrumbs
            items={[
              { label: useEn ? "Home" : "गृहपृष्ठ", href: "/" },
              { label: "SSF School", href: "/school" },
              { label: locale === "en" ? cat.titleEn : cat.titleNe, href: `/school/${category}` },
            ]}
          />
          <span className="eyebrow mt-6">{locale === "en" ? cat.titleEn : cat.titleNe}</span>
          <h1 className="mt-2 text-3xl md:text-[2.5rem]">{article.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <VerificationBadge lastVerified={article.lastVerified} />
            <span className="inline-flex items-center gap-1.5 text-sm text-ink-500">
              <Icon name="clock" size={14} className="text-ink-400" />
              {useEn
                ? `Reading time: ${article.readingMinutes} min`
                : `पढ्न लाग्ने समय: ${article.readingMinutes} मिनेट`}
            </span>
          </div>
        </div>
      </header>

      <article className="container-narrow py-10 md:py-12">
        {locale === "en" && !base.en && (
          <div className="mb-6">
            <Callout tone="info">
              This guide is currently in Nepali — English translation coming soon.
            </Callout>
          </div>
        )}

        {/* छोटो उत्तर — answer-first block */}
        <div className="surface p-5 md:p-6">
          <p className="eyebrow">{useEn ? "Short answer" : "छोटो उत्तर"}</p>
          <p className="mt-2 text-lg font-medium leading-relaxed text-ink-900">
            {article.shortAnswer}
          </p>
        </div>

        {/* Highlights — big, scannable key points for readers in a hurry */}
        {highlights && highlights.length > 0 && (
          <div className="card mt-5 p-5 md:p-6">
            <p className="eyebrow text-action-600">
              <Icon name="sparkles" size={14} />
              {useEn ? "Highlights" : "मुख्य बुँदाहरू"}
            </p>
            <ul className="mt-3 space-y-3">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                    <Icon name="check" size={14} />
                  </span>
                  <span className="text-base font-medium leading-relaxed text-ink-800">
                    {h}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Table of contents */}
        <nav aria-label={useEn ? "Table of contents" : "विषयसूची"} className="mt-5 rounded-2xl border border-ink-200 p-4 text-sm md:p-5">
          <p className="flex items-center gap-2 font-semibold text-ink-900">
            <Icon name="list" size={16} className="text-primary-600" />
            {useEn ? "Table of contents" : "विषयसूची"}
          </p>
          <ol className="mt-2 space-y-1.5 text-ink-600">
            {article.sections.map((s, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="w-5 shrink-0 text-right font-display text-xs font-bold text-ink-400">{i + 1}</span>
                <span>{s.heading}</span>
              </li>
            ))}
          </ol>
        </nav>

        {/* Body */}
        <div className="mt-10 space-y-10">
          {article.sections.map((section, i) => (
            <section key={i}>
              {labels[section.kind] && (
                <span className="eyebrow">{labels[section.kind]}</span>
              )}
              <h2 className={`${labels[section.kind] ? "mt-1.5" : ""} text-2xl`}>{section.heading}</h2>
              <div className="mt-4">
                <ContentBlocks blocks={section.blocks} />
              </div>
            </section>
          ))}
        </div>

        {articleVideos.length > 0 && (
          <section className="mt-12 border-t border-ink-200 pt-10">
            <h2 className="text-2xl">{useEn ? "Related videos" : "सम्बन्धित भिडियो"}</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {articleVideos.map((v) => (
                <YouTubeEmbed key={v.youtubeId} id={v.youtubeId} title={v.title} />
              ))}
            </div>
          </section>
        )}

        {relatedFaqs.length > 0 && (
          <section className="mt-12 border-t border-ink-200 pt-10">
            <h2 className="text-2xl">{useEn ? "Related FAQs" : "सम्बन्धित FAQ"}</h2>
            <ul className="mt-5 space-y-3">
              {relatedFaqs.map((f) => (
                <li key={f.slug}>
                  <Link
                    href={`/faq/${f.slug}`}
                    className="card card-hover group flex items-start gap-3 px-4 py-3.5 text-sm text-ink-800"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 font-display text-xs font-bold text-primary-700">
                      ?
                    </span>
                    <span className="flex-1 group-hover:text-ink-900">{useEn && f.en ? f.en.question : f.question}</span>
                    <Icon name="chevronRight" size={16} className="mt-0.5 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTAs */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {article.relatedCalculatorHref && (
            <Link
              href={article.relatedCalculatorHref}
              className="card card-hover group flex items-center gap-3.5 p-4"
            >
              <span className="icon-tile">
                <Icon name="calculator" size={20} />
              </span>
              <span className="flex-1 text-sm font-semibold text-ink-900 group-hover:text-primary-700">
                {useEn ? "Use the related calculator" : "सम्बन्धित Calculator प्रयोग गर्नुहोस्"}
              </span>
              <Icon name="arrowRight" size={16} className="text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
            </Link>
          )}
          <Link
            href={article.relatedServiceHref ?? "/request"}
            className="group flex items-center gap-3.5 rounded-2xl bg-action-500 p-4 text-white shadow-sm transition hover:bg-action-600"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Icon name="chat" size={20} />
            </span>
            <span className="flex-1 text-sm font-semibold">
              {useEn ? "Get help from Digital Solution" : "Digital Solution बाट सहायता लिनुहोस्"}
            </span>
            <Icon name="arrowRight" size={16} className="text-white/70 transition group-hover:translate-x-0.5 group-hover:text-white" />
          </Link>
        </div>

        <div className="mt-10">
          <SourceBlock sourceKeys={article.sourceKeys} />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink-400">
          {useEn ? (
            <>
              This content is for educational purposes; final approval and benefits
              follow official SSF rules. Found outdated information?{" "}
              <Link href="/report-correction" className="underline hover:text-primary-700">
                Report it here
              </Link>
              .
            </>
          ) : (
            <>
              यो सामग्री शैक्षिक प्रयोजनका लागि हो; अन्तिम स्वीकृति र सुविधा आधिकारिक SSF
              नियमबमोजिम हुन्छ। पुरानो जानकारी भेटिए{" "}
              <Link href="/report-correction" className="underline hover:text-primary-700">
                यहाँ रिपोर्ट गर्नुहोस्
              </Link>
              ।
            </>
          )}
        </p>
      </article>
    </div>
  );
}
