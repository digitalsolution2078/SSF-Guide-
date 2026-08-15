import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export const metadata = { title: "Leads Inbox", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUSES = [
  "RECEIVED",
  "CONTACT_PENDING",
  "CONTACTED",
  "INFO_REQUIRED",
  "CONVERTED",
  "CLOSED",
] as const;

const STATUS_META: Record<string, { label: string; chip: string }> = {
  RECEIVED: { label: "नयाँ", chip: "bg-blue-50 text-blue-700" },
  CONTACT_PENDING: { label: "सम्पर्क बाँकी", chip: "bg-yellow-50 text-yellow-700" },
  CONTACTED: { label: "सम्पर्क भयो", chip: "bg-primary-50 text-primary-700" },
  INFO_REQUIRED: { label: "जानकारी चाहिने", chip: "bg-orange-50 text-orange-700" },
  CONVERTED: { label: "Converted", chip: "bg-green-50 text-green-700" },
  CLOSED: { label: "बन्द", chip: "bg-ink-100 text-ink-600" },
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { q = "", status = "" } = await searchParams;
  const activeStatus = (STATUSES as readonly string[]).includes(status) ? status : "";

  const where: Prisma.LeadWhereInput = {
    ...(activeStatus ? { status: activeStatus as (typeof STATUSES)[number] } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { mobile: { contains: q } },
            { refNumber: { contains: q, mode: "insensitive" } },
            { district: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [leads, counts] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        service: true,
        assignments: { where: { active: true }, include: { staff: true } },
      },
      take: 100,
    }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const countOf = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;
  const total = counts.reduce((a, c) => a + c._count._all, 0);

  const tabs = [
    { key: "", label: `सबै (${total})` },
    ...STATUSES.map((s) => ({
      key: s,
      label: `${STATUS_META[s].label} (${countOf(s)})`,
    })),
  ];
  const tabHref = (key: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (key) params.set("status", key);
    const qs = params.toString();
    return `/admin/leads${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-medium text-ink-900">📋 Leads Inbox</h1>
        <form method="get" className="flex gap-2">
          {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="नाम, mobile, ref, जिल्ला खोज्नुहोस्…"
            className="w-64 rounded-lg border border-ink-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          <button className="rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            खोज्नुहोस्
          </button>
        </form>
      </div>

      {/* Status tabs */}
      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={tabHref(t.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              activeStatus === t.key
                ? "bg-primary-600 text-white"
                : "bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {leads.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink-300 bg-white p-10 text-center">
          <p className="text-3xl">📭</p>
          <p className="mt-2 text-sm text-ink-500">
            {q || activeStatus
              ? "यो filter/खोजमा कुनै lead भेटिएन।"
              : "अहिलेसम्म कुनै lead छैन — /request फाराम live छ; पहिलो अनुरोध आउनासाथ यहाँ देखिन्छ।"}
          </p>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-ink-200 bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
                  <th className="px-4 py-2.5">Lead</th>
                  <th className="px-4 py-2.5">सेवा</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Assignee</th>
                  <th className="px-4 py-2.5">मिति</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {leads.map((l) => {
                  const assignee = l.assignments[0]?.staff?.name;
                  const wa = l.mobile.replace(/\D/g, "");
                  return (
                    <tr key={l.id} className="hover:bg-ink-50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/leads/${l.id}`} className="block">
                          <p className="font-medium text-ink-900">{l.fullName}</p>
                          <p className="font-mono text-xs text-ink-400">
                            {l.refNumber} · {l.mobile} · {l.district}
                          </p>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-ink-600">{l.service.titleNe}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_META[l.status]?.chip ?? "bg-ink-100 text-ink-600"}`}
                        >
                          {STATUS_META[l.status]?.label ?? l.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-600">
                        {assignee ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 text-[10px] font-bold text-primary-700">
                              {assignee[0]}
                            </span>
                            {assignee}
                          </span>
                        ) : (
                          <span className="text-ink-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink-500">
                        {l.createdAt.toISOString().slice(0, 10)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${wa}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp"
                            className="rounded-lg bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 hover:bg-green-100"
                          >
                            💬
                          </a>
                          <Link
                            href={`/admin/leads/${l.id}`}
                            className="rounded-lg bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700 hover:bg-primary-100"
                          >
                            खोल्नुहोस् →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
