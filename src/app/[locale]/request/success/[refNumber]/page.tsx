import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/icons";
import { Callout, PageHero } from "@/components/ui";

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
  const waLink = "https://wa.me/9779748433699";

  return (
    <div>
      <PageHero
        width="narrow"
        icon="checkCircle"
        tone="primary"
        title="अनुरोध सफलतापूर्वक पेश भयो"
        crumbs={[{ label: "गृहपृष्ठ", href: "/" }, { label: "अनुरोध" }]}
      />

      <div className="container-narrow py-12">
        <Callout tone="success">
          हाम्रो टोलीले सामान्यतया <strong>२४ घण्टाभित्र</strong> सम्पर्क गर्नेछ।
        </Callout>

        <div className="card mt-6 p-6 text-center">
          <p className="text-sm text-ink-500">तपाईंको Reference Number</p>
          <p className="mt-1 font-display text-3xl font-bold tracking-wide text-primary-700">
            {lead.refNumber}
          </p>
          <p className="mt-2 text-xs text-ink-400">
            यो नम्बर सुरक्षित राख्नुहोस् — status जाँच्न चाहिन्छ।
          </p>
        </div>

        <dl className="surface mt-4 grid grid-cols-1 gap-3 p-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-500">सेवा</dt>
            <dd className="font-semibold text-ink-900">{lead.service.titleNe}</dd>
          </div>
          <div>
            <dt className="text-ink-500">सम्पर्क नम्बर</dt>
            <dd className="font-semibold text-ink-900">{masked}</dd>
          </div>
        </dl>

        {waLink && (
          <div className="mt-6 text-center">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-lg inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#1DA851]"
            >
              <Icon name="chat" size={18} />
              WhatsApp मा कुरा गर्नुहोस्
            </a>
          </div>
        )}

        <div className="mt-6">
          <Callout tone="warn">
            Digital Solution ले फोन वा Chat मार्फत तपाईंको OTP, Password वा Banking PIN माग्दैन।
          </Callout>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link href="/track" className="btn-outline">
            <Icon name="locate" size={16} />
            Status जाँच्नुहोस्
          </Link>
          <Link href="/" className="btn-ghost">
            <Icon name="home" size={16} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
