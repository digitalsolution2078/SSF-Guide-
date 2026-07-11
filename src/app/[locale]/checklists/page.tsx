import type { Metadata } from "next";
import { checklists } from "@/content/checklists";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Document Checklist Center",
  description:
    "SSF का हरेक प्रक्रियाका लागि आवश्यक कागजातको checklist — सूचीकरण, KYC, claim र correction।",
};

export default function ChecklistIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        📋 Document Checklist Center
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        प्रक्रिया रोज्नुहोस् — आवश्यक कागजात, कहाँ बुझाउने र सामान्य गल्तीको सूची
        पाउनुहुनेछ। Checklist print गर्न पनि मिल्छ।
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {checklists.map((c) => (
          <Link
            key={c.slug}
            href={`/checklists/${c.slug}`}
            className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm transition hover:border-primary-400"
          >
            <p className="font-semibold text-primary-900">{c.processName}</p>
            <p className="mt-1 text-sm text-gray-600">{c.applicableUser}</p>
            <p className="mt-2 text-xs text-gray-400">
              {c.items.length} वटा कागजात/विवरण
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
