import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, blogPostBySlug, sortedBlogPosts } from "@/content/blog";
import { articleBySlug } from "@/content/articles";
import { ContentBlocks } from "@/components/content-blocks";
import { RichText } from "@/components/rich-text";
import { Icon } from "@/components/icons";
import { Breadcrumbs, Callout } from "@/components/ui";
import { getPublishedDbBlogBySlug } from "@/lib/db-blog";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = blogPostBySlug(slug);
  const isEn = locale === "en";
  if (!p) {
    const db = await getPublishedDbBlogBySlug(slug).catch(() => null);
    if (!db) return pageSeo({ locale, path: `/blog/${slug}` });
    return pageSeo({
      locale,
      path: `/blog/${slug}`,
      title: db.title,
      description: db.excerpt,
      type: "article",
      publishedTime: db.publishedAt.toISOString(),
    });
  }
  const t = isEn && p.en ? p.en : p;
  return pageSeo({
    locale,
    path: `/blog/${slug}`,
    title: t.title,
    description: t.excerpt,
    type: "article",
    publishedTime: new Date(p.publishDate).toISOString(),
    modifiedTime: p.updatedDate ? new Date(p.updatedDate).toISOString() : undefined,
    tags: p.tags,
  });
}

function fmtDate(iso: string, isEn: boolean): string {
  const [y, m, d] = iso.split("-").map(Number);
  const ne = ["", "जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर"];
  const en = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return isEn ? `${en[m]} ${d}, ${y}` : `${d} ${ne[m]} ${y}`;
}

function PostHeader({
  locale,
  category,
  title,
  excerpt,
  meta,
}: {
  locale: string;
  category: string;
  title: string;
  excerpt: string;
  meta?: string;
}) {
  const isEn = locale === "en";
  return (
    <header className="border-b border-ink-200 bg-gradient-to-b from-ink-50 to-white">
      <div className="container-narrow pb-10 pt-8 md:pt-10">
        <Breadcrumbs
          items={[
            { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: category },
          ]}
        />
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="badge-primary">{category}</span>
          {meta && <span className="text-xs text-ink-400">{meta}</span>}
        </div>
        <h1 className="mt-3 text-3xl md:text-[2.5rem]">{title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 md:text-lg">{excerpt}</p>
      </div>
    </header>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const base = blogPostBySlug(slug);
  if (!base) {
    // Admin-authored post from the database (edited via /admin/blog)
    const db = await getPublishedDbBlogBySlug(slug);
    if (!db) notFound();
    const url = `https://ssf.digitalsolutionnepal.com${locale === "en" ? "/en" : ""}/blog/${slug}`;
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: db.title,
      description: db.excerpt,
      inLanguage: locale,
      datePublished: db.publishedAt.toISOString(),
      author: { "@type": "Organization", name: "Digital Solution" },
      publisher: { "@type": "Organization", name: "Digital Solution", url: "https://digitalsolutionnepal.com" },
      mainEntityOfPage: url,
    };
    return (
      <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <PostHeader locale={locale} category={db.category} title={db.title} excerpt={db.excerpt} />
        <article className="container-narrow py-10 md:py-12">
          <RichText text={db.body} />
          <Link
            href="/request"
            className="group mt-12 flex items-center gap-3.5 rounded-2xl bg-action-500 p-4 text-white shadow-sm transition hover:bg-action-600"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <Icon name="chat" size={20} />
            </span>
            <span className="flex-1 text-sm font-semibold">
              {locale === "en" ? "Get help from Digital Solution" : "Digital Solution बाट सहायता लिनुहोस्"}
            </span>
            <Icon name="arrowRight" size={16} className="text-white/70 transition group-hover:translate-x-0.5 group-hover:text-white" />
          </Link>
        </article>
      </div>
    );
  }
  const isEn = locale === "en";
  const useEn = isEn && Boolean(base.en);
  const post =
    useEn && base.en
      ? { ...base, title: base.en.title, excerpt: base.en.excerpt, sections: base.en.sections }
      : base;

  const related = sortedBlogPosts()
    .filter((p) => p.slug !== slug && p.tags.some((t) => base.tags.includes(t)))
    .slice(0, 3);
  const relatedArticle = base.relatedArticleSlug
    ? articleBySlug(base.relatedArticleSlug)
    : undefined;

  const BASE = "https://ssf.digitalsolutionnepal.com";
  const prefix = isEn ? "/en" : "";
  const url = `${BASE}${prefix}/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Blog", item: `${BASE}${prefix}/blog` },
          { "@type": "ListItem", position: 2, name: post.title, item: url },
        ],
      },
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        inLanguage: locale,
        datePublished: base.publishDate,
        dateModified: base.updatedDate ?? base.publishDate,
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

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostHeader
        locale={locale}
        category={post.category}
        title={post.title}
        excerpt={post.excerpt}
        meta={`${fmtDate(base.publishDate, isEn)} · ${base.readingMinutes} ${isEn ? "min read" : "मिनेट पढाइ"}`}
      />

      <article className="container-narrow py-10 md:py-12">
        {isEn && !base.en && (
          <div className="mb-8">
            <Callout tone="info">
              This post is currently in Nepali — English translation coming soon.
            </Callout>
          </div>
        )}

        <div className="space-y-10">
          {post.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-2xl">{s.heading}</h2>
              <div className="mt-4">
                <ContentBlocks blocks={s.blocks} />
              </div>
            </section>
          ))}
        </div>

        {/* CTAs */}
        {(base.relatedCalculatorHref || relatedArticle) && (
          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {base.relatedCalculatorHref && (
              <Link href={base.relatedCalculatorHref} className="card card-hover group flex items-center gap-3.5 p-4">
                <span className="icon-tile">
                  <Icon name="calculator" size={20} />
                </span>
                <span className="flex-1 text-sm font-semibold text-ink-900 group-hover:text-primary-700">
                  {isEn ? "Try the related tool" : "सम्बन्धित tool प्रयोग गर्नुहोस्"}
                </span>
                <Icon name="arrowRight" size={16} className="text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
              </Link>
            )}
            {relatedArticle && (
              <Link
                href={`/school/${relatedArticle.categorySlug}/${relatedArticle.slug}`}
                className="card card-hover group flex items-center gap-3.5 p-4"
              >
                <span className="icon-tile">
                  <Icon name="book" size={20} />
                </span>
                <span className="flex-1 text-sm font-semibold text-ink-900 group-hover:text-primary-700">
                  {isEn ? "Read the full guide" : "पूरा guide पढ्नुहोस्"}
                </span>
                <Icon name="arrowRight" size={16} className="text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
              </Link>
            )}
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-12 border-t border-ink-200 pt-10">
            <h2 className="text-2xl">{isEn ? "Related posts" : "सम्बन्धित पोस्ट"}</h2>
            <ul className="mt-5 space-y-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="card card-hover group flex items-center gap-3 px-4 py-3.5 text-sm">
                    <span className="icon-tile h-9 w-9">
                      <Icon name="newspaper" size={16} />
                    </span>
                    <span className="flex-1 font-medium text-ink-800 group-hover:text-primary-700">
                      {isEn && p.en ? p.en.title : p.title}
                    </span>
                    <Icon name="chevronRight" size={16} className="shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 text-xs leading-relaxed text-ink-400">
          {isEn
            ? "Educational content; official rules and figures follow SSF and the Government of Nepal."
            : "शैक्षिक सामग्री; आधिकारिक नियम र रकम SSF तथा नेपाल सरकारबमोजिम हुन्छ।"}
        </p>
      </article>
    </div>
  );
}
