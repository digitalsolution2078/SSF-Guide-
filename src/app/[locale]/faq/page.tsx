import type { Metadata } from "next";
import { faqs } from "@/content/faqs";
import { categories } from "@/content/categories";
import { getPublishedDbFaqs } from "@/lib/db-faqs";
import { Link } from "@/i18n/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SSF FAQ — धेरै सोधिने प्रश्नहरू",
  description:
    "३१% कहाँ जान्छ? जागिर छाडेपछि के हुन्छ? Pension कहिले? — SSF सम्बन्धी प्रश्नका स्रोतसहितका उत्तर।",
};

export default async function FaqIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const dbFaqs = await getPublishedDbFaqs();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        ❓ {isEn ? "Frequently Asked Questions (FAQ)" : "धेरै सोधिने प्रश्नहरू (FAQ)"}
      </h1>

      {categories.map((c) => {
        const categoryFaqs = faqs.filter((f) => f.categorySlug === c.slug);
        if (categoryFaqs.length === 0) return null;
        return (
          <section key={c.slug} className="mt-8">
            <h2 className="text-lg font-bold text-primary-900">
              {c.icon} {isEn ? c.titleEn : c.titleNe}
            </h2>
            <ul className="mt-3 space-y-2">
              {categoryFaqs.map((f) => (
                <li key={f.slug}>
                  <Link
                    href={`/faq/${f.slug}`}
                    className="block rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm hover:border-primary-400"
                  >
                    {isEn && f.en ? f.en.question : f.question}
                    {f.popular && (
                      <span className="ml-2 rounded bg-action-50 px-1.5 py-0.5 text-xs text-action-700">
                        {isEn ? "Popular" : "लोकप्रिय"}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {dbFaqs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-primary-900">
            💬 {isEn ? "More questions" : "थप प्रश्नहरू"}
          </h2>
          <ul className="mt-3 space-y-2">
            {dbFaqs.map((f) => (
              <li key={f.id}>
                <Link
                  href={`/faq/${f.slug}`}
                  className="block rounded-lg border border-primary-100 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm hover:border-primary-400"
                >
                  {f.question}
                  {f.popular && (
                    <span className="ml-2 rounded bg-action-50 px-1.5 py-0.5 text-xs text-action-700">
                      {isEn ? "Popular" : "लोकप्रिय"}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 rounded-xl bg-primary-50 px-5 py-4 text-sm text-gray-700">
        {isEn ? (
          <>
            Didn&apos;t find your answer?{" "}
            <Link href="/ask" className="font-semibold text-primary-700 underline">
              Ask the SSF AI
            </Link>{" "}
            or{" "}
            <Link href="/request" className="font-semibold text-primary-700 underline">
              get help from Digital Solution
            </Link>
            .
          </>
        ) : (
          <>
            प्रश्नको उत्तर भेटिएन?{" "}
            <Link href="/ask" className="font-semibold text-primary-700 underline">
              SSF AI लाई सोध्नुहोस्
            </Link>{" "}
            वा{" "}
            <Link href="/request" className="font-semibold text-primary-700 underline">
              Digital Solution बाट सहायता लिनुहोस्
            </Link>
            ।
          </>
        )}
      </p>
    </div>
  );
}
