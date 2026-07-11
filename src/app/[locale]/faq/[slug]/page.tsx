import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { faqs, faqBySlug } from "@/content/faqs";
import { articleBySlug } from "@/content/articles";
import { videoById } from "@/content/videos";
import { ContentBlocks } from "@/components/content-blocks";
import { SourceBlock, VerificationBadge } from "@/components/verification-badge";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return faqs.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const faq = faqBySlug(slug);
  if (!faq) return {};
  return { title: faq.question };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const faq = faqBySlug(slug);
  if (!faq) notFound();

  const related = faq.relatedArticleSlug
    ? articleBySlug(faq.relatedArticleSlug)
    : undefined;
  const faqVideos = (faq.videoIds ?? [])
    .map((id) => videoById(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
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

      <div className="mt-6 rounded-xl border border-primary-100 bg-white p-5 shadow-sm">
        <ContentBlocks blocks={faq.answerBlocks} />
      </div>

      {related && (
        <Link
          href={`/school/${related.categorySlug}/${related.slug}`}
          className="mt-6 block rounded-xl border-2 border-primary-200 bg-primary-50 p-4 text-sm font-semibold text-primary-800 hover:border-primary-400"
        >
          📖 विस्तृत guide: {related.title} →
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
        यसमा सहायता चाहिन्छ? Digital Solution लाई सम्पर्क गर्नुहोस् →
      </Link>
    </div>
  );
}
