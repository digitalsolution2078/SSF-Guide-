import type { Metadata } from "next";
import { categories } from "@/content/categories";
import { articlesByCategory } from "@/content/articles";
import { videosByCategory } from "@/content/videos";
import { categoryIcon } from "@/content/icon-map";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/school",
    title: isEn ? "SSF School — learn everything about SSF" : "SSF School — सिक्ने ठाउँ",
    description: isEn
      ? "Verified, sourced guides, videos and FAQs on 8 Social Security Fund (SSF) topics — from an introduction to SSF all the way to claims."
      : "सामाजिक सुरक्षा कोष (SSF) का ८ विषयमा स्रोतसहित प्रमाणित guides, भिडियो र FAQ — SSF परिचयदेखि claims सम्म।",
  });
}

export default async function SchoolIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div>
      <PageHero
        icon="school"
        eyebrow={isEn ? "Learn" : "सिकाइ"}
        title="SSF School"
        lead={
          isEn
            ? "Pick a category — each topic has source-verified guides, videos, and FAQs."
            : "Category रोज्नुहोस् — प्रत्येक विषयमा स्रोतसहित प्रमाणित guide, भिडियो र FAQ छन्।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: "SSF School" }]}
      />

      <section className="container-page py-12 md:py-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => {
            const articleCount = articlesByCategory(c.slug).length;
            const videoCount = videosByCategory(c.slug).length;
            return (
              <Link key={c.slug} href={`/school/${c.slug}`} className="card card-hover group flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="icon-tile">
                    <Icon name={categoryIcon(c.slug)} size={20} />
                  </span>
                  <Icon
                    name="arrowRight"
                    size={18}
                    className="mt-2 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600"
                  />
                </div>
                <p className="mt-4 font-semibold leading-snug text-ink-900 group-hover:text-primary-700">
                  {isEn ? c.titleEn : c.titleNe}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  {isEn ? c.descriptionEn : c.description}
                </p>
                <p className="mt-auto pt-4 text-xs text-ink-400">
                  {articleCount > 0 &&
                    `${articleCount} ${isEn ? "guides" : "guide"}`}
                  {articleCount > 0 && videoCount > 0 && " · "}
                  {videoCount > 0 &&
                    `${videoCount} ${isEn ? "videos" : "भिडियो"}`}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
