import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { downloadCategories } from "@/content/downloads";
import { Icon } from "@/components/icons";
import { PageHero, SectionHead } from "@/components/ui";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/downloads",
    title: "Important Downloads — आधिकारिक SSF दस्तावेज र फारमहरू",
    description: "SSF का ऐन, कार्यविधि, दाबी फारम, निवेदन फारम र अस्पताल दर सूची — सबै आधिकारिक PDF एकै ठाउँमा (ssf.gov.np बाट)।",
  });
}

export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div>
      <PageHero
        icon="download"
        title="Important Downloads"
        lead={
          isEn
            ? "SSF's official acts, procedures, claim forms, and application forms — every link goes directly to the official website (ssf.gov.np), so you always get the latest version. Document titles are shown in Nepali as published officially."
            : "SSF का आधिकारिक ऐन, कार्यविधि, दाबी फारम र निवेदन फारमहरू — सबै link सीधै आधिकारिक website (ssf.gov.np) मा जान्छन्, त्यसैले सधैँ पछिल्लो संस्करण पाइन्छ।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: "Downloads" }]}
      >
        {/* quick jump */}
        <div className="flex flex-wrap gap-2">
          {downloadCategories.map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className="chip">
              {isEn ? c.titleEn : c.title}
            </a>
          ))}
        </div>
      </PageHero>

      <div className="container-page py-12 md:py-14">
        <div className="space-y-14">
          {downloadCategories.map((c) => (
            <section key={c.slug} id={c.slug} className="scroll-mt-24">
              <SectionHead title={isEn ? c.titleEn : c.title} lead={isEn ? c.descriptionEn : c.description} />
              <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {c.items.map((item) => {
                  const isPdf = item.url.endsWith(".pdf");
                  return (
                    <li key={item.url}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card card-hover group flex items-center gap-3.5 p-4"
                      >
                        <span className="icon-tile">
                          <Icon name={isPdf ? "file" : "external"} size={20} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold leading-snug text-ink-900 group-hover:text-primary-700">
                            {item.title}
                          </span>
                          {item.date && (
                            <span className="mt-0.5 block text-xs text-ink-400">({item.date})</span>
                          )}
                        </span>
                        <span className={isPdf ? "badge-primary shrink-0" : "badge-neutral shrink-0"}>
                          {isPdf ? (
                            <>
                              PDF
                              <Icon name="download" size={12} />
                            </>
                          ) : (
                            <>
                              {isEn ? "View" : "हेर्नुहोस्"}
                              <Icon name="arrowUpRight" size={12} />
                            </>
                          )}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <div className="surface mt-14 flex gap-3 p-4 text-sm leading-relaxed text-ink-600 md:p-5">
          <Icon name="info" size={18} className="mt-0.5 shrink-0 text-primary-600" />
          <p>
            {isEn ? (
              <>
                Source of all documents: the Social Security Fund&apos;s official
                website{" "}
                <a
                  href="https://ssf.gov.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-700 underline"
                >
                  ssf.gov.np
                </a>
                . If a link doesn&apos;t work,{" "}
                <Link href="/report-correction" className="font-medium text-primary-700 underline">
                  report it here
                </Link>
                .
              </>
            ) : (
              <>
                सबै दस्तावेजको स्रोत: सामाजिक सुरक्षा कोषको आधिकारिक website{" "}
                <a
                  href="https://ssf.gov.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-700 underline"
                >
                  ssf.gov.np
                </a>
                । कुनै link काम नगरे{" "}
                <Link href="/report-correction" className="font-medium text-primary-700 underline">
                  यहाँ रिपोर्ट गर्नुहोस्
                </Link>
                ।
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
