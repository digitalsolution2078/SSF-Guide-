import type { Metadata } from "next";
import { FdCalculator } from "@/components/fd-calculator";

export const metadata: Metadata = {
  title: "FD / Lumpsum Calculator — एकमुष्ट रकम कति बढ्छ?",
  description:
    "Fixed Deposit वा एकमुष्ट लगानीको परिपक्व मूल्य र ब्याज हिसाब गर्नुहोस् — रकम, दर, अवधि र compounding आवृत्ति राखेर।",
};

export default async function FdPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🏛️ {isEn ? "FD / Lumpsum Calculator" : "FD / Lumpsum Calculator"}
      </h1>
      <p className="mt-2 text-gray-600">
        {isEn
          ? "For a one-time deposit — see the maturity value and interest with your chosen compounding frequency."
          : "एकपटक जम्मा गर्ने रकमका लागि — रोजेको compounding आवृत्तिमा परिपक्व मूल्य र ब्याज हेर्नुहोस्।"}
      </p>
      <div className="mt-8">
        <FdCalculator />
      </div>
    </div>
  );
}
