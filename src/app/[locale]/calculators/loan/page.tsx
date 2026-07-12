import type { Metadata } from "next";
import { LoanCalculator } from "@/components/loan-calculator";

export const metadata: Metadata = {
  title: "Loan / EMI Calculator — मासिक किस्ता कति?",
  description:
    "घर, शैक्षिक वा SSF विशेष सापटीको मासिक EMI, कुल ब्याज र कुल भुक्तानी हिसाब गर्नुहोस् — रकम, ब्याज र अवधि राखेर।",
};

export default async function LoanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🏦 {isEn ? "Loan / EMI Calculator" : "Loan / EMI Calculator"}
      </h1>
      <p className="mt-2 text-gray-600">
        {isEn
          ? "Find your monthly EMI, total interest, and total payment for any loan — including SSF home, education, and special loans."
          : "कुनै पनि सापटीको मासिक EMI, कुल ब्याज र कुल भुक्तानी थाहा पाउनुहोस् — SSF घर, शैक्षिक र विशेष सापटीसमेत।"}
      </p>
      <div className="mt-8">
        <LoanCalculator />
      </div>
    </div>
  );
}
