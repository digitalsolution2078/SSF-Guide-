import type { Metadata } from "next";
import { sortedBlogPosts } from "@/content/blog";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "SSF समाचार र Blog — पछिल्ला अपडेट, गाइड र हिसाब",
  description:
    "सामाजिक सुरक्षा कोष (SSF) सम्बन्धी पछिल्ला समाचार, योगदान/कर परिवर्तन, पेन्सन हिसाब, तुलना र व्यावहारिक गाइड — नियमित अपडेट हुने SSF blog।",
};

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
  const posts = sortedBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        📰 {isEn ? "SSF News & Blog" : "SSF समाचार र Blog"}
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        {isEn
          ? "The latest on Nepal's Social Security Fund — contribution and tax changes, pension math, comparisons, and practical guides."
          : "सामाजिक सुरक्षा कोषका पछिल्ला समाचार, योगदान/कर परिवर्तन, पेन्सन हिसाब, तुलना र व्यावहारिक गाइड — नियमित अपडेट।"}
      </p>

      {/* Featured */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="mt-8 block overflow-hidden rounded-2xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-6 shadow-sm transition hover:border-primary-400 hover:shadow"
        >
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded bg-action-500 px-2 py-0.5 font-semibold text-white">
              {featured.category}
            </span>
            <span className="text-gray-400">
              {fmtDate(featured.publishDate, isEn)} · {featured.readingMinutes}{" "}
              {isEn ? "min read" : "मिनेट"}
            </span>
          </div>
          <div className="mt-3 flex items-start gap-4">
            <span className="text-4xl">{featured.emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-primary-900">
                {isEn && featured.en ? featured.en.title : featured.title}
              </h2>
              <p className="mt-2 text-gray-700">
                {isEn && featured.en ? featured.en.excerpt : featured.excerpt}
              </p>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="flex flex-col rounded-2xl border border-primary-100 bg-white p-5 shadow-sm transition hover:border-primary-400 hover:shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{p.emoji}</span>
              <span className="rounded bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                {p.category}
              </span>
            </div>
            <h3 className="mt-3 font-bold leading-snug text-primary-900">
              {isEn && p.en ? p.en.title : p.title}
            </h3>
            <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">
              {isEn && p.en ? p.en.excerpt : p.excerpt}
            </p>
            <p className="mt-3 text-xs text-gray-400">
              {fmtDate(p.publishDate, isEn)} · {p.readingMinutes}{" "}
              {isEn ? "min read" : "मिनेट"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
