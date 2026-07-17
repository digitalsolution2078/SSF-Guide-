import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { IncomeTaxCalculator } from "@/components/income-tax-calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/income-tax",
    title: "Nepal Salary Income Tax Calculator (FY 2083/84 & 2082/83)",
    description: "नेपालको तलब आयकर हिसाब गर्नुहोस् — आ.व. २०८३/८४ र २०८२/८३ का स्ल्याब, SSF १% छुट, बीमा कटौती र स्ल्याब-वार breakdown सहित।",
  });
}

export default async function IncomeTaxPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🧾 {isEn ? "Nepal Salary Income Tax Calculator" : "नेपाल तलब आयकर Calculator"}
      </h1>
      <p className="mt-2 text-gray-600">
        {isEn
          ? "Estimate your Nepal salary income tax with the latest slabs, including the SSF 1% waiver and insurance deductions. Supports FY 2083/84 (new) and FY 2082/83."
          : "पछिल्ला स्ल्याब, SSF १% छुट र बीमा कटौतीसहित आफ्नो तलब आयकर अनुमान गर्नुहोस्। आ.व. २०८३/८४ (नयाँ) र २०८२/८३ दुवै समर्थित।"}
      </p>
      <div className="mt-8">
        <IncomeTaxCalculator />
      </div>
    </div>
  );
}
