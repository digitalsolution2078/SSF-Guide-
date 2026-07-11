import type { Metadata } from "next";
import { ForeignCalculator } from "@/components/foreign-calculator";

export const metadata: Metadata = {
  title: "Foreign Employment Contribution Calculator",
  description:
    "वैदेशिक रोजगारीमा हुनेका लागि SSF योगदान हिसाब — औद्योगिक न्यूनतम पारिश्रमिकको कम्तीमा २१.३३%।",
};

export default function ForeignCalculatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        Foreign Employment Contribution Calculator
      </h1>
      <p className="mt-2 text-gray-600">
        आधार रकम र अवधि राख्नुहोस् — मासिक योगदान, अवधिको जम्मा र योजना-बाँडफाँट
        देखिन्छ।
      </p>
      <div className="mt-8">
        <ForeignCalculator />
      </div>
    </div>
  );
}
