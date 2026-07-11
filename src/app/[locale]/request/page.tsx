import type { Metadata } from "next";
import { LeadForm } from "@/components/lead-form";

export const metadata: Metadata = {
  title: "सहायता अनुरोध — Digital Solution",
  description:
    "SSF को KYC, registration, profile correction वा अन्य प्रक्रियामा Digital Solution को सहायता लिनुहोस् — reference number सहित।",
  robots: { index: false },
};

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🤝 सहायता अनुरोध
      </h1>
      <p className="mt-2 text-gray-600">
        फाराम भर्नुहोस् — reference number तुरुन्तै पाउनुहुनेछ र हाम्रो टोलीले
        तपाईंलाई सम्पर्क गर्नेछ।
      </p>
      <div className="mt-8">
        <LeadForm initialService={service} />
      </div>
    </div>
  );
}
