import type { Metadata } from "next";
import { RebateOptimizer } from "@/components/rebate-optimizer";

export const metadata: Metadata = {
  title: "Tax Rebate Optimizer Nepal — असारअघि कति लगानी गर्ने?",
  description:
    "SSF, बीमा र अवकाश कोषमा अझै कति लगानी गरे कर छुट अधिकतम हुन्छ पत्ता लगाउनुहोस् — आर्थिक वर्ष सकिनुअघि।",
};

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">🧮 {isEn ? "Tax Rebate Optimizer" : "कर छुट Optimizer"}</h1>
      <p className="mt-2 text-gray-600">{isEn ? "Before the fiscal year ends, see how much more to invest in SSF, insurance, and retirement funds to maximize your legal deductions." : "आर्थिक वर्ष सकिनुअघि SSF, बीमा र अवकाश कोषमा अझै कति लगानी गरे कानुनी कर छुट अधिकतम हुन्छ हेर्नुहोस्।"}</p>
      <div className="mt-8"><RebateOptimizer /></div>
    </div>
  );
}
