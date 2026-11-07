import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { WageOvertimeCalculator } from "@/components/wage-overtime-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/wage-overtime",
    title: "Daily Wage & Overtime Calculator Nepal (Labour Act 2074)",
    description: "मासिक तलबबाट दैनिक दर, घण्टा दर र १.५× ओभरटाइम रकम हिसाब गर्नुहोस् — श्रम ऐन २०७४ अनुसार।",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Daily Wage & Overtime Calculator" : "दैनिक ज्याला र ओभरटाइम Calculator";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="clock"
        title={title}
        lead={isEn ? "Find your daily rate, hourly rate, and 1.5× overtime pay under Nepal's Labour Act 2074." : "श्रम ऐन २०७४ अनुसार दैनिक दर, घण्टा दर र १.५× ओभरटाइम रकम पत्ता लगाउनुहोस्।"}
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <WageOvertimeCalculator />
      </section>
    </div>
  );
}
