import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { PensionTopUpCalculator } from "@/components/pension-topup-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/pension-topup",
    title: "Pension Top-Up Simulator — SSF पेन्सन नपुगे कति SIP?",
    description: "अवकाशमा चाहिने मासिक आम्दानी र SSF पेन्सनबीचको खाडल पुर्‍याउन मासिक कति SIP लगानी चाहिन्छ हिसाब गर्नुहोस्।",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Pension Top-Up Simulator" : "Pension Top-Up Simulator";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="coins"
        title={title}
        lead={isEn ? "If your SSF pension won't be enough, find the monthly SIP needed to cover the gap by retirement." : "SSF पेन्सन मात्र नपुगे, खाडल पुर्‍याउन अवकाशसम्म मासिक कति SIP चाहिन्छ पत्ता लगाउनुहोस्।"}
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <PensionTopUpCalculator />
      </section>
    </div>
  );
}
