import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";

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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🤝 {isEn ? "Assistance Request" : "सहायता अनुरोध"}
      </h1>
      <p className="mt-2 text-gray-600">
        {isEn
          ? "Fill in the form — you'll get a reference number right away, and our team will contact you."
          : "फाराम भर्नुहोस् — reference number तुरुन्तै पाउनुहुनेछ र हाम्रो टोलीले तपाईंलाई सम्पर्क गर्नेछ।"}
      </p>
      <div className="mt-8">
        <LeadForm initialService={service} />
      </div>
    </div>
  );
}
