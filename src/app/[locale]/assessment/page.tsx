import type { Metadata } from "next";
import { SsfAssessment } from "@/components/ssf-assessment";

export const metadata: Metadata = {
  title: "SSF Assessment — तपाईंलाई SSF कति चाहिन्छ?",
  description:
    "१० प्रश्नको उत्तर दिनुहोस् — तपाईंको रोजगारी, बचत, परिवार र जोखिम हेरेर 'तपाईंलाई SSF X/10 चाहिन्छ' भन्ने व्यक्तिगत नतिजा पाउनुहोस्।",
};

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        📊 SSF Assessment
      </h1>
      <p className="mt-2 text-gray-600">
        {isEn
          ? "10 simple questions — find out how much you need SSF for your situation, with reasons. No personal details are collected."
          : "१० सजिला प्रश्न — तपाईंको अवस्थाअनुसार SSF कति आवश्यक छ, कारणसहित थाहा पाउनुहोस्। कुनै व्यक्तिगत विवरण मागिँदैन।"}
      </p>
      <div className="mt-8">
        <SsfAssessment />
      </div>
    </div>
  );
}
