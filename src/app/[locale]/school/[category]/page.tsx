import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, categoryBySlug } from "@/content/categories";
import { articlesByCategory } from "@/content/articles";
import { videosByCategory } from "@/content/videos";
import { faqs } from "@/content/faqs";
import { categoryIcon } from "@/content/icon-map";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { VerificationBadge } from "@/components/verification-badge";
import { Icon } from "@/components/icons";
import { PageHero, SectionHead } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const info = categoryBySlug(category);
  if (!info) return pageSeo({ locale, path: `/school/${category}` });
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: `/school/${category}`,
    title: `${isEn && info.titleEn ? info.titleEn : info.titleNe} | SSF School`,
    description: isEn && info.descriptionEn ? info.descriptionEn : info.description,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const info = categoryBySlug(category);
  if (!info) notFound();
  const isEn = locale === "en";

  const categoryArticles = articlesByCategory(category);
  const categoryVideos = videosByCategory(category);
  const categoryFaqs = faqs.filter((f) => f.categorySlug === category);

  return (
    <div>
      <PageHero
        icon={categoryIcon(category)}
        eyebrow="SSF School"
        title={isEn ? info.titleEn : info.titleNe}
        lead={isEn ? info.descriptionEn : info.description}
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "SSF School", href: "/school" },
          { label: isEn ? info.titleEn : info.titleNe },
        ]}
      />

      {categoryArticles.length > 0 && (
        <section className="container-page py-12 md:py-14">
          <SectionHead title="Guides" />
          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
            {categoryArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/school/${category}/${a.slug}`}
                className="card card-hover group flex flex-col p-5"
              >
                <div className="flex items-start gap-3.5">
                  <span className="icon-tile">
                    <Icon name="book" size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold leading-snug text-ink-900 group-hover:text-primary-700">
                        {isEn && a.en ? a.en.title : a.title}
                      </p>
                      {a.isCornerstone && (
                        <span className="badge-action">
                          <Icon name="star" size={11} />
                          Cornerstone
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
                      {isEn && a.en ? a.en.shortAnswer : a.shortAnswer}
                    </p>
                  </div>
                  <Icon
                    name="chevronRight"
                    size={18}
                    className="mt-1 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600"
                  />
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-3">
                  <VerificationBadge lastVerified={a.lastVerified} />
                  <span className="inline-flex items-center gap-1 text-xs text-ink-400">
                    <Icon name="clock" size={12} />
                    {a.readingMinutes} {isEn ? "min" : "मिनेट"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {categoryFaqs.length > 0 && (
        <section className="border-t border-ink-200 bg-ink-50">
          <div className="container-page py-12 md:py-14">
            <SectionHead title="FAQ" />
            <ul className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2">
              {categoryFaqs.map((f) => (
                <li key={f.slug}>
                  <Link
                    href={`/faq/${f.slug}`}
                    className="card card-hover group flex items-start gap-3 px-4 py-3.5 text-sm text-ink-800"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary-100 font-display text-xs font-bold text-primary-700">
                      ?
                    </span>
                    <span className="group-hover:text-ink-900">{isEn && f.en ? f.en.question : f.question}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {categoryVideos.length > 0 && (
        <section className="border-t border-ink-200">
          <div className="container-page py-12 md:py-14">
            <SectionHead title={isEn ? "Videos" : "भिडियोहरू"} />
            <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {categoryVideos.map((v) => (
                <YouTubeEmbed key={v.youtubeId} id={v.youtubeId} title={v.title} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
