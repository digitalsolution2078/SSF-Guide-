import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { RetirementGoalCalculator } from "@/components/retirement-goal-calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/retirement-goal",
    title: "Retirement Goal Calculator — ६० वर्षमा कति चाहिन्छ?",
    description: "६० वर्षमा आफ्नो जीवनस्तर कायम राख्न कति कोष चाहिन्छ र अहिलेदेखि मासिक कति बचाउने हिसाब गर्नुहोस् — SSF pension सँग तुलना।",
  });
}

export default async function RetirementGoalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🎯 {isEn ? "Retirement Goal Calculator" : "Retirement Goal Calculator"}
      </h1>
      <p className="mt-2 text-gray-600">
        {isEn
          ? "Estimate the corpus you'll need at 60 to sustain your lifestyle, and how much to save monthly — then see how much your SSF pension already covers."
          : "६० वर्षमा जीवनस्तर कायम राख्न चाहिने कोष र मासिक कति बचाउने अनुमान गर्नुहोस् — अनि SSF pension ले कति ढाक्छ हेर्नुहोस्।"}
      </p>
      <div className="mt-8">
        <RetirementGoalCalculator />
      </div>
    </div>
  );
}
