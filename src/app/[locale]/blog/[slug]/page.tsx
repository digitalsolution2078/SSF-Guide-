import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, blogPostBySlug, sortedBlogPosts } from "@/content/blog";
import { articleBySlug } from "@/content/articles";
import { ContentBlocks } from "@/components/content-blocks";
import { RichText } from "@/components/rich-text";
import { getPublishedDbBlogBySlug } from "@/lib/db-blog";
import { Link } from "@/i18n/navigation";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = blogPostBySlug(slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt };
}

function fmtDate(iso: string, isEn: boolean): string {
  const [y, m, d] = iso.split("-").map(Number);
  const ne = ["", "जनवरी", "फेब्रुअरी", "मार्च", "अप्रिल", "मे", "जुन", "जुलाई", "अगस्ट", "सेप्टेम्बर", "अक्टोबर", "नोभेम्बर", "डिसेम्बर"];
  const en = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return isEn ? `${en[m]} ${d}, ${y}` : `${d} ${ne[m]} ${y}`;
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
      <article className="mx-auto max-w-3xl px-4 py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <nav className="text-sm text-gray-500">
          <Link href="/blog" className="hover:text-primary-600">Blog</Link> / {db.category}
        </nav>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-4xl">{db.emoji}</span>
          <span className="rounded bg-action-500 px-2 py-0.5 text-xs font-semibold text-white">{db.category}</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold leading-snug text-primary-900 md:text-3xl">{db.title}</h1>
        <p className="mt-3 text-lg text-gray-700">{db.excerpt}</p>
        <div className="mt-8">
          <RichText text={db.body} />
        </div>
        <Link href="/request" className="mt-10 block rounded-xl bg-action-500 p-4 text-center text-sm font-semibold text-white hover:bg-action-600">
          🤝 {locale === "en" ? "Get help from Digital Solution →" : "Digital Solution बाट सहायता लिनुहोस् →"}
        </Link>
      </article>
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
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="text-sm text-gray-500">
        <Link href="/blog" className="hover:text-primary-600">
          {isEn ? "Blog" : "Blog"}
        </Link>{" "}
        / {post.category}
      </nav>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-4xl">{base.emoji}</span>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-action-500 px-2 py-0.5 font-semibold text-white">
            {post.category}
          </span>
          <span className="text-gray-400">
            {fmtDate(base.publishDate, isEn)} · {base.readingMinutes}{" "}
            {isEn ? "min read" : "मिनेट पढाइ"}
          </span>
        </div>
      </div>

      <h1 className="mt-3 text-2xl font-bold leading-snug text-primary-900 md:text-3xl">
        {post.title}
      </h1>
      <p className="mt-3 text-lg text-gray-700">{post.excerpt}</p>

      {isEn && !base.en && (
        <p className="mt-4 rounded-lg bg-primary-50 px-4 py-2 text-sm text-gray-600">
          🌐 This post is currently in Nepali — English translation coming soon.
        </p>
      )}

      {post.sections.map((s, i) => (
        <section key={i} className="mt-8">
          <h2 className="mb-3 text-xl font-bold text-primary-900">{s.heading}</h2>
          <ContentBlocks blocks={s.blocks} />
        </section>
      ))}

      {/* CTAs */}
      <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {base.relatedCalculatorHref && (
          <Link
            href={base.relatedCalculatorHref}
            className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
          >
            🧮 {isEn ? "Try the related tool →" : "सम्बन्धित tool प्रयोग गर्नुहोस् →"}
          </Link>
        )}
        {relatedArticle && (
          <Link
            href={`/school/${relatedArticle.categorySlug}/${relatedArticle.slug}`}
            className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
          >
            📖 {isEn ? "Read the full guide →" : "पूरा guide पढ्नुहोस् →"}
          </Link>
        )}
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold text-primary-900">
            {isEn ? "Related posts" : "सम्बन्धित पोस्ट"}
          </h2>
          <div className="mt-3 space-y-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="block rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm hover:border-primary-400"
              >
                {p.emoji} {isEn && p.en ? p.en.title : p.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="mt-8 text-xs text-gray-400">
        {isEn
          ? "Educational content; official rules and figures follow SSF and the Government of Nepal."
          : "शैक्षिक सामग्री; आधिकारिक नियम र रकम SSF तथा नेपाल सरकारबमोजिम हुन्छ।"}
      </p>
    </article>
  );
}
