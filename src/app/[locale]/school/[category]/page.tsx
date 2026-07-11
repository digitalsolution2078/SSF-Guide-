import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, categoryBySlug } from "@/content/categories";
import { articlesByCategory } from "@/content/articles";
import { videosByCategory } from "@/content/videos";
import { faqs } from "@/content/faqs";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { VerificationBadge } from "@/components/verification-badge";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const info = categoryBySlug(category);
  if (!info) return {};
  return { title: `${info.titleNe} | SSF School`, description: info.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const info = categoryBySlug(category);
  if (!info) notFound();

  const categoryArticles = articlesByCategory(category);
  const categoryVideos = videosByCategory(category);
  const categoryFaqs = faqs.filter((f) => f.categorySlug === category);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="text-sm text-gray-500">
        <Link href="/school" className="hover:text-primary-600">
          SSF School
        </Link>{" "}
        / {info.titleNe}
      </nav>
      <h1 className="mt-2 text-2xl font-bold text-primary-900 md:text-3xl">
        {info.icon} {info.titleNe}
      </h1>
      <p className="mt-2 text-gray-600">{info.description}</p>

      {categoryArticles.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-primary-900">Guides</h2>
          <div className="mt-3 space-y-3">
            {categoryArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/school/${category}/${a.slug}`}
                className="block rounded-xl border border-primary-100 bg-white p-5 shadow-sm transition hover:border-primary-400"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {a.isCornerstone && (
                    <span className="rounded bg-action-50 px-2 py-0.5 text-xs font-medium text-action-700">
                      ⭐ Cornerstone
                    </span>
                  )}
                  <VerificationBadge lastVerified={a.lastVerified} />
                  <span className="text-xs text-gray-400">
                    {a.readingMinutes} मिनेट
                  </span>
                </div>
                <p className="mt-2 font-semibold text-primary-900">{a.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {a.shortAnswer}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categoryFaqs.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-primary-900">FAQ</h2>
          <ul className="mt-3 space-y-2">
            {categoryFaqs.map((f) => (
              <li key={f.slug}>
                <Link
                  href={`/faq/${f.slug}`}
                  className="block rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm text-gray-800 hover:border-primary-400"
                >
                  ❓ {f.question}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {categoryVideos.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-primary-900">📺 भिडियोहरू</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {categoryVideos.map((v) => (
              <YouTubeEmbed key={v.youtubeId} id={v.youtubeId} title={v.title} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
