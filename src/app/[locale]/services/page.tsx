import type { Metadata } from "next";
import { services } from "@/content/services";
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
    path: "/services",
    title: isEn ? "Our Services" : "हाम्रा सेवाहरू",
    description: isEn
      ? "SSF KYC, registration, profile correction and employer onboarding — expert help from Digital Solution."
      : "SSF को KYC, registration, profile correction र employer onboarding — Digital Solution को विशेषज्ञ सहायता।",
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900 md:text-3xl">
        🤝 {isEn ? "Our Services" : "हाम्रा सेवाहरू"}
      </h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        {isEn
          ? "Our free guides help you understand the process yourself — and if you need help doing it, we're here. An independent service provider; not an official SSF office."
          : "प्रक्रिया आफैँ बुझ्न हाम्रा free guides छन् — गर्न सहायता चाहिए हामी छौँ। स्वतन्त्र सेवा प्रदायक; आधिकारिक SSF कार्यालय होइनौँ।"}
      </p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm transition hover:border-primary-400"
          >
            <p className="font-semibold text-primary-900">
              {isEn ? s.titleEn : s.titleNe}
            </p>
            <p className="mt-2 text-sm text-gray-600">
              {isEn && s.en ? s.en.description : s.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
