import type { Metadata } from "next";
import { legalDocs } from "@/content/legal";
import { LegalDocPage } from "@/components/legal-doc";

const doc = legalDocs["report-correction"];

export const metadata: Metadata = { title: doc.title };

export default function Page() {
  return <LegalDocPage doc={doc} />;
}
