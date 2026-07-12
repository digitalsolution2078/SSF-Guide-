import type { Metadata } from "next";
import { legalDocs } from "@/content/legal";
import { LegalDocPage } from "@/components/legal-doc";

const doc = legalDocs["terms"];

export const metadata: Metadata = { title: doc.title };

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalDocPage doc={doc} locale={locale} />;
}
