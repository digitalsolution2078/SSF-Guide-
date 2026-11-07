import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { GoalSipCalculator } from "@/components/goal-sip-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/goal-sip",
    title: "Goal SIP Calculator — लक्ष्यका लागि मासिक कति लगानी?",
    description: "घर, शिक्षा वा कुनै लक्ष्य रकम पुर्‍याउन हरेक महिना कति लगानी गर्नुपर्छ हिसाब गर्नुहोस् — reverse SIP।",
  });
}

export default async function GoalSipPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Goal SIP Calculator" : "Goal SIP Calculator";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="star"
        title={title}
        lead={
          isEn
            ? "Pick a goal amount and timeline — see exactly how much to invest each month to reach it."
            : "लक्ष्य रकम र समय छान्नुहोस् — त्यो पुर्‍याउन हरेक महिना ठ्याक्कै कति लगानी गर्नुपर्छ हेर्नुहोस्।"
        }
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <GoalSipCalculator />
      </section>
    </div>
  );
}
