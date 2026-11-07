import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { ContributionCalculator } from "@/components/contribution-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/contribution",
    title: "Employee–Employer Contribution Calculator",
    description: "आफ्नो आधारभूत पारिश्रमिकबाट SSF मा कति योगदान जम्मा हुन्छ हिसाब गर्नुहोस् — श्रमिक ११% + रोजगारदाता २०% = ३१%।",
  });
}

export default function ContributionCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const isEn = locale === "en";

  return (
    <div>
      <PageHero
        width="narrow"
        icon="percent"
        title="Employee–Employer Contribution Calculator"
        lead="आधारभूत पारिश्रमिक राख्नुहोस् — श्रमिक ११% + रोजगारदाता २०% = कुल ३१% कसरी बाँडिन्छ तुरुन्तै देखिन्छ।"
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: "Employee–Employer Contribution Calculator" },
        ]}
      />
      <section className="container-narrow py-10">
        <ContributionCalculator />
      </section>
    </div>
  );
}
