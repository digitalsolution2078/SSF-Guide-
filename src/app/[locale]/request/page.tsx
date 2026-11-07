import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "सहायता अनुरोध — Digital Solution",
  description:
    "SSF को KYC, registration, profile correction वा अन्य प्रक्रियामा Digital Solution को सहायता लिनुहोस् — reference number सहित।",
  robots: { index: false },
};

export default async function RequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const { service } = await searchParams;
  return (
    <div>
      <PageHero
        width="narrow"
        icon="send"
        eyebrow={isEn ? "Digital Solution" : "Digital Solution"}
        title={isEn ? "Assistance Request" : "सहायता अनुरोध"}
        lead={
          isEn
            ? "Fill in the form — you'll get a reference number right away, and our team will contact you."
            : "फाराम भर्नुहोस् — reference number तुरुन्तै पाउनुहुनेछ र हाम्रो टोलीले तपाईंलाई सम्पर्क गर्नेछ।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Request" : "अनुरोध" }]}
      />
      <div className="container-narrow py-12">
        <LeadForm initialService={service} />
      </div>
    </div>
  );
}
