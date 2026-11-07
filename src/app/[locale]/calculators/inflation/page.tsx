import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { InflationCalculator } from "@/components/inflation-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/inflation",
    title: "Inflation Calculator — पैसाको किन्ने क्षमता",
    description: "मुद्रास्फीतिले आजको रकम भविष्यमा कति पर्छ र कति मूल्यको हुन्छ देखाउँछ — किन दीर्घकालीन बचत जरुरी छ बुझ्नुहोस्।",
  });
}

export default async function InflationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Inflation Calculator" : "Inflation Calculator";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="activity"
        title={title}
        lead={
          isEn
            ? "See how inflation raises future costs and erodes the value of idle cash — and why long-term, inflation-adjusted savings matter."
            : "मुद्रास्फीतिले भविष्यको खर्च कसरी बढाउँछ र यत्तिकै राखेको नगदको मूल्य कसरी घटाउँछ हेर्नुहोस् — किन दीर्घकालीन बचत जरुरी छ।"
        }
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <InflationCalculator />
      </section>
    </div>
  );
}
