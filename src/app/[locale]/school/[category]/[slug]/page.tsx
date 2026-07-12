import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, articleBySlug } from "@/content/articles";
import { categoryBySlug } from "@/content/categories";
import { faqs } from "@/content/faqs";
import { videoById } from "@/content/videos";
import { ContentBlocks } from "@/components/content-blocks";
import { SourceBlock, VerificationBadge } from "@/components/verification-badge";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Link } from "@/i18n/navigation";

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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.shortAnswer.slice(0, 155) };
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
  const relatedFaqs = faqs.filter((f) => f.relatedArticleSlug === slug);
  const articleVideos = article.videoIds
    .map((id) => videoById(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-sm text-gray-500">
        <Link href="/school" className="hover:text-primary-600">
          SSF School
        </Link>{" "}
        /{" "}
        <Link href={`/school/${category}`} className="hover:text-primary-600">
          {locale === "en" ? cat.titleEn : cat.titleNe}
        </Link>
      </nav>

      <h1 className="mt-3 text-2xl font-bold leading-snug text-primary-900 md:text-3xl">
        {article.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <VerificationBadge lastVerified={article.lastVerified} />
        <span className="text-xs text-gray-400">
          {useEn
            ? `Reading time: ${article.readingMinutes} min`
            : `पढ्न लाग्ने समय: ${article.readingMinutes} मिनेट`}
        </span>
      </div>

      {locale === "en" && !base.en && (
        <p className="mt-4 rounded-lg bg-primary-50 px-4 py-2 text-sm text-gray-600">
          🌐 This guide is currently in Nepali — English translation coming soon.
        </p>
      )}

      {/* छोटो उत्तर — answer-first block */}
      <div className="mt-6 rounded-xl border-2 border-primary-200 bg-primary-50 p-5">
        <p className="text-sm font-bold text-primary-800">{useEn ? "Short answer:" : "छोटो उत्तर:"}</p>
        <p className="mt-1 leading-relaxed text-gray-800">
          {article.shortAnswer}
        </p>
      </div>

      {/* Table of contents */}
      <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm">
        <p className="font-semibold text-gray-700">
          {useEn ? "Table of contents" : "विषयसूची"}
        </p>
        <ol className="mt-1 list-inside list-decimal space-y-0.5 text-gray-600">
          {article.sections.map((s, i) => (
            <li key={i}>{s.heading}</li>
          ))}
        </ol>
      </div>

      {article.sections.map((section, i) => (
        <section key={i} className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-primary-900">
            {(useEn ? SECTION_LABELS_EN : SECTION_LABELS)[section.kind] && (
              <span className="mr-2 text-sm font-medium text-action-600">
                [{(useEn ? SECTION_LABELS_EN : SECTION_LABELS)[section.kind]}]
              </span>
            )}
            {section.heading}
          </h2>
          <ContentBlocks blocks={section.blocks} />
        </section>
      ))}

      {articleVideos.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-primary-900">
            📺 {useEn ? "Related videos" : "सम्बन्धित भिडियो"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {articleVideos.map((v) => (
              <YouTubeEmbed key={v.youtubeId} id={v.youtubeId} title={v.title} />
            ))}
          </div>
        </section>
      )}

      {relatedFaqs.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-xl font-bold text-primary-900">
            {useEn ? "Related FAQs" : "सम्बन्धित FAQ"}
          </h2>
          <ul className="space-y-2">
            {relatedFaqs.map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/faq/${f.slug}`}
                  className="block rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm hover:border-primary-400"
                >
                  ❓ {useEn && f.en ? f.en.question : f.question}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {article.relatedCalculatorHref && (
          <Link
            href={article.relatedCalculatorHref}
            className="rounded-xl border-2 border-primary-200 bg-white p-4 text-sm font-semibold text-primary-800 hover:border-primary-400"
          >
            🧮 {useEn ? "Use the related calculator →" : "सम्बन्धित Calculator प्रयोग गर्नुहोस् →"}
          </Link>
        )}
        <Link
          href={article.relatedServiceHref ?? "/request"}
          className="rounded-xl bg-action-500 p-4 text-sm font-semibold text-white hover:bg-action-600"
        >
          🤝 {useEn ? "Get help from Digital Solution →" : "Digital Solution बाट सहायता लिनुहोस् →"}
        </Link>
      </div>

      <div className="mt-10">
        <SourceBlock sourceKeys={article.sourceKeys} />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        {useEn ? (
          <>
            This content is for educational purposes; final approval and benefits
            follow official SSF rules. Found outdated information?{" "}
            <Link href="/report-correction" className="underline hover:text-primary-600">
              Report it here
            </Link>
            .
          </>
        ) : (
          <>
            यो सामग्री शैक्षिक प्रयोजनका लागि हो; अन्तिम स्वीकृति र सुविधा आधिकारिक SSF
            नियमबमोजिम हुन्छ। पुरानो जानकारी भेटिए{" "}
            <Link href="/report-correction" className="underline hover:text-primary-600">
              यहाँ रिपोर्ट गर्नुहोस्
            </Link>
            ।
          </>
        )}
      </p>
    </article>
  );
}
