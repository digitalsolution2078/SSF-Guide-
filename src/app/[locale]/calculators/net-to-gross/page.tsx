import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { NetToGrossCalculator } from "@/components/net-to-gross-calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/net-to-gross",
    title: "Net to Gross Salary Calculator Nepal — करार तलब कति लेख्ने?",
    description: "हातमा चाहिएको तलबबाट करारमा लेख्ने कुल (gross) तलब कति हुनुपर्छ हिसाब गर्नुहोस् — SSF ११% र आयकरसहित। दुई-तर्फी (gross↔net)।",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">🔁 {isEn ? "Net ↔ Gross Salary Converter" : "Net ↔ Gross तलब Converter"}</h1>
      <p className="mt-2 text-gray-600">{isEn ? "Type a desired take-home and get the gross salary to write in the contract — or go the other way. Includes SSF and income tax." : "हातमा चाहिएको तलब लेख्नुहोस्, करारमा लेख्ने कुल तलब पाउनुहोस् — वा उल्टो। SSF र आयकरसहित।"}</p>
      <div className="mt-8"><NetToGrossCalculator /></div>
    </div>
  );
}
