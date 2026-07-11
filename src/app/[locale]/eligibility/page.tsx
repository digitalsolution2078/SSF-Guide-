import type { Metadata } from "next";
import { EligibilityWizard } from "@/components/eligibility-wizard";

export const metadata: Metadata = {
  title: "SSF Eligibility Checker — तपाईं कुन सुविधाका लागि योग्य?",
  description:
    "केही सामान्य प्रश्नको उत्तर दिनुहोस् — pension, उपचार, मातृत्व, दुर्घटना वा आश्रित परिवार सुविधाका लागि तपाईंको प्रारम्भिक योग्यता र document checklist पाउनुहोस्।",
};

export default function EligibilityPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        ✅ Eligibility Checker
      </h1>
      <p className="mt-2 text-gray-600">
        तपाईं कुन SSF सुविधा वा प्रक्रियाका लागि योग्य हुन सक्नुहुन्छ? केही
        सामान्य प्रश्नको उत्तर दिनुहोस् — हामी preliminary guidance र document
        checklist दिनेछौँ। कुनै व्यक्तिगत विवरण मागिँदैन।
      </p>
      <div className="mt-8">
        <EligibilityWizard />
      </div>
    </div>
  );
}
