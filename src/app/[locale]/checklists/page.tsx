import type { Metadata } from "next";
import { checklists } from "@/content/checklists";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/ui";

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
    <div>
      <PageHero
        icon="list"
        eyebrow={isEn ? "Documents" : "कागजात"}
        title="Document Checklist Center"
        lead={
          isEn
            ? "Pick a process — you'll get the required documents, where to submit them, and a list of common mistakes. Checklists can be printed too."
            : "प्रक्रिया रोज्नुहोस् — आवश्यक कागजात, कहाँ बुझाउने र सामान्य गल्तीको सूची पाउनुहुनेछ। Checklist print गर्न पनि मिल्छ।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: "Checklists" }]}
      />

      <section className="container-page py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {checklists.map((c) => (
            <Link key={c.slug} href={`/checklists/${c.slug}`} className="card card-hover group flex items-start gap-3.5 p-5">
              <span className="icon-tile">
                <Icon name="list" size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-snug text-ink-900 group-hover:text-primary-700">
                  {isEn && c.en ? c.en.processName : c.processName}
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-ink-500">
                  {isEn && c.en ? c.en.applicableUser : c.applicableUser}
                </span>
                <span className="mt-2 block text-xs text-ink-400">
                  {isEn
                    ? `${c.items.length} documents/details`
                    : `${c.items.length} वटा कागजात/विवरण`}
                </span>
              </span>
              <Icon
                name="chevronRight"
                size={18}
                className="mt-1 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
