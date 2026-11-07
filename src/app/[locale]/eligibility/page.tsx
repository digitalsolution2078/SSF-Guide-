import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import { EligibilityWizard } from "@/components/eligibility-wizard";
import { PageHero } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return pageSeo({
    locale,
    path: "/eligibility",
    title: "SSF Eligibility Checker — तपाईं कुन सुविधाका लागि योग्य?",
    description: "केही सामान्य प्रश्नको उत्तर दिनुहोस् — pension, उपचार, मातृत्व, दुर्घटना वा आश्रित परिवार सुविधाका लागि तपाईंको प्रारम्भिक योग्यता र document checklist पाउनुहोस्।",
  });
}

export default async function EligibilityPage({
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
        icon="checkCircle"
        eyebrow={isEn ? "Self-check" : "स्व-जाँच"}
        title="Eligibility Checker"
        lead={
          isEn
            ? "Which SSF benefit or process might you be eligible for? Answer a few simple questions — we'll give you preliminary guidance and a document checklist. No personal details are collected."
            : "तपाईं कुन SSF सुविधा वा प्रक्रियाका लागि योग्य हुन सक्नुहुन्छ? केही सामान्य प्रश्नको उत्तर दिनुहोस् — हामी preliminary guidance र document checklist दिनेछौँ। कुनै व्यक्तिगत विवरण मागिँदैन।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: "Eligibility Checker" }]}
      />
      <section className="container-narrow py-10">
        <EligibilityWizard />
      </section>
    </div>
  );
}
