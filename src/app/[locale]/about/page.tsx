import type { Metadata } from "next";
import { legalDocs } from "@/content/legal";
import { LegalDocPage } from "@/components/legal-doc";

const doc = legalDocs["about"];

export const metadata: Metadata = { title: doc.title };

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  return (
    <div>
      {/* Founder */}
      <div className="mx-auto max-w-3xl px-4 pt-10">
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-primary-100 bg-gradient-to-b from-primary-50 to-white p-6 sm:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/rabin-paudel.png"
            alt="Rabin Paudel — Founder, Digital Solution / SSF Educator"
            className="h-36 w-36 rounded-2xl object-cover shadow"
          />
          <div className="text-center sm:text-left">
            <p className="text-xl font-bold text-primary-900">Rabin Paudel</p>
            <p className="text-sm text-gray-600">
              {isEn
                ? "Founder, Digital Solution · SSF Educator"
                : "संस्थापक, Digital Solution · SSF Educator"}
            </p>
            <p className="mt-2 text-sm text-gray-700">
              {isEn
                ? "An educator who has helped thousands of Nepalis understand the Social Security Fund through dozens of educational videos on YouTube — SSF Guide Nepal was born from that experience."
                : "YouTube मा SSF सम्बन्धी दर्जनौँ शैक्षिक भिडियोमार्फत हजारौँ नेपालीलाई सामाजिक सुरक्षा कोष बुझाउँदै आएका शिक्षक — यही अनुभवबाट SSF Guide Nepal जन्मियो।"}
            </p>
            <a
              href="https://digitalsolutionnepal.com"
              target="_blank"
              rel="noopener"
              className="mt-2 inline-block text-sm font-semibold text-primary-700 underline"
            >
              digitalsolutionnepal.com ↗
            </a>
          </div>
        </div>
      </div>
      <LegalDocPage doc={doc} locale={locale} />
    </div>
  );
}
