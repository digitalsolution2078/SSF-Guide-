import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { RetirementGoalCalculator } from "@/components/retirement-goal-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/retirement-goal",
    title: "Retirement Goal Calculator — ६० वर्षमा कति चाहिन्छ?",
    description: "६० वर्षमा आफ्नो जीवनस्तर कायम राख्न कति कोष चाहिन्छ र अहिलेदेखि मासिक कति बचाउने हिसाब गर्नुहोस् — SSF pension सँग तुलना।",
  });
}

export default async function RetirementGoalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Retirement Goal Calculator" : "Retirement Goal Calculator";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="star"
        title={title}
        lead={
          isEn
            ? "Estimate the corpus you'll need at 60 to sustain your lifestyle, and how much to save monthly — then see how much your SSF pension already covers."
            : "६० वर्षमा जीवनस्तर कायम राख्न चाहिने कोष र मासिक कति बचाउने अनुमान गर्नुहोस् — अनि SSF pension ले कति ढाक्छ हेर्नुहोस्।"
        }
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <RetirementGoalCalculator />
      </section>
    </div>
  );
}
