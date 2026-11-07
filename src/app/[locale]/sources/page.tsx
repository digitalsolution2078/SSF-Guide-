import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { sources } from "@/content/sources";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/sources",
    title: "स्रोत सूची — Source Registry",
    description: "यस प्लेटफर्मका सबै तथ्य २० आधिकारिक SSF दस्तावेजमा आधारित छन् — ऐन, नियमावली, कार्यविधि र निर्देशिकाको पूर्ण सूची।",
  });
}

export default async function SourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div>
      <PageHero
        icon="file"
        title={isEn ? "Source Registry" : "स्रोत सूची (Source Registry)"}
        lead={
          isEn
            ? "Every fact on SSF Guide Nepal is checked against the official documents below. Rates, limits, and rules can change through amendments — for legal purposes, always consult the original documents. Document titles are shown in Nepali as published officially."
            : "SSF Guide Nepal का सबै तथ्य निम्न आधिकारिक दस्तावेजसँग जाँचिएका छन्। दर, सीमा र नियम संशोधनद्वारा परिवर्तन हुन सक्छन् — कानुनी प्रयोजनका लागि सधैँ मूल दस्तावेज हेर्नुहोस्।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Sources" : "स्रोत" }]}
      />

      <div className="container-page py-12 md:py-14">
        <div className="overflow-x-auto rounded-2xl border border-ink-200 bg-white">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-ink-50 text-ink-700">
                <th className="border-b border-ink-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  {isEn ? "Document" : "दस्तावेज"}
                </th>
                <th className="border-b border-ink-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  {isEn ? "Type" : "प्रकार"}
                </th>
                <th className="border-b border-ink-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  {isEn ? "Date" : "मिति"}
                </th>
                <th className="border-b border-ink-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  {isEn ? "Summary" : "सार"}
                </th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.key} className="border-b border-ink-100 last:border-b-0">
                  <td className="px-4 py-3 align-top font-medium text-ink-900">
                    {s.title}
                    <span className="mt-0.5 block text-xs font-normal text-ink-500">
                      {s.issuingAuthority}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="badge-neutral whitespace-nowrap">{s.docType}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-ink-700">
                    {s.date}
                  </td>
                  <td className="px-4 py-3 align-top leading-relaxed text-ink-700">
                    {s.summary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-500">
          <Icon name="external" size={14} className="text-ink-400" />
          <span>
            {isEn ? "Official website:" : "आधिकारिक वेबसाइट:"}{" "}
            <a
              href="https://ssf.gov.np"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-700 underline"
            >
              ssf.gov.np
            </a>{" "}
            · {isEn ? "Online system:" : "अनलाइन प्रणाली:"}{" "}
            <a
              href="https://sosys.ssf.gov.np"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-700 underline"
            >
              sosys.ssf.gov.np
            </a>
          </span>
        </p>
      </div>
    </div>
  );
}
