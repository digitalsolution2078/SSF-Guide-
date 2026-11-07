import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { DashainBonusCalculator } from "@/components/dashain-bonus-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/dashain-bonus",
    title: "Dashain Bonus Calculator — बोनसमा कति कर, हातमा कति?",
    description: "दशैँ/चाडपर्व बोनस (१३औँ महिना तलब) मा कति आयकर लाग्छ र हातमा कति आउँछ हिसाब गर्नुहोस् — मार्जिनल दरसहित।",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Dashain Bonus Calculator" : "दशैँ बोनस Calculator";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="sparkles"
        title={title}
        lead={isEn ? "See how much tax your festival (13th-month) bonus attracts and what actually lands in hand." : "दशैँ/चाडको बोनस (१३औँ महिना) मा कति कर लाग्छ र हातमा कति आउँछ हेर्नुहोस्।"}
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <DashainBonusCalculator />
      </section>
    </div>
  );
}
