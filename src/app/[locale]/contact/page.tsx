import type { Metadata } from "next";
import { legalDocs } from "@/content/legal";
import { LegalDocPage } from "@/components/legal-doc";
import { pageSeo } from "@/lib/seo";

const doc = legalDocs["contact"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return pageSeo({
    locale,
    path: "/contact",
    title: isEn && doc.titleEn ? doc.titleEn : doc.title,
    description: isEn
      ? "Contact Digital Solution for SSF help — KYC, registration, corrections and employer onboarding. Pokhara, Nepal."
      : "SSF सहायता — KYC, registration, correction र employer onboarding का लागि Digital Solution लाई सम्पर्क गर्नुहोस्। पोखरा, नेपाल।",
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalDocPage doc={doc} locale={locale} />;
}
