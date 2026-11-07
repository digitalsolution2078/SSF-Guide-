import type { Metadata } from "next";
import { sortedBlogPosts } from "@/content/blog";
import { getPublishedDbBlog } from "@/lib/db-blog";
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
    path: "/blog",
    title: isEn
      ? "SSF News & Blog — latest updates, guides & calculations"
      : "SSF समाचार र Blog — पछिल्ला अपडेट, गाइड र हिसाब",
    description: isEn
      ? "Latest Social Security Fund (SSF) news, contribution & tax changes, pension calculations, comparisons and practical guides — regularly updated."
      : "सामाजिक सुरक्षा कोष (SSF) सम्बन्धी पछिल्ला समाचार, योगदान/कर परिवर्तन, पेन्सन हिसाब, तुलना र व्यावहारिक गाइड — नियमित अपडेट हुने SSF blog।",
  });
}

interface Card {
  slug: string;
  title: string;
  excerpt: string;
  emoji: string;
  category: string;
  dateISO: string;
}

function fmtDate(iso: string, isEn: boolean): string {
  const [y, m, d] = iso.split("-").map(Number);
  const ne = ["", "जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर"];
  const en = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return isEn ? `${en[m]} ${d}, ${y}` : `${d} ${ne[m]} ${y}`;
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  const fileCards: Card[] = sortedBlogPosts().map((p) => ({
    slug: p.slug,
    title: isEn && p.en ? p.en.title : p.title,
    excerpt: isEn && p.en ? p.en.excerpt : p.excerpt,
    emoji: p.emoji,
    category: p.category,
    dateISO: p.publishDate,
  }));
  const dbCards: Card[] = (await getPublishedDbBlog()).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    emoji: p.emoji,
    category: p.category,
    dateISO: p.publishedAt.toISOString().slice(0, 10),
  }));
  const posts = [...dbCards, ...fileCards].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
  const [featured, ...rest] = posts;

  return (
    <div>
      <PageHero
        icon="newspaper"
        eyebrow={isEn ? "News" : "समाचार"}
        title={isEn ? "SSF News & Blog" : "SSF समाचार र Blog"}
        lead={
          isEn
            ? "The latest on Nepal's Social Security Fund — contribution and tax changes, pension math, comparisons, and practical guides."
            : "सामाजिक सुरक्षा कोषका पछिल्ला समाचार, योगदान/कर परिवर्तन, पेन्सन हिसाब, तुलना र व्यावहारिक गाइड — नियमित अपडेट।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: "Blog" }]}
      />

      {featured && (
        <section className="container-page py-12 md:py-14">
          <Link
            href={`/blog/${featured.slug}`}
            className="card card-hover group block overflow-hidden bg-gradient-to-br from-primary-50 to-white p-6 md:p-8"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="badge-primary">{featured.category}</span>
              <span className="text-ink-400">{fmtDate(featured.dateISO, isEn)}</span>
            </div>
            <div className="mt-4 flex items-start gap-4">
              <span className="icon-tile hidden h-12 w-12 sm:flex">
                <Icon name="newspaper" size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-2xl leading-snug text-ink-900 group-hover:text-primary-700 md:text-3xl">{featured.title}</h3>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-600">{featured.excerpt}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary-700">
                  {isEn ? "Read" : "पढ्नुहोस्"} <Icon name="arrowRight" size={14} className="transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {rest.length > 0 && (
        <section className="border-t border-ink-200 bg-ink-50">
          <div className="container-page py-12 md:py-14">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-hover group flex flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge-neutral">{p.category}</span>
                    <span className="text-xs text-ink-400">{fmtDate(p.dateISO, isEn)}</span>
                  </div>
                  <p className="mt-3 font-display text-lg font-bold leading-snug text-ink-900 group-hover:text-primary-700">{p.title}</p>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-500">{p.excerpt}</p>
                  <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-primary-700">
                    {isEn ? "Read" : "पढ्नुहोस्"} <Icon name="arrowRight" size={14} className="transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
