import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { LoanCalculator } from "@/components/loan-calculator";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/calculators/loan",
    title: "Loan / EMI Calculator — मासिक किस्ता कति?",
    description: "घर, शैक्षिक वा SSF विशेष सापटीको मासिक EMI, कुल ब्याज र कुल भुक्तानी हिसाब गर्नुहोस् — रकम, ब्याज र अवधि राखेर।",
  });
}

export default async function LoanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Loan / EMI Calculator" : "Loan / EMI Calculator";
  return (
    <div>
      <PageHero
        width="narrow"
        icon="building"
        title={title}
        lead={
          isEn
            ? "Find your monthly EMI, total interest, and total payment for any loan — including SSF home, education, and special loans."
            : "कुनै पनि सापटीको मासिक EMI, कुल ब्याज र कुल भुक्तानी थाहा पाउनुहोस् — SSF घर, शैक्षिक र विशेष सापटीसमेत।"
        }
        crumbs={[
          { label: isEn ? "Home" : "गृहपृष्ठ", href: "/" },
          { label: "Financial Tools", href: "/calculators" },
          { label: title },
        ]}
      />
      <section className="container-narrow py-10">
        <LoanCalculator />
      </section>
    </div>
  );
}
