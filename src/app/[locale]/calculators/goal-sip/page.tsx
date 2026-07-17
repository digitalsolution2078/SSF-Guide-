import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { GoalSipCalculator } from "@/components/goal-sip-calculator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/goal-sip",
    title: "Goal SIP Calculator — लक्ष्यका लागि मासिक कति लगानी?",
    description: "घर, शिक्षा वा कुनै लक्ष्य रकम पुर्‍याउन हरेक महिना कति लगानी गर्नुपर्छ हिसाब गर्नुहोस् — reverse SIP।",
  });
}

export default async function GoalSipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🎯 {isEn ? "Goal SIP Calculator" : "Goal SIP Calculator"}
      </h1>
      <p className="mt-2 text-gray-600">
        {isEn
          ? "Pick a goal amount and timeline — see exactly how much to invest each month to reach it."
          : "लक्ष्य रकम र समय छान्नुहोस् — त्यो पुर्‍याउन हरेक महिना ठ्याक्कै कति लगानी गर्नुपर्छ हेर्नुहोस्।"}
      </p>
      <div className="mt-8">
        <GoalSipCalculator />
      </div>
    </div>
  );
}
