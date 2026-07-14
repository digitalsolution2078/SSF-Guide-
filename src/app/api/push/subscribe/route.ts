import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: { endpoint, p256dh, auth, userAgent, locale },
      update: { p256dh, auth, userAgent, locale, lastSeen: new Date() },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}
