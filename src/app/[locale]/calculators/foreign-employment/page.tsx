import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { ForeignCalculator } from "@/components/foreign-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/foreign-employment",
    title: "Foreign Employment Contribution Calculator",
    description:
      "वैदेशिक रोजगारीमा हुनेका लागि SSF योगदान हिसाब — औद्योगिक न्यूनतम पारिश्रमिकको कम्तीमा २१.३३%।",
  });
}

export default async function ForeignCalculatorPage({
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
        icon="plane"
        title="Foreign Employment Contribution Calculator"
        lead="आधार रकम र अवधि राख्नुहोस् — मासिक योगदान, अवधिको जम्मा र योजना-बाँडफाँट देखिन्छ।"
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: "Foreign Employment Contribution Calculator" },
        ]}
      />
      <section className="container-narrow py-10">
        <ForeignCalculator />
      </section>
    </div>
  );
}
