import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { EmergencyFundCalculator } from "@/components/emergency-fund-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/emergency-fund",
    title: "Emergency Fund Calculator — कति आकस्मिक बचत चाहिन्छ?",
    description: "जागिर गुम्ने, medical copayment र आकस्मिक खर्च धान्न कति आकस्मिक कोष चाहिन्छ र अझै कति बचाउने हिसाब गर्नुहोस्।",
  });
}

export default async function EmergencyFundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Emergency Fund Calculator" : "Emergency Fund Calculator";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="shield"
        title={title}
        lead={
          isEn
            ? "Work out how big an emergency fund you need and how much more to save — the safety layer for when SSF/insurance limits fall short."
            : "कति आकस्मिक कोष चाहिन्छ र अझै कति बचाउने पत्ता लगाउनुहोस् — SSF/बीमाको Limit नपुग्दाको सुरक्षा Layer।"
        }
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <EmergencyFundCalculator />
      </section>
    </div>
  );
}
