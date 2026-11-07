import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { NetToGrossCalculator } from "@/components/net-to-gross-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/net-to-gross",
    title: "Net to Gross Salary Calculator Nepal — करार तलब कति लेख्ने?",
    description: "हातमा चाहिएको तलबबाट करारमा लेख्ने कुल (gross) तलब कति हुनुपर्छ हिसाब गर्नुहोस् — SSF ११% र आयकरसहित। दुई-तर्फी (gross↔net)।",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Net ↔ Gross Salary Converter" : "Net ↔ Gross तलब Converter";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="refresh"
        title={title}
        lead={isEn ? "Type a desired take-home and get the gross salary to write in the contract — or go the other way. Includes SSF and income tax." : "हातमा चाहिएको तलब लेख्नुहोस्, करारमा लेख्ने कुल तलब पाउनुहोस् — वा उल्टो। SSF र आयकरसहित।"}
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <NetToGrossCalculator />
      </section>
    </div>
  );
}
