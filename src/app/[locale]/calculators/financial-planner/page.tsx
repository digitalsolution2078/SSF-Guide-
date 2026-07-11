import type { Metadata } from "next";
import { FinancialPlanner } from "@/components/financial-planner";

export const metadata: Metadata = {
  title: "SSF Financial Planner — ६० वर्षमा कति pension?",
  description:
    "३० वर्ष योगदान गरे ६० वर्षमा कति मासिक pension आउँछ? तलब, उमेर र प्रतिफल दर (६–७%) राखेर आफ्नो SSF भविष्य projection गर्नुहोस्।",
};

export default function FinancialPlannerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        💰 SSF Financial Planner
      </h1>
      <p className="mt-2 text-gray-600">
        तपाईंको तलबको २०% pension कोषमा र ८.३३% अवकाश कोषमा जम्मा हुँदै
        प्रतिफलसहित बढ्दै जान्छ। ६० वर्षमा कति पुग्छ र मासिक pension कति आउँछ —
        तलका input मिलाएर हेर्नुहोस्।
      </p>
      <div className="mt-8">
        <FinancialPlanner />
      </div>
    </div>
  );
}
