import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { TakeHomeCalculator } from "@/components/take-home-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/take-home",
    title: "Take-home Salary Calculator Nepal — हातमा कति आउँछ?",
    description: "मासिक तलबबाट SSF (११%) र आयकर कटाएपछि हातमा कति आउँछ हिसाब गर्नुहोस् — रोजगारदाताले थप्ने २०% SSF सहित। आ.व. २०८३/८४ र २०८२/८३।",
  });
}

export default async function TakeHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Take-home Salary Calculator" : "Take-home Salary Calculator (हातमा तलब)";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="card"
        title={title}
        lead={
          isEn
            ? "See your real cash-in-hand after SSF (11%) and income tax — plus the 20% your employer adds into your SSF account on top."
            : "SSF (११%) र आयकर कटाएपछि तपाईंको हातमा वास्तवमा कति आउँछ हेर्नुहोस् — साथै रोजगारदाताले तपाईंकै SSF खातामा थप्ने २०%।"
        }
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <TakeHomeCalculator />
      </section>
    </div>
  );
}
