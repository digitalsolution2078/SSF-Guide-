import type { Metadata } from "next";
import { downloadCategories } from "@/content/downloads";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Important Downloads — आधिकारिक SSF दस्तावेज र फारमहरू",
  description:
    "SSF का ऐन, कार्यविधि, दाबी फारम, निवेदन फारम र अस्पताल दर सूची — सबै आधिकारिक PDF एकै ठाउँमा (ssf.gov.np बाट)।",
};

export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        📥 Important Downloads
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        {isEn
          ? "SSF's official acts, procedures, claim forms, and application forms — every link goes directly to the official website (ssf.gov.np), so you always get the latest version. Document titles are shown in Nepali as published officially."
          : "SSF का आधिकारिक ऐन, कार्यविधि, दाबी फारम र निवेदन फारमहरू — सबै link सीधै आधिकारिक website (ssf.gov.np) मा जान्छन्, त्यसैले सधैँ पछिल्लो संस्करण पाइन्छ।"}
      </p>

      {/* quick jump */}
      <div className="mt-6 flex flex-wrap gap-2">
        {downloadCategories.map((c) => (
          <a
            key={c.slug}
            href={`#${c.slug}`}
            className="rounded-full border border-primary-200 px-4 py-1.5 text-sm text-primary-800 hover:bg-primary-50"
          >
            {c.icon} {isEn ? c.titleEn : c.title}
          </a>
        ))}
      </div>

      {downloadCategories.map((c) => (
        <section key={c.slug} id={c.slug} className="mt-10 scroll-mt-20">
          <h2 className="text-xl font-bold text-primary-900">
            {c.icon} {isEn ? c.titleEn : c.title}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {isEn ? c.descriptionEn : c.description}
          </p>
          <ul className="mt-4 space-y-2">
            {c.items.map((item) => (
              <li key={item.url}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-xl border border-primary-100 bg-white px-4 py-3 shadow-sm transition hover:border-primary-400"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {item.title}
                    {item.date && (
                      <span className="ml-2 text-xs font-normal text-gray-400">
                        ({item.date})
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 rounded-lg bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                    {item.url.endsWith(".pdf") ? "PDF ↓" : isEn ? "View ↗" : "हेर्नुहोस् ↗"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="mt-10 rounded-lg bg-primary-50 px-4 py-3 text-sm text-gray-600">
        {isEn ? (
          <>
            💡 Source of all documents: the Social Security Fund&apos;s official
            website{" "}
            <a
              href="https://ssf.gov.np"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 underline"
            >
              ssf.gov.np
            </a>
            . If a link doesn&apos;t work,{" "}
            <Link href="/report-correction" className="text-primary-700 underline">
              report it here
            </Link>
            .
          </>
        ) : (
          <>
            💡 सबै दस्तावेजको स्रोत: सामाजिक सुरक्षा कोषको आधिकारिक website{" "}
            <a
              href="https://ssf.gov.np"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 underline"
            >
              ssf.gov.np
            </a>
            । कुनै link काम नगरे{" "}
            <Link href="/report-correction" className="text-primary-700 underline">
              यहाँ रिपोर्ट गर्नुहोस्
            </Link>
            ।
          </>
        )}
      </p>
    </div>
  );
}
