import type { Metadata } from "next";
import { WageOvertimeCalculator } from "@/components/wage-overtime-calculator";

export const metadata: Metadata = {
  title: "Daily Wage & Overtime Calculator Nepal (Labour Act 2074)",
  description:
    "मासिक तलबबाट दैनिक दर, घण्टा दर र १.५× ओभरटाइम रकम हिसाब गर्नुहोस् — श्रम ऐन २०७४ अनुसार।",
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">⏱️ {isEn ? "Daily Wage & Overtime Calculator" : "दैनिक ज्याला र ओभरटाइम Calculator"}</h1>
      <p className="mt-2 text-gray-600">{isEn ? "Find your daily rate, hourly rate, and 1.5× overtime pay under Nepal's Labour Act 2074." : "श्रम ऐन २०७४ अनुसार दैनिक दर, घण्टा दर र १.५× ओभरटाइम रकम पत्ता लगाउनुहोस्।"}</p>
      <div className="mt-8"><WageOvertimeCalculator /></div>
    </div>
  );
}
