import type { Metadata } from "next";
import { prisma } from "@/lib/db";

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

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; mobile?: string }>;
}) {
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
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-primary-900">
        🔎 अनुरोधको Status
      </h1>
      <form method="get" className="mt-6 space-y-4 rounded-xl border border-primary-100 bg-white p-6 shadow-sm">
        <label className="block text-sm font-semibold text-gray-800">
          Reference Number
          <input
            name="ref"
            defaultValue={ref}
            required
            placeholder="DS-SSF-2026-000123"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-semibold text-gray-800">
          Mobile नम्बर (फाराममा दिएकै)
          <input
            name="mobile"
            defaultValue={mobile}
            required
            inputMode="tel"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-xl bg-primary-600 py-2.5 font-semibold text-white hover:bg-primary-700"
        >
          जाँच्नुहोस्
        </button>
      </form>

      {result &&
        (result.found ? (
          <div className="mt-6 rounded-xl border-2 border-primary-200 bg-primary-50 p-5 text-center">
            <p className="text-sm text-gray-600">{result.service}</p>
            <p className="mt-1 text-xl font-bold text-primary-800">
              {STATUS_LABELS[result.status!] ?? result.status}
            </p>
          </div>
        ) : (
          <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            विवरण मिलेन — reference number र mobile नम्बर जाँचेर पुनः प्रयास
            गर्नुहोस्।
          </p>
        ))}
    </div>
  );
}
