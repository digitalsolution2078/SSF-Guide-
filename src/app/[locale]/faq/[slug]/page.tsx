import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { faqs, faqBySlug } from "@/content/faqs";
import { articleBySlug } from "@/content/articles";
import { videoById } from "@/content/videos";
import { ContentBlocks } from "@/components/content-blocks";
import { SourceBlock, VerificationBadge } from "@/components/verification-badge";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { RichText } from "@/components/rich-text";
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
      <div className="mx-auto max-w-3xl px-4 py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <nav className="text-sm text-gray-500">
          <Link href="/faq" className="hover:text-primary-600">
            FAQ
          </Link>
        </nav>
        <h1 className="mt-2 text-2xl font-bold leading-snug text-primary-900">
          {dbFaq.question}
        </h1>
        <div className="mt-6 rounded-xl border border-primary-100 bg-white p-5 shadow-sm">
          <RichText text={dbFaq.answerRichText} />
        </div>
        <Link
          href="/request"
          className="mt-6 block rounded-xl bg-action-500 p-4 text-center text-sm font-semibold text-white hover:bg-action-600"
        >
          {locale === "en"
            ? "Need help with this? Contact Digital Solution →"
            : "यसमा सहायता चाहिन्छ? Digital Solution लाई सम्पर्क गर्नुहोस् →"}
        </Link>
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-gray-500">
        <Link href="/faq" className="hover:text-primary-600">
          FAQ
        </Link>
      </nav>
      <h1 className="mt-2 text-2xl font-bold leading-snug text-primary-900">
        {faq.question}
      </h1>
      <div className="mt-3">
        <VerificationBadge lastVerified={faq.lastVerified} />
      </div>

      {locale === "en" && !base.en && (
        <p className="mt-4 rounded-lg bg-primary-50 px-4 py-2 text-sm text-gray-600">
          🌐 This answer is currently in Nepali — English translation coming soon.
        </p>
      )}

      <div className="mt-6 rounded-xl border border-primary-100 bg-white p-5 shadow-sm">
        <ContentBlocks blocks={faq.answerBlocks} />
      </div>

      {related && (
        <Link
          href={`/school/${related.categorySlug}/${related.slug}`}
          className="mt-6 block rounded-xl border-2 border-primary-200 bg-primary-50 p-4 text-sm font-semibold text-primary-800 hover:border-primary-400"
        >
          📖 {useEn ? "Detailed guide" : "विस्तृत guide"}:{" "}
          {useEn && related.en ? related.en.title : related.title} →
        </Link>
      )}

      {faqVideos.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {faqVideos.map((v) => (
            <YouTubeEmbed key={v.youtubeId} id={v.youtubeId} title={v.title} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <SourceBlock sourceKeys={faq.sourceKeys} />
      </div>

      <Link
        href="/request"
        className="mt-6 block rounded-xl bg-action-500 p-4 text-center text-sm font-semibold text-white hover:bg-action-600"
      >
        {useEn
          ? "Need help with this? Contact Digital Solution →"
          : "यसमा सहायता चाहिन्छ? Digital Solution लाई सम्पर्क गर्नुहोस् →"}
      </Link>
    </div>
  );
}
