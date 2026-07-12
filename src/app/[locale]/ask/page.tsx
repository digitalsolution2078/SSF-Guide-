import type { Metadata } from "next";
import { SsfChat } from "@/components/ssf-chat";

export const metadata: Metadata = {
  title: "Ask SSF AI — प्रश्न सोध्नुहोस्",
  description:
    "SSF सम्बन्धी प्रश्नको स्रोतसहितको उत्तर पाउनुहोस् — contribution, pension, KYC, claim सबै विषयमा।",
  robots: { index: false },
};

export default async function AskPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🤖 Ask SSF AI
      </h1>
      <p className="mt-2 text-gray-600">
        {isEn
          ? "Answers based on a verified knowledge base — with sources and verification dates. You can ask in Nepali or English."
          : "Verified knowledge base मा आधारित उत्तर — स्रोत र प्रमाणित मितिसहित।"}
      </p>
      <div className="mt-6">
        <SsfChat />
      </div>
    </div>
  );
}
