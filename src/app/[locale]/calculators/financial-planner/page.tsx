import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { FinancialPlanner } from "@/components/financial-planner";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/financial-planner",
    title: "SSF Financial Planner — ६० वर्षमा कति pension?",
    description:
      "३० वर्ष योगदान गरे ६० वर्षमा कति मासिक pension आउँछ? तलब, उमेर र प्रतिफल दर (६–७%) राखेर आफ्नो SSF भविष्य projection गर्नुहोस्।",
  });
}

export default async function FinancialPlannerPage({
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
        icon="trending"
        title="SSF Financial Planner"
        lead="तपाईंको तलबको २०% pension कोषमा र ८.३३% अवकाश कोषमा जम्मा हुँदै प्रतिफलसहित बढ्दै जान्छ। ६० वर्षमा कति पुग्छ र मासिक pension कति आउँछ — तलका input मिलाएर हेर्नुहोस्।"
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: "SSF Financial Planner" },
        ]}
      />
      <section className="container-narrow py-10">
        <FinancialPlanner />
      </section>
    </div>
  );
}
