import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";

/** Subscribe an admin's device to new-lead alerts. Requires an admin session. */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const sub = body?.subscription;
  const endpoint: string | undefined = sub?.endpoint;
  const p256dh: string | undefined = sub?.keys?.p256dh;
  const auth: string | undefined = sub?.keys?.auth;
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }
  const userAgent = req.headers.get("user-agent")?.slice(0, 300) ?? null;
  try {
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      create: { endpoint, p256dh, auth, userAgent, isAdmin: true },
      update: { p256dh, auth, isAdmin: true, lastSeen: new Date() },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }
}
