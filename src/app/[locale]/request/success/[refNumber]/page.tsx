import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "अनुरोध प्राप्त भयो",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ refNumber: string }>;
}) {
  const { refNumber } = await params;
  const lead = await prisma.lead.findUnique({
    where: { refNumber },
    include: { service: true },
  });
  if (!lead) notFound();

  const masked = lead.mobile.replace(/.(?=.{4})/g, "•");
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  return (
    <div className="mx-auto max-w-xl px-4 py-14 text-center">
      <div className="text-5xl">✅</div>
      <h1 className="mt-4 text-2xl font-bold text-primary-900">
        अनुरोध सफलतापूर्वक पेश भयो
      </h1>

      <div className="mt-6 rounded-xl border-2 border-primary-200 bg-primary-50 p-6">
        <p className="text-sm text-gray-600">तपाईंको Reference Number</p>
        <p className="mt-1 text-2xl font-bold tracking-wide text-primary-800">
          {lead.refNumber}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          यो नम्बर सुरक्षित राख्नुहोस् — status जाँच्न चाहिन्छ।
        </p>
      </div>

      <div className="mt-6 space-y-1 text-sm text-gray-700">
        <p>सेवा: <strong>{lead.service.titleNe}</strong></p>
        <p>सम्पर्क नम्बर: <strong>{masked}</strong></p>
        <p>हाम्रो टोलीले सामान्यतया <strong>२४ घण्टाभित्र</strong> सम्पर्क गर्नेछ।</p>
      </div>

      {wa && (
        <a
          href={`https://wa.me/${wa}?text=${encodeURIComponent(`नमस्कार, मेरो SSF सहायता अनुरोध: ${lead.refNumber}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          💬 WhatsApp मा कुरा गर्नुहोस्
        </a>
      )}

      <p className="mt-6 rounded-lg bg-action-50 px-4 py-3 text-sm text-gray-700">
        ⚠️ Digital Solution ले फोन वा Chat मार्फत तपाईंको OTP, Password वा Banking
        PIN माग्दैन।
      </p>

      <p className="mt-6 text-sm">
        <Link href="/track" className="text-primary-700 underline">
          Status जाँच्नुहोस्
        </Link>{" "}
        ·{" "}
        <Link href="/" className="text-primary-700 underline">
          Home
        </Link>
      </p>
    </div>
  );
}
