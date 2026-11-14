import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pushConfigured, sendPush, type PushPayload } from "@/lib/push";
import { crossedMilestones } from "@/lib/milestones";
import { nextDepositDeadline, formatAD, BS_MONTHS_NE, BS_MONTHS_EN } from "@/lib/nepali-date";

export const dynamic = "force-dynamic";

/**
 * Daily alert job — call once a day (see deploy/enable-push-cron.sh):
 *   curl -fsS -H "Authorization: Bearer $CRON_SECRET" https://<site>/api/push/cron
 *
 * 1. milestones: for subscribers who opted in and saved their months, compute
 *    the current month count (saved months + full months elapsed) and send one
 *    notification per newly crossed milestone (18 / 36 / 180 …), remembering
 *    the last notified milestone in `profile.lastMilestone`.
 * 2. employer_deadline: 7, 3 and 1 day(s) before the next deposit deadline.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get("authorization") ?? "";
  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!pushConfigured()) {
    return NextResponse.json({ ok: false, reason: "push not configured (VAPID_PRIVATE_KEY)" });
  }

  const now = new Date();
  const results = { milestones: 0, deadline: 0, gone: 0, errors: 0 };
  const dead: string[] = [];

  // ── 1. milestones ─────────────────────────────────────────────────────────
  const subs = await prisma.pushSubscription.findMany({
    where: { topics: { hasSome: ["milestones", "employer_deadline"] } },
    take: 10_000,
  });

  for (const s of subs) {
    const isEn = s.locale === "en";
    const payloads: PushPayload[] = [];

    if (s.topics.includes("milestones") && s.profile && typeof s.profile === "object") {
      const p = s.profile as { monthsContributed?: number; savedAt?: string; lastMilestone?: number };
      if (typeof p.monthsContributed === "number" && p.savedAt) {
        const saved = new Date(p.savedAt);
        const elapsed = (now.getFullYear() - saved.getFullYear()) * 12 + (now.getMonth() - saved.getMonth());
        const current = p.monthsContributed + Math.max(0, elapsed);
        const last = typeof p.lastMilestone === "number" ? p.lastMilestone : p.monthsContributed;
        const crossed = crossedMilestones(last, current);
        if (crossed.length) {
          const m = crossed[crossed.length - 1];
          payloads.push({
            title: isEn ? `SSF: ${m.titleEn} 🎉` : `SSF: ${m.titleNe} 🎉`,
            body: isEn ? m.descEn : m.descNe,
            url: m.href,
          });
          await prisma.pushSubscription
            .update({ where: { id: s.id }, data: { profile: { ...p, lastMilestone: current } } })
            .catch(() => {});
          results.milestones++;
        }
      }
    }

    // ── 2. employer deposit deadline ────────────────────────────────────────
    if (s.topics.includes("employer_deadline")) {
      const d = nextDepositDeadline(now);
      if ([7, 3, 1].includes(d.daysLeft)) {
        const month = isEn ? BS_MONTHS_EN[d.bs.month] : BS_MONTHS_NE[d.bs.month];
        payloads.push({
          title: isEn
            ? `SSF deposit for ${month}: ${d.daysLeft} day${d.daysLeft === 1 ? "" : "s"} left`
            : `${month} महिनाको SSF दाखिला: ${d.daysLeft} दिन बाँकी`,
          body: isEn
            ? `Deposit by ${formatAD(d.deadline, true)} to avoid the 10% late interest. Open the employer toolkit.`
            : `${formatAD(d.deadline, false)} भित्र जम्मा गर्नुहोस् — ढिलो भए १०% ब्याज। रोजगारदाता toolkit खोल्नुहोस्।`,
          url: "/employer",
        });
        results.deadline++;
      }
    }

    for (const payload of payloads) {
      const r = await sendPush({ endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth }, payload);
      if (r === "gone") dead.push(s.id);
      else if (r === "error") results.errors++;
    }
  }

  if (dead.length) {
    results.gone = dead.length;
    await prisma.pushSubscription.deleteMany({ where: { id: { in: dead } } }).catch(() => {});
  }

  return NextResponse.json({ ok: true, at: now.toISOString(), ...results });
}
