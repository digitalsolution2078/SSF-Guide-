import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { FdIncomeCalculator } from "@/components/fd-income-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/fd-income",
    title: "FD Monthly Income Calculator Nepal — ब्याजबाट मासिक कति?",
    description: "Fixed Deposit को ब्याजबाट मासिक/त्रैमासिक कति आम्दानी आउँछ (ब्याज कर कटाएर) हिसाब गर्नुहोस् — अवकाशप्राप्तका लागि उपयोगी।",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "FD Monthly Income Calculator" : "FD मासिक आम्दानी Calculator";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="coins"
        title={title}
        lead={isEn ? "For those living off Fixed Deposit interest — see your monthly/quarterly payout after interest tax, with the principal intact." : "Fixed Deposit को ब्याजमा जीविका चलाउनेका लागि — ब्याज कर कटाएपछि मासिक/त्रैमासिक कति, साँवा जस्ताको तस्तै।"}
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <FdIncomeCalculator />
      </section>
    </div>
  );
}
