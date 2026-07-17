import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { AllocationCalculator } from "@/components/allocation-calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/allocation",
    title: "31% Contribution Breakdown",
    description:
      "SSF मा जम्मा हुने ३१% रकम चार योजनामा कसरी बाँडिन्छ हेर्नुहोस् — १.२०% / ०.८०% / ०.६७% / २८.३३% (५औँ संशोधन)।",
  });
}

export default function AllocationCalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        31% Contribution Breakdown
      </h1>
      <p className="mt-2 text-gray-600">
        तपाईंको तलबबाट जम्मा भएको रकम कुन योजनामा कति जान्छ — रकम र प्रतिशतसहित।
      </p>
      <div className="mt-8">
        <AllocationCalculator />
      </div>
    </div>
  );
}
