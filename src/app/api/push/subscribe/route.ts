import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ALLOWED_TOPICS = new Set(["milestones", "employer_deadline", "news"]);

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const sub = body?.subscription;
  const endpoint: string | undefined = sub?.endpoint;
  const p256dh: string | undefined = sub?.keys?.p256dh;
  const auth: string | undefined = sub?.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }
  // Reject implausibly large values (real push keys are short) to avoid DB bloat.
  if (endpoint.length > 1000 || p256dh.length > 300 || auth.length > 300) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }
  if (!/^https:\/\//.test(endpoint)) {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  }
  const locale = typeof body?.locale === "string" ? body.locale.slice(0, 5) : "ne";
  const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;

  // Optional alert topics + a minimal profile snapshot for personalised alerts.
  const topics: string[] | undefined = Array.isArray(body?.topics)
    ? (body.topics as unknown[]).filter((t): t is string => typeof t === "string" && ALLOWED_TOPICS.has(t)).slice(0, 5)
    : undefined;
  let profile: { monthsContributed: number; age?: number; savedAt: string; lastMilestone?: number } | undefined;
  const p = body?.profile;
  if (p && typeof p === "object" && Number.isFinite(Number(p.monthsContributed))) {
    const months = Math.max(0, Math.min(600, Math.floor(Number(p.monthsContributed))));
    const age = Number.isFinite(Number(p.age)) ? Math.max(0, Math.min(100, Math.floor(Number(p.age)))) : undefined;
    profile = { monthsContributed: months, age, savedAt: new Date().toISOString(), lastMilestone: months };
  }

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: { endpoint, p256dh, auth, userAgent, locale, ...(topics ? { topics } : {}), ...(profile ? { profile } : {}) },
      update: {
        p256dh,
        auth,
        userAgent,
        locale,
        lastSeen: new Date(),
        ...(topics ? { topics } : {}),
        ...(profile ? { profile } : {}),
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}
