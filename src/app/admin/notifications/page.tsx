import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { pushConfigured, sendPush } from "@/lib/push";
import { AdminLeadAlerts } from "@/components/admin-lead-alerts";
import { PushComposer, type PushablePost } from "@/components/admin/push-composer";
import { sortedBlogPosts } from "@/content/blog";
import { getPublishedDbBlog } from "@/lib/db-blog";

export const metadata = { title: "Push Notifications", robots: { index: false } };
export const dynamic = "force-dynamic";

const LAST_RESULT_KEY = "lastPushResult";

async function sendAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!pushConfigured()) return;

  const title = String(formData.get("title") ?? "").trim().slice(0, 80);
  const body = String(formData.get("body") ?? "").trim().slice(0, 200);
  const url = String(formData.get("url") ?? "").trim().slice(0, 300) || "/";
  if (title.length < 2 || body.length < 2) return;

  const subs = await prisma.pushSubscription.findMany({ take: 5000 });
  let sent = 0;
  let gone = 0;
  const dead: string[] = [];
  for (const s of subs) {
    const r = await sendPush(
      { endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth },
      { title, body, url },
    );
    if (r === "ok") sent++;
    else if (r === "gone") {
      gone++;
      dead.push(s.endpoint);
    }
  }
  if (dead.length) {
    await prisma.pushSubscription.deleteMany({ where: { endpoint: { in: dead } } }).catch(() => {});
  }
  await prisma.siteSetting
    .upsert({
      where: { key: LAST_RESULT_KEY },
      create: { key: LAST_RESULT_KEY, value: { title, sent, gone, total: subs.length, at: new Date().toISOString() }, updatedById: session.userId },
      update: { value: { title, sent, gone, total: subs.length, at: new Date().toISOString() }, updatedById: session.userId },
    })
    .catch(() => {});
  revalidatePath("/admin/notifications");
}

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [count, lastResultRow, dbPosts] = await Promise.all([
    prisma.pushSubscription.count(),
    prisma.siteSetting.findUnique({ where: { key: LAST_RESULT_KEY } }),
    getPublishedDbBlog().catch(() => []),
  ]);
  const configured = pushConfigured();

  // Blog posts available to broadcast — admin-authored (DB) first, then the
  // built-in file posts, newest-first, de-duplicated by slug.
  const seen = new Set<string>();
  const posts: PushablePost[] = [];
  for (const p of [...dbPosts, ...sortedBlogPosts()]) {
    if (seen.has(p.slug)) continue;
    seen.add(p.slug);
    posts.push({ slug: p.slug, title: p.title, excerpt: p.excerpt });
  }
  const last = lastResultRow?.value as
    | { title: string; sent: number; gone: number; total: number; at: string }
    | undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">      <h1 className="mt-2 text-2xl font-medium text-ink-900">🔔 Push Notifications</h1>
      <p className="mt-1 text-sm text-ink-500">
        सदस्यहरूलाई browser notification पठाउनुहोस् — नयाँ guide, दर परिवर्तन वा
        म्यादबारे। Subscriber: <strong>{count}</strong>
      </p>

      <AdminLeadAlerts />

      {!configured && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          ⚠️ Push अझै configure भएको छैन। VPS को <code>.env</code> मा{" "}
          <code>VAPID_PRIVATE_KEY</code> (र चाहे <code>VAPID_SUBJECT</code>) राखेर
          rebuild गर्नुहोस्। Public key code मा default छ।
        </div>
      )}

      {last && (
        <div className="mt-6 rounded-xl border border-ink-200 bg-white p-4 text-sm text-ink-700">
          पछिल्लो पठाइएको: <strong>{last.title}</strong> — {last.sent} पठाइयो
          {last.gone > 0 && `, ${last.gone} expired हटाइयो`} ({last.total} मध्ये) ·{" "}
          {last.at.slice(0, 16).replace("T", " ")}
        </div>
      )}

      <form action={sendAction} className="mt-6 space-y-3 rounded-xl border border-ink-200 bg-white p-5">
        <PushComposer posts={posts} />
        <button
          type="submit"
          disabled={!configured || count === 0}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {count === 0 ? "कुनै subscriber छैन" : `${count} जनालाई पठाउनुहोस्`}
        </button>
      </form>
    </div>
  );
}
