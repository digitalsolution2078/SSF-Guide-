import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Admin Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1000;

const STATUS_META: Record<string, { label: string; dot: string; chip: string }> = {
  RECEIVED: { label: "नयाँ", dot: "bg-blue-500", chip: "bg-blue-50 text-blue-700" },
  CONTACT_PENDING: { label: "सम्पर्क बाँकी", dot: "bg-yellow-500", chip: "bg-yellow-50 text-yellow-700" },
  CONTACTED: { label: "सम्पर्क भयो", dot: "bg-primary-500", chip: "bg-primary-50 text-primary-700" },
  INFO_REQUIRED: { label: "जानकारी चाहिने", dot: "bg-orange-500", chip: "bg-orange-50 text-orange-700" },
  CONVERTED: { label: "Converted", dot: "bg-green-500", chip: "bg-green-50 text-green-700" },
  CLOSED: { label: "बन्द", dot: "bg-ink-400", chip: "bg-ink-100 text-ink-600" },
};

function Trend({ now, prev }: { now: number; prev: number }) {
  if (prev === 0 && now === 0) return <span className="text-xs text-ink-400">—</span>;
  const up = now >= prev;
  const pct = prev === 0 ? 100 : Math.round(((now - prev) / prev) * 100);
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
        up ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
      }`}
    >
      {up ? "▲" : "▼"} {Math.abs(pct)}%
    </span>
  );
}

function BarChart({ points }: { points: { label: string; value: number }[] }) {
  const W = 560;
  const H = 120;
  const PAD = 4;
  const max = Math.max(...points.map((p) => p.value), 1);
  const bw = (W - PAD * 2) / points.length;
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full" role="img" aria-label="Leads per day">
      {points.map((p, i) => {
        const h = Math.max(2, (p.value / max) * H);
        return (
          <g key={i}>
            <rect
              x={PAD + i * bw + bw * 0.18}
              y={H - h}
              width={bw * 0.64}
              height={h}
              rx={3}
              className={p.value > 0 ? "fill-primary-500" : "fill-ink-200"}
            />
            {p.value > 0 && (
              <text
                x={PAD + i * bw + bw / 2}
                y={H - h - 4}
                textAnchor="middle"
                className="fill-ink-500"
                fontSize="10"
              >
                {p.value}
              </text>
            )}
            <text
              x={PAD + i * bw + bw / 2}
              y={H + 13}
              textAnchor="middle"
              className="fill-ink-400"
              fontSize="9"
            >
              {p.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const now = Date.now();
  const d7 = new Date(now - 7 * DAY);
  const d14 = new Date(now - 14 * DAY);

  const [
    totalLeads,
    openLeads,
    leadsThisWeek,
    leadsLastWeek,
    statusGroups,
    recentLeadDates,
    recentLeads,
    unanswered,
    subscribers,
    dbFaqs,
    dbPosts,
    testimonials,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: { notIn: ["CONVERTED", "CLOSED"] } } }),
    prisma.lead.count({ where: { createdAt: { gte: d7 } } }),
    prisma.lead.count({ where: { createdAt: { gte: d14, lt: d7 } } }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.findMany({
      where: { createdAt: { gte: d14 } },
      select: { createdAt: true },
    }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { service: true },
    }),
    prisma.unansweredQuestion.findMany({
      orderBy: [{ count: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
    prisma.pushSubscription.count(),
    prisma.fAQ.count({ where: { status: "PUBLISHED" } }),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    prisma.testimonial.count({ where: { published: true } }),
  ]);

  // Bucket last 14 days (UTC days — admin overview granularity)
  const days: { label: string; value: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const dayStart = new Date(now - i * DAY);
    const key = dayStart.toISOString().slice(5, 10); // MM-DD
    days.push({ label: key.replace("-", "/"), value: 0 });
  }
  for (const l of recentLeadDates) {
    const idx = 13 - Math.floor((now - l.createdAt.getTime()) / DAY);
    if (idx >= 0 && idx < 14) days[idx].value++;
  }

  const statusTotal = statusGroups.reduce((a, g) => a + g._count._all, 0);

  const kpis = [
    {
      label: "यो हप्ता Leads",
      value: leadsThisWeek,
      extra: <Trend now={leadsThisWeek} prev={leadsLastWeek} />,
      href: "/admin/leads",
    },
    { label: "खुला Leads", value: openLeads, extra: null, href: "/admin/leads" },
    { label: "जम्मा Leads", value: totalLeads, extra: null, href: "/admin/leads" },
    { label: "Push Subscribers", value: subscribers, extra: null, href: "/admin/notifications" },
    { label: "Unanswered Qs", value: unanswered.length, extra: null, href: "/admin/questions" },
    { label: "Live Content", value: dbFaqs + dbPosts + testimonials, extra: null, href: "/admin/content" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium text-ink-900">नमस्कार 👋</h1>
          <p className="mt-0.5 text-sm text-ink-500">
            SSF Guide Nepal को आजको अवस्था — एक नजरमा।
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/blog"
            className="rounded-lg bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
          >
            + नयाँ Post
          </Link>
          <Link
            href="/admin/notifications"
            className="rounded-lg border border-ink-300 bg-white px-3.5 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
          >
            🔔 Push पठाउनुहोस्
          </Link>
        </div>
      </div>

      {/* KPI cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <Link
            key={k.label}
            href={k.href}
            className="rounded-xl border border-ink-200 bg-white p-4 shadow-sm transition hover:border-primary-300 hover:shadow"
          >
            <p className="text-xs text-ink-500">{k.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-2xl font-bold text-ink-900">{k.value}</p>
              {k.extra}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Chart */}
        <div className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-800">
              📈 Leads — पछिल्ला १४ दिन
            </p>
            <span className="text-xs text-ink-400">
              जम्मा {days.reduce((a, d) => a + d.value, 0)}
            </span>
          </div>
          <div className="mt-4">
            <BarChart points={days} />
          </div>
        </div>

        {/* Status distribution */}
        <div className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink-800">Lead status</p>
          {statusTotal === 0 ? (
            <p className="mt-4 text-sm text-ink-400">अहिलेसम्म कुनै lead छैन।</p>
          ) : (
            <>
              <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full">
                {statusGroups.map((g) => (
                  <div
                    key={g.status}
                    className={STATUS_META[g.status]?.dot ?? "bg-ink-300"}
                    style={{ width: `${(g._count._all / statusTotal) * 100}%` }}
                  />
                ))}
              </div>
              <ul className="mt-4 space-y-2">
                {statusGroups
                  .sort((a, b) => b._count._all - a._count._all)
                  .map((g) => (
                    <li key={g.status} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-ink-600">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${STATUS_META[g.status]?.dot ?? "bg-ink-300"}`}
                        />
                        {STATUS_META[g.status]?.label ?? g.status}
                      </span>
                      <span className="font-semibold text-ink-900">{g._count._all}</span>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent leads */}
        <div className="rounded-xl border border-ink-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
            <p className="text-sm font-semibold text-ink-800">🕐 पछिल्ला Leads</p>
            <Link href="/admin/leads" className="text-xs font-semibold text-primary-700 hover:underline">
              सबै →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-400">
              पहिलो lead आउनासाथ यहाँ देखिन्छ।
            </p>
          ) : (
            <ul className="divide-y divide-ink-50">
              {recentLeads.map((l) => (
                <li key={l.id}>
                  <Link
                    href={`/admin/leads/${l.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-ink-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">
                        {l.fullName}
                        <span className="ml-2 font-mono text-xs text-ink-400">{l.refNumber}</span>
                      </p>
                      <p className="truncate text-xs text-ink-500">
                        {l.service.titleNe} · {l.district}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_META[l.status]?.chip ?? "bg-ink-100 text-ink-600"}`}
                    >
                      {STATUS_META[l.status]?.label ?? l.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top unanswered */}
        <div className="rounded-xl border border-ink-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
            <p className="text-sm font-semibold text-ink-800">❓ Content gap — धेरै सोधिएका</p>
            <Link href="/admin/questions" className="text-xs font-semibold text-primary-700 hover:underline">
              सबै →
            </Link>
          </div>
          {unanswered.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-ink-400">
              AI ले सबै प्रश्नको जवाफ दिन सकिरहेको छ। 🎉
            </p>
          ) : (
            <ul className="divide-y divide-ink-50">
              {unanswered.map((q) => (
                <li key={q.id} className="flex items-start justify-between gap-3 px-5 py-3">
                  <p className="text-sm text-ink-700">{q.question}</p>
                  <span className="shrink-0 rounded-full bg-action-50 px-2 py-0.5 text-[11px] font-bold text-action-700">
                    {q.count}×
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
