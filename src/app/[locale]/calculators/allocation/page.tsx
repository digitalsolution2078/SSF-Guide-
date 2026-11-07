import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { AllocationCalculator } from "@/components/allocation-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/allocation",
    title: "31% Contribution Breakdown",
    description:
      "SSF मा जम्मा हुने ३१% रकम चार योजनामा कसरी बाँडिन्छ हेर्नुहोस् — १.२०% / ०.८०% / ०.६७% / २८.३३% (५औँ संशोधन)।",
  });
}

export default async function AllocationCalculatorPage({
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
        icon="layers"
        title="31% Contribution Breakdown"
        lead="तपाईंको तलबबाट जम्मा भएको रकम कुन योजनामा कति जान्छ — रकम र प्रतिशतसहित।"
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: "31% Contribution Breakdown" },
        ]}
      />
      <section className="container-narrow py-10">
        <AllocationCalculator />
      </section>
    </div>
  );
}
