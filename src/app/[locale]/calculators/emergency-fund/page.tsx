import type { Metadata } from "next";
import { EmergencyFundCalculator } from "@/components/emergency-fund-calculator";

export const metadata: Metadata = {
  title: "Emergency Fund Calculator — कति आकस्मिक बचत चाहिन्छ?",
  description:
    "जागिर गुम्ने, medical copayment र आकस्मिक खर्च धान्न कति आकस्मिक कोष चाहिन्छ र अझै कति बचाउने हिसाब गर्नुहोस्।",
};

export default async function EmergencyFundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🛟 {isEn ? "Emergency Fund Calculator" : "Emergency Fund Calculator"}
      </h1>
      <p className="mt-2 text-gray-600">
        {isEn
          ? "Work out how big an emergency fund you need and how much more to save — the safety layer for when SSF/insurance limits fall short."
          : "कति आकस्मिक कोष चाहिन्छ र अझै कति बचाउने पत्ता लगाउनुहोस् — SSF/बीमाको Limit नपुग्दाको सुरक्षा Layer।"}
      </p>
      <div className="mt-8">
        <EmergencyFundCalculator />
      </div>
    </div>
  );
}
