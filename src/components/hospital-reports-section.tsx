import { prisma } from "@/lib/db";
import { toNe } from "@/content/ssf-stats";
import { Icon } from "./icons";
import { Stat } from "./ui";

/**
 * Server component: aggregates of APPROVED experience reports for one hospital.
 * Wrapped in <Suspense> by the page; every DB call is guarded so a missing or
 * unreachable database renders the empty state instead of breaking the page.
 */

interface Aggregates {
  count: number;
  avgWait: number | null;
  cashlessPct: number | null;
  avgRating: number | null;
  latest: { id: string; comment: string; createdAt: Date; rating: number | null }[];
}

async function loadAggregates(hospitalId: number): Promise<Aggregates | null> {
  try {
    const where = { hospitalId, status: "APPROVED" as const };
    const [count, wait, rating, cashlessYes, cashlessAnswered, latest] = await Promise.all([
      prisma.hospitalReport.count({ where }),
      prisma.hospitalReport.aggregate({ where: { ...where, waitMinutes: { not: null } }, _avg: { waitMinutes: true } }),
      prisma.hospitalReport.aggregate({ where: { ...where, rating: { not: null } }, _avg: { rating: true } }),
      prisma.hospitalReport.count({ where: { ...where, cashless: true } }),
      prisma.hospitalReport.count({ where: { ...where, cashless: { not: null } } }),
      prisma.hospitalReport.findMany({
        where: { ...where, comment: { not: null } },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, comment: true, createdAt: true, rating: true },
      }),
    ]);
    return {
      count,
      avgWait: wait._avg.waitMinutes ?? null,
      cashlessPct: cashlessAnswered > 0 ? Math.round((cashlessYes / cashlessAnswered) * 100) : null,
      avgRating: rating._avg.rating ?? null,
      latest: latest
        .filter((r): r is typeof r & { comment: string } => Boolean(r.comment))
        .map((r) => ({ id: r.id, comment: r.comment, createdAt: r.createdAt, rating: r.rating })),
    };
  } catch {
    return null;
  }
}

function fmtDate(d: Date, isEn: boolean): string {
  const iso = d.toISOString().slice(0, 10);
  return isEn ? iso : toNe(iso);
}

function fmtWait(min: number, isEn: boolean): string {
  const m = Math.round(min);
  if (m < 60) return isEn ? `${m} min` : `${toNe(String(m))} मिनेट`;
  const h = (m / 60).toFixed(1).replace(/\.0$/, "");
  return isEn ? `${h} hr` : `${toNe(h)} घण्टा`;
}

export async function HospitalReportsSection({ hospitalId, isEn }: { hospitalId: number; isEn: boolean }) {
  const agg = await loadAggregates(hospitalId);

  if (!agg || agg.count === 0) {
    return (
      <div className="surface p-6 text-center">
        <Icon name="users" size={26} className="mx-auto text-ink-300" />
        <p className="mt-3 font-semibold text-ink-800">
          {isEn ? "No experience reports yet." : "अहिलेसम्म कुनै अनुभव report छैन।"}
        </p>
        <p className="mt-1 text-sm text-ink-500">
          {isEn
            ? "Been treated here with SSF? Your wait time and whether it was cashless helps the next contributor."
            : "यहाँ SSF बाट उपचार गर्नुभएको छ? तपाईंको पर्खाइ समय र क्यासलेस भयो/भएन भन्ने जानकारीले अर्को योगदानकर्तालाई सहयोग गर्छ।"}
        </p>
      </div>
    );
  }

  const n = (s: string) => (isEn ? s : toNe(s));
  const dash = "—";

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat
          value={n(String(agg.count))}
          label={isEn ? "Reports" : "अनुभव report"}
          hint={isEn ? "approved, anonymous" : "स्वीकृत, गुमनाम"}
          tone="neutral"
        />
        <Stat
          value={agg.avgRating !== null ? `${n(agg.avgRating.toFixed(1))} ★` : dash}
          label={isEn ? "Average rating" : "औसत rating"}
          hint={isEn ? "out of 5" : "५ मध्ये"}
          tone="health"
        />
        <Stat
          value={agg.avgWait !== null ? fmtWait(agg.avgWait, isEn) : dash}
          label={isEn ? "Average wait" : "औसत पर्खाइ"}
          hint={isEn ? "at the SSF desk" : "SSF डेस्कमा"}
        />
        <Stat
          value={agg.cashlessPct !== null ? `${n(String(agg.cashlessPct))}%` : dash}
          label={isEn ? "Got cashless" : "क्यासलेस पाए"}
          hint={isEn ? "paid only 20% at counter" : "काउन्टरमा २०% मात्र तिरे"}
          tone="health"
        />
      </div>

      {agg.latest.length > 0 && (
        <ul className="mt-5 space-y-3">
          {agg.latest.map((r) => (
            <li key={r.id} className="card p-4">
              <p className="text-sm leading-relaxed text-ink-800">“{r.comment}”</p>
              <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-400">
                {r.rating !== null && (
                  <span className="inline-flex items-center gap-0.5 text-amber-500">
                    {"★".repeat(r.rating)}
                    <span className="text-ink-300">{"★".repeat(5 - r.rating)}</span>
                  </span>
                )}
                <span>{isEn ? "Anonymous contributor" : "गुमनाम योगदानकर्ता"}</span>
                <span>·</span>
                <span>{fmtDate(r.createdAt, isEn)}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
