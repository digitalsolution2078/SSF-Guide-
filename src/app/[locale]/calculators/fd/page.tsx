import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { FdCalculator } from "@/components/fd-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/fd",
    title: "FD / Lumpsum Calculator — एकमुष्ट रकम कति बढ्छ?",
    description: "Fixed Deposit वा एकमुष्ट लगानीको परिपक्व मूल्य र ब्याज हिसाब गर्नुहोस् — रकम, दर, अवधि र compounding आवृत्ति राखेर।",
  });
}

export default async function FdPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "FD / Lumpsum Calculator" : "FD / Lumpsum Calculator";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="landmark"
        title={title}
        lead={
          isEn
            ? "For a one-time deposit — see the maturity value and interest with your chosen compounding frequency."
            : "एकपटक जम्मा गर्ने रकमका लागि — रोजेको compounding आवृत्तिमा परिपक्व मूल्य र ब्याज हेर्नुहोस्।"
        }
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <FdCalculator />
      </section>
    </div>
  );
}
