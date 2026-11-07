import type { Metadata } from "next";
import { SsfChat } from "@/components/ssf-chat";
import { PageHero } from "@/components/ui";

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
    <div>
      <PageHero
        width="narrow"
        icon="chat"
        eyebrow="AI"
        title="Ask SSF AI"
        lead={
          isEn
            ? "Answers based on a verified knowledge base — with sources and verification dates. You can ask in Nepali or English."
            : "Verified knowledge base मा आधारित उत्तर — स्रोत र प्रमाणित मितिसहित।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: "Ask SSF AI" }]}
      />
      <div className="container-narrow py-8 md:py-10">
        <SsfChat />
      </div>
    </div>
  );
}
