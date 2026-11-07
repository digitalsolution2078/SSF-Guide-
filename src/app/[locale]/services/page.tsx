import type { Metadata } from "next";
import { services } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { pageSeo } from "@/lib/seo";
import { Icon, type IconName } from "@/components/icons";
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
    path: "/services",
    title: isEn ? "Our Services" : "हाम्रा सेवाहरू",
    description: isEn
      ? "SSF KYC, registration, profile correction and employer onboarding — expert help from Digital Solution."
      : "SSF को KYC, registration, profile correction र employer onboarding — Digital Solution को विशेषज्ञ सहायता।",
  });
}

/** Pick an icon from the service slug (kyc → user, registration → file, correction → refresh, employer → building). */
function serviceIcon(slug: string): IconName {
  if (slug.includes("employer")) return "building";
  if (slug.includes("kyc")) return "user";
  if (slug.includes("correction")) return "refresh";
  if (slug.includes("registration")) return "file";
  return "briefcase";
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div>
      <PageHero
        icon="briefcase"
        eyebrow={isEn ? "Assistance" : "सहायता"}
        title={isEn ? "Our Services" : "हाम्रा सेवाहरू"}
        lead={
          isEn
            ? "Our free guides help you understand the process yourself — and if you need help doing it, we're here. An independent service provider; not an official SSF office."
            : "प्रक्रिया आफैँ बुझ्न हाम्रा free guides छन् — गर्न सहायता चाहिए हामी छौँ। स्वतन्त्र सेवा प्रदायक; आधिकारिक SSF कार्यालय होइनौँ।"
        }
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Services" : "सेवाहरू" }]}
      />

      <section className="container-page py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="card card-hover group block p-5">
              <div className="flex items-start gap-3.5">
                <span className="icon-tile">
                  <Icon name={serviceIcon(s.slug)} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug text-ink-900 group-hover:text-primary-700">
                    {isEn ? s.titleEn : s.titleNe}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                    {isEn && s.en ? s.en.description : s.description}
                  </p>
                </div>
                <Icon
                  name="chevronRight"
                  size={18}
                  className="mt-1 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-primary-600"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
