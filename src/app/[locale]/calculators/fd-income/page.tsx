import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { FdIncomeCalculator } from "@/components/fd-income-calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/fd-income",
    title: "FD Monthly Income Calculator Nepal — ब्याजबाट मासिक कति?",
    description: "Fixed Deposit को ब्याजबाट मासिक/त्रैमासिक कति आम्दानी आउँछ (ब्याज कर कटाएर) हिसाब गर्नुहोस् — अवकाशप्राप्तका लागि उपयोगी।",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">🏦 {isEn ? "FD Monthly Income Calculator" : "FD मासिक आम्दानी Calculator"}</h1>
      <p className="mt-2 text-gray-600">{isEn ? "For those living off Fixed Deposit interest — see your monthly/quarterly payout after interest tax, with the principal intact." : "Fixed Deposit को ब्याजमा जीविका चलाउनेका लागि — ब्याज कर कटाएपछि मासिक/त्रैमासिक कति, साँवा जस्ताको तस्तै।"}</p>
      <div className="mt-8"><FdIncomeCalculator /></div>
    </div>
  );
}
