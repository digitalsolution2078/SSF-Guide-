import type { Metadata } from "next";
import { DashainBonusCalculator } from "@/components/dashain-bonus-calculator";

export const metadata: Metadata = {
  title: "Dashain Bonus Calculator — बोनसमा कति कर, हातमा कति?",
  description:
    "दशैँ/चाडपर्व बोनस (१३औँ महिना तलब) मा कति आयकर लाग्छ र हातमा कति आउँछ हिसाब गर्नुहोस् — मार्जिनल दरसहित।",
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">🎁 {isEn ? "Dashain Bonus Calculator" : "दशैँ बोनस Calculator"}</h1>
      <p className="mt-2 text-gray-600">{isEn ? "See how much tax your festival (13th-month) bonus attracts and what actually lands in hand." : "दशैँ/चाडको बोनस (१३औँ महिना) मा कति कर लाग्छ र हातमा कति आउँछ हेर्नुहोस्।"}</p>
      <div className="mt-8"><DashainBonusCalculator /></div>
    </div>
  );
}
