import type { Metadata } from "next";
import { checklists } from "@/content/checklists";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/checklists",
    title: isEn ? "Document Checklist Center" : "Document Checklist Center — कागजात सूची",
    description: isEn
      ? "Required-document checklists for every SSF process — registration, KYC, claims and correction."
      : "SSF का हरेक प्रक्रियाका लागि आवश्यक कागजातको checklist — सूचीकरण, KYC, claim र correction।",
  });
}

export default async function ChecklistIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        📋 Document Checklist Center
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        {isEn
          ? "Pick a process — you'll get the required documents, where to submit them, and a list of common mistakes. Checklists can be printed too."
          : "प्रक्रिया रोज्नुहोस् — आवश्यक कागजात, कहाँ बुझाउने र सामान्य गल्तीको सूची पाउनुहुनेछ। Checklist print गर्न पनि मिल्छ।"}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {checklists.map((c) => (
          <Link
            key={c.slug}
            href={`/checklists/${c.slug}`}
            className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm transition hover:border-primary-400"
          >
            <p className="font-semibold text-primary-900">
              {isEn && c.en ? c.en.processName : c.processName}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {isEn && c.en ? c.en.applicableUser : c.applicableUser}
            </p>
            <p className="mt-2 text-xs text-gray-400">
              {isEn
                ? `${c.items.length} documents/details`
                : `${c.items.length} वटा कागजात/विवरण`}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
