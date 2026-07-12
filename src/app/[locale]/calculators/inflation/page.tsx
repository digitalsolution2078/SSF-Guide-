import type { Metadata } from "next";
import { InflationCalculator } from "@/components/inflation-calculator";

export const metadata: Metadata = {
  title: "Inflation Calculator — पैसाको किन्ने क्षमता",
  description:
    "मुद्रास्फीतिले आजको रकम भविष्यमा कति पर्छ र कति मूल्यको हुन्छ देखाउँछ — किन दीर्घकालीन बचत जरुरी छ बुझ्नुहोस्।",
};

export default async function InflationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        📉 {isEn ? "Inflation Calculator" : "Inflation Calculator"}
      </h1>
      <p className="mt-2 text-gray-600">
        {isEn
          ? "See how inflation raises future costs and erodes the value of idle cash — and why long-term, inflation-adjusted savings matter."
          : "मुद्रास्फीतिले भविष्यको खर्च कसरी बढाउँछ र यत्तिकै राखेको नगदको मूल्य कसरी घटाउँछ हेर्नुहोस् — किन दीर्घकालीन बचत जरुरी छ।"}
      </p>
      <div className="mt-8">
        <InflationCalculator />
      </div>
    </div>
  );
}
