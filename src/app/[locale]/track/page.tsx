import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { Icon } from "@/components/icons";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "अनुरोधको Status जाँच्नुहोस्",
  robots: { index: false },
};
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: "अनुरोध प्राप्त भयो",
  CONTACT_PENDING: "सम्पर्कको पर्खाइमा",
  CONTACTED: "सम्पर्क भइसक्यो",
  INFO_REQUIRED: "थप जानकारी आवश्यक",
  CONVERTED: "सेवा प्रक्रियामा",
  CLOSED: "बन्द भयो",
};

const STATUS_LABELS_EN: Record<string, string> = {
  RECEIVED: "Request received",
  CONTACT_PENDING: "Awaiting contact",
  CONTACTED: "Contacted",
  INFO_REQUIRED: "More information needed",
  CONVERTED: "Service in progress",
  CLOSED: "Closed",
};

/** Badge tone per lead status. */
const STATUS_BADGE: Record<string, string> = {
  RECEIVED: "badge-primary",
  CONTACT_PENDING: "badge-action",
  CONTACTED: "badge-primary",
  INFO_REQUIRED: "badge-action",
  CONVERTED: "badge-health",
  CLOSED: "badge-neutral",
};

export default async function TrackPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string; mobile?: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";
  const { ref = "", mobile = "" } = await searchParams;
  let result: { found: boolean; status?: string; service?: string } | null =
    null;

  if (ref && mobile) {
    const lead = await prisma.lead.findUnique({
      where: { refNumber: ref.trim().toUpperCase() },
      include: { service: true },
    });
    // generic failure on mismatch — no existence leak
    result =
      lead && lead.mobile.replace(/\D/g, "").endsWith(mobile.replace(/\D/g, "").slice(-10))
        ? { found: true, status: lead.status, service: lead.service.titleNe }
        : { found: false };
  }

  return (
    <div>
      <PageHero
        width="narrow"
        icon="locate"
        eyebrow={isEn ? "Digital Solution" : "Digital Solution"}
        title={isEn ? "Request Status" : "अनुरोधको Status"}
        crumbs={[{ label: isEn ? "Home" : "गृहपृष्ठ", href: "/" }, { label: isEn ? "Track" : "Status" }]}
      />

      <div className="container-narrow py-12">
        <form method="get" className="card space-y-4 p-6">
          <label className="block text-sm font-medium text-ink-700">
            Reference Number
            <input
              name="ref"
              defaultValue={ref}
              required
              placeholder="DS-SSF-2026-000123"
              className="input mt-1.5"
            />
          </label>
          <label className="block text-sm font-medium text-ink-700">
            {isEn ? "Mobile number (as given in the form)" : "Mobile नम्बर (फाराममा दिएकै)"}
            <input
              name="mobile"
              defaultValue={mobile}
              required
              inputMode="tel"
              className="input mt-1.5"
            />
          </label>
          <button type="submit" className="btn-primary btn-lg w-full">
            <Icon name="search" size={18} />
            {isEn ? "Check" : "जाँच्नुहोस्"}
          </button>
        </form>

        {result &&
          (result.found ? (
            <div className="surface mt-6 p-6 text-center">
              <p className="text-sm text-ink-500">{result.service}</p>
              <p className="mt-3">
                <span className={`${STATUS_BADGE[result.status!] ?? "badge-neutral"} px-3.5 py-1.5 text-sm`}>
                  {(isEn ? STATUS_LABELS_EN : STATUS_LABELS)[result.status!] ?? result.status}
                </span>
              </p>
            </div>
          ) : (
            <p className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
              <span>
                {isEn
                  ? "Details didn't match — check the reference number and mobile number, then try again."
                  : "विवरण मिलेन — reference number र mobile नम्बर जाँचेर पुनः प्रयास गर्नुहोस्।"}
              </span>
            </p>
          ))}
      </div>
    </div>
  );
}
