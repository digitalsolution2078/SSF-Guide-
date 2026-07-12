import type { Metadata } from "next";
import { PensionTopUpCalculator } from "@/components/pension-topup-calculator";

export const metadata: Metadata = {
  title: "Pension Top-Up Simulator — SSF पेन्सन नपुगे कति SIP?",
  description:
    "अवकाशमा चाहिने मासिक आम्दानी र SSF पेन्सनबीचको खाडल पुर्‍याउन मासिक कति SIP लगानी चाहिन्छ हिसाब गर्नुहोस्।",
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">🎯 {isEn ? "Pension Top-Up Simulator" : "Pension Top-Up Simulator"}</h1>
      <p className="mt-2 text-gray-600">{isEn ? "If your SSF pension won't be enough, find the monthly SIP needed to cover the gap by retirement." : "SSF पेन्सन मात्र नपुगे, खाडल पुर्‍याउन अवकाशसम्म मासिक कति SIP चाहिन्छ पत्ता लगाउनुहोस्।"}</p>
      <div className="mt-8"><PensionTopUpCalculator /></div>
    </div>
  );
}
