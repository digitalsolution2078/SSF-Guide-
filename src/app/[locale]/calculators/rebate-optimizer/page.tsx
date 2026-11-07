import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { RebateOptimizer } from "@/components/rebate-optimizer";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/rebate-optimizer",
    title: "Tax Rebate Optimizer Nepal — असारअघि कति लगानी गर्ने?",
    description: "SSF, बीमा र अवकाश कोषमा अझै कति लगानी गरे कर छुट अधिकतम हुन्छ पत्ता लगाउनुहोस् — आर्थिक वर्ष सकिनुअघि।",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Tax Rebate Optimizer" : "कर छुट Optimizer";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="percent"
        title={title}
        lead={isEn ? "Before the fiscal year ends, see how much more to invest in SSF, insurance, and retirement funds to maximize your legal deductions." : "आर्थिक वर्ष सकिनुअघि SSF, बीमा र अवकाश कोषमा अझै कति लगानी गरे कानुनी कर छुट अधिकतम हुन्छ हेर्नुहोस्।"}
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <RebateOptimizer />
      </section>
    </div>
  );
}
