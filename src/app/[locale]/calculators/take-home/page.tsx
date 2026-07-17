import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { TakeHomeCalculator } from "@/components/take-home-calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/take-home",
    title: "Take-home Salary Calculator Nepal — हातमा कति आउँछ?",
    description: "मासिक तलबबाट SSF (११%) र आयकर कटाएपछि हातमा कति आउँछ हिसाब गर्नुहोस् — रोजगारदाताले थप्ने २०% SSF सहित। आ.व. २०८३/८४ र २०८२/८३।",
  });
}

export default async function TakeHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        💵 {isEn ? "Take-home Salary Calculator" : "Take-home Salary Calculator (हातमा तलब)"}
      </h1>
      <p className="mt-2 text-gray-600">
        {isEn
          ? "See your real cash-in-hand after SSF (11%) and income tax — plus the 20% your employer adds into your SSF account on top."
          : "SSF (११%) र आयकर कटाएपछि तपाईंको हातमा वास्तवमा कति आउँछ हेर्नुहोस् — साथै रोजगारदाताले तपाईंकै SSF खातामा थप्ने २०%।"}
      </p>
      <div className="mt-8">
        <TakeHomeCalculator />
      </div>
    </div>
  );
}
