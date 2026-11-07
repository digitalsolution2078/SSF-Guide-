import type { Metadata } from "next";
import { legalDocs } from "@/content/legal";
import { LegalDocPage } from "@/components/legal-doc";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/ui";
import { pageSeo } from "@/lib/seo";

const doc = legalDocs["about"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/about",
    title: isEn && doc.titleEn ? doc.titleEn : doc.title,
    description: isEn
      ? "About SSF Guide Nepal — an independent educational platform on Nepal's Social Security Fund by Digital Solution, Pokhara."
      : "SSF Guide Nepal — Digital Solution (पोखरा) द्वारा सञ्चालित सामाजिक सुरक्षा कोष सम्बन्धी स्वतन्त्र शैक्षिक प्लेटफर्म।",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const useEn = isEn && Boolean(doc.bodyEn);
  const title = useEn && doc.titleEn ? doc.titleEn : doc.title;
  return (
    <div>
      <PageHero
        width="narrow"
        icon="users"
        eyebrow={isEn ? "About" : "हाम्रो बारेमा"}
        title={title}
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: title }]}
      />

      {/* Founder */}
      <div className="container-narrow pt-12">
        <div className="card flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/rabin-paudel.png"
            alt="Rabin Paudel — Founder, Digital Solution / SSF Educator"
            className="h-36 w-36 shrink-0 rounded-2xl object-cover"
          />
          <div className="text-center sm:text-left">
            <span className="eyebrow">{isEn ? "Founder" : "संस्थापक"}</span>
            <p className="mt-1 font-display text-2xl font-semibold text-ink-900">Rabin Paudel</p>
            <p className="text-sm text-ink-500">
              {isEn
                ? "Founder, Digital Solution · SSF Educator"
                : "संस्थापक, Digital Solution · SSF Educator"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              {isEn
                ? "An educator who has helped thousands of Nepalis understand the Social Security Fund through dozens of educational videos on YouTube — SSF Guide Nepal was born from that experience."
                : "YouTube मा SSF सम्बन्धी दर्जनौँ शैक्षिक भिडियोमार्फत हजारौँ नेपालीलाई सामाजिक सुरक्षा कोष बुझाउँदै आएका शिक्षक — यही अनुभवबाट SSF Guide Nepal जन्मियो।"}
            </p>
            <a
              href="https://digitalsolutionnepal.com"
              target="_blank"
              rel="noopener"
              className="btn-ghost mt-3 -ml-2"
            >
              digitalsolutionnepal.com
              <Icon name="arrowUpRight" size={16} />
            </a>
          </div>
        </div>
      </div>

      <LegalDocPage doc={doc} locale={locale} embedded hideTitle />
    </div>
  );
}
