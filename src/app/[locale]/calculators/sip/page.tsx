import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { SipCalculator } from "@/components/sip-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/sip",
    title: "SIP Calculator — मासिक लगानी कति बढ्छ?",
    description: "हरेक महिना निश्चित रकम लगानी (SIP) गर्दा वर्षौंमा कति बन्छ? रकम, अवधि र प्रतिफल राखेर compounding को असर हेर्नुहोस् — सरल शैक्षिक tool।",
  });
}

export default async function SipPage({
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
        title="SIP Calculator"
        lead={
          isEn
            ? "See how a fixed monthly investment can grow over the years through compounding. Enter the amount, period, and expected return — a simple, easy-to-understand tool for planning alongside your SSF savings."
            : "हरेक महिना निश्चित रकम लगानी गर्दा compounding का कारण वर्षौंमा कति बन्छ हेर्नुहोस्। रकम, अवधि र अपेक्षित प्रतिफल राख्नुहोस् — SSF बचतसँगै योजना बनाउन सजिलो, बुझ्न मिल्ने tool।"
        }
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: "SIP Calculator" },
        ]}
      />
      <section className="container-narrow py-10">
        <SipCalculator />
      </section>
    </div>
  );
}
