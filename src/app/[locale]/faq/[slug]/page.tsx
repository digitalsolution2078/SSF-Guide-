import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { faqs, faqBySlug } from "@/content/faqs";
import { articleBySlug } from "@/content/articles";
import { videoById } from "@/content/videos";
import { ContentBlocks } from "@/components/content-blocks";
import { SourceBlock, VerificationBadge } from "@/components/verification-badge";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { RichText } from "@/components/rich-text";
import { Icon } from "@/components/icons";
import { Breadcrumbs, Callout } from "@/components/ui";
import { getPublishedDbFaqBySlug } from "@/lib/db-faqs";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";

export function generateStaticParams() {
  return faqs.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const faq = faqBySlug(slug);
  const isEn = locale === "en";
  if (!faq) {
    const dbFaq = await getPublishedDbFaqBySlug(slug).catch(() => null);
    return pageSeo({
      locale,
      path: `/faq/${slug}`,
      title: dbFaq?.question,
      description: dbFaq?.answerRichText?.replace(/[#*_>`-]/g, "").trim().slice(0, 155),
    });
  }
  const question = isEn && faq.en ? faq.en.question : faq.question;
  const blocks = isEn && faq.en ? faq.en.answerBlocks : faq.answerBlocks;
  const firstText = blocks.find((b) => b.type === "p")?.text;
  return pageSeo({
    locale,
    path: `/faq/${slug}`,
    title: question,
    description: firstText ? firstText.slice(0, 155) : undefined,
  });
}

function FaqHeader({ locale, question, children }: { locale: string; question: string; children?: React.ReactNode }) {
  const isEn = locale === "en";
  return (
    <header className="border-b border-ink-200 bg-gradient-to-b from-ink-50 to-white">
      <div className="container-narrow pb-10 pt-8 md:pt-10">
        <Breadcrumbs items={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: "FAQ", href: "/faq" }]} />
        <span className="eyebrow mt-6">FAQ</span>
        <h1 className="mt-2 text-3xl md:text-[2.5rem]">{question}</h1>
        {children && <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>}
      </div>
    </header>
  );
}

function HelpCta({ locale }: { locale: string }) {
  const isEn = locale === "en";
  return (
    <Link
      href="/request"
      className="group mt-8 flex items-center gap-3.5 rounded-2xl bg-action-500 p-4 text-white shadow-sm transition hover:bg-action-600"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <Icon name="chat" size={20} />
      </span>
      <span className="flex-1 text-sm font-semibold">
        {isEn
          ? "Need help with this? Contact Digital Solution"
          : "यसमा सहायता चाहिन्छ? Digital Solution लाई सम्पर्क गर्नुहोस्"}
      </span>
      <Icon name="arrowRight" size={16} className="text-white/70 transition group-hover:translate-x-0.5 group-hover:text-white" />
    </Link>
  );
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const base = faqBySlug(slug);
  if (!base) {
    // Admin-authored FAQ from the database (edited via /admin/content)
    const dbFaq = await getPublishedDbFaqBySlug(slug);
    if (!dbFaq) notFound();
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: [
        {
          "@type": "Question",
          name: dbFaq.question,
          acceptedAnswer: { "@type": "Answer", text: dbFaq.answerRichText },
        },
      ],
    };
    return (
      <div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <FaqHeader locale={locale} question={dbFaq.question} />
        <article className="container-narrow py-10 md:py-12">
          <div className="card p-5 md:p-6">
            <RichText text={dbFaq.answerRichText} />
          </div>
          <HelpCta locale={locale} />
        </article>
      </div>
    );
  }
  const useEn = locale === "en" && Boolean(base.en);
  const faq = useEn && base.en
    ? { ...base, question: base.en.question, answerBlocks: base.en.answerBlocks }
    : base;

  const related = faq.relatedArticleSlug
    ? articleBySlug(faq.relatedArticleSlug)
    : undefined;
  const faqVideos = (faq.videoIds ?? [])
    .map((id) => videoById(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const answerText = faq.answerBlocks
    .map((b) => {
      if (b.type === "p" || b.type === "note") return b.text;
      if (b.type === "list" || b.type === "steps") return b.items.join(" ");
      if (b.type === "table") return b.rows.map((r) => r.join(" ")).join(" ");
      return "";
    })
    .join(" ")
    .trim();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: [
      {
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: answerText },
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqHeader locale={locale} question={faq.question}>
        <VerificationBadge lastVerified={faq.lastVerified} />
      </FaqHeader>

      <article className="container-narrow py-10 md:py-12">
        {locale === "en" && !base.en && (
          <div className="mb-6">
            <Callout tone="info">
              This answer is currently in Nepali — English translation coming soon.
            </Callout>
          </div>
        )}

        <div className="card p-5 md:p-6">
          <ContentBlocks blocks={faq.answerBlocks} />
        </div>

        {related && (
          <Link
            href={`/school/${related.categorySlug}/${related.slug}`}
            className="card card-hover group mt-5 flex items-center gap-3.5 p-4"
          >
            <span className="icon-tile">
              <Icon name="book" size={20} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-ink-500">{useEn ? "Detailed guide" : "विस्तृत guide"}</span>
              <span className="block font-semibold text-ink-900 group-hover:text-primary-700">
                {useEn && related.en ? related.en.title : related.title}
              </span>
            </span>
            <Icon name="arrowRight" size={16} className="shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
          </Link>
        )}

        {faqVideos.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {faqVideos.map((v) => (
              <YouTubeEmbed key={v.youtubeId} id={v.youtubeId} title={v.title} />
            ))}
          </div>
        )}

        <div className="mt-8">
          <SourceBlock sourceKeys={faq.sourceKeys} />
        </div>

        <HelpCta locale={locale} />
      </article>
    </div>
  );
}
