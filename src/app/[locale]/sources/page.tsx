import type { Metadata } from "next";
import { sources } from "@/content/sources";

export const metadata: Metadata = {
  title: "स्रोत सूची — Source Registry",
  description:
    "यस प्लेटफर्मका सबै तथ्य २० आधिकारिक SSF दस्तावेजमा आधारित छन् — ऐन, नियमावली, कार्यविधि र निर्देशिकाको पूर्ण सूची।",
};

export default async function SourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        📜 {isEn ? "Source Registry" : "स्रोत सूची (Source Registry)"}
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        {isEn
          ? "Every fact on SSF Guide Nepal is checked against the official documents below. Rates, limits, and rules can change through amendments — for legal purposes, always consult the original documents. Document titles are shown in Nepali as published officially."
          : "SSF Guide Nepal का सबै तथ्य निम्न आधिकारिक दस्तावेजसँग जाँचिएका छन्। दर, सीमा र नियम संशोधनद्वारा परिवर्तन हुन सक्छन् — कानुनी प्रयोजनका लागि सधैँ मूल दस्तावेज हेर्नुहोस्।"}
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-primary-50">
              <th className="border border-primary-100 px-3 py-2 text-left font-semibold text-primary-900">
                {isEn ? "Document" : "दस्तावेज"}
              </th>
              <th className="border border-primary-100 px-3 py-2 text-left font-semibold text-primary-900">
                {isEn ? "Type" : "प्रकार"}
              </th>
              <th className="border border-primary-100 px-3 py-2 text-left font-semibold text-primary-900">
                {isEn ? "Date" : "मिति"}
              </th>
              <th className="border border-primary-100 px-3 py-2 text-left font-semibold text-primary-900">
                {isEn ? "Summary" : "सार"}
              </th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s) => (
              <tr key={s.key} className="even:bg-gray-50">
                <td className="border border-primary-100 px-3 py-2 font-medium text-gray-900">
                  {s.title}
                  <span className="block text-xs font-normal text-gray-500">
                    {s.issuingAuthority}
                  </span>
                </td>
                <td className="border border-primary-100 px-3 py-2 text-gray-700">
                  {s.docType}
                </td>
                <td className="border border-primary-100 px-3 py-2 text-gray-700">
                  {s.date}
                </td>
                <td className="border border-primary-100 px-3 py-2 text-gray-700">
                  {s.summary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        {isEn ? "Official website:" : "आधिकारिक वेबसाइट:"}{" "}
        <a
          href="https://ssf.gov.np"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-700 underline"
        >
          ssf.gov.np
        </a>{" "}
        · {isEn ? "Online system:" : "अनलाइन प्रणाली:"}{" "}
        <a
          href="https://sosys.ssf.gov.np"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-700 underline"
        >
          sosys.ssf.gov.np
        </a>
      </p>
    </div>
  );
}
