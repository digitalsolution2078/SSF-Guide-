import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { ContributionCalculator } from "@/components/contribution-calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/contribution",
    title: "Employee–Employer Contribution Calculator",
    description: "आफ्नो आधारभूत पारिश्रमिकबाट SSF मा कति योगदान जम्मा हुन्छ हिसाब गर्नुहोस् — श्रमिक ११% + रोजगारदाता २०% = ३१%।",
  });
}

export default function ContributionCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        Employee–Employer Contribution Calculator
      </h1>
      <p className="mt-2 text-gray-600">
        आधारभूत पारिश्रमिक राख्नुहोस् — श्रमिक ११% + रोजगारदाता २०% = कुल ३१%
        कसरी बाँडिन्छ तुरुन्तै देखिन्छ।
      </p>
      <div className="mt-8">
        <ContributionCalculator />
      </div>
    </div>
  );
}
