import { redirect } from "next/navigation";
import Link from "next/link";
import { destroySession, getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Admin Dashboard", robots: { index: false } };
export const dynamic = "force-dynamic";

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [leads, openLeads, unanswered, knowledgeDocs, videos, sources] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: { notIn: ["CONVERTED", "CLOSED"] } } }),
      prisma.unansweredQuestion.count(),
      prisma.knowledgeDocument.count({ where: { approved: true } }),
      prisma.video.count(),
      prisma.source.count(),
    ]);

  const cards = [
    { label: "Leads — जम्मा", value: leads, note: "सबै सहायता अनुरोध" },
    { label: "Leads — खुला", value: openLeads, note: "convert/close नभएका" },
    { label: "Unanswered questions", value: unanswered, note: "content gap" },
    { label: "Knowledge docs", value: knowledgeDocs, note: "approved" },
    { label: "Videos", value: videos, note: "seeded catalog" },
    { label: "Official sources", value: sources, note: "source registry" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            SSF Guide — Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Login: {session.email} ({session.role})
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </form>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-primary-800">{c.value}</p>
            <p className="mt-1 text-xs text-gray-400">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/admin/leads"
          className="rounded-xl border-2 border-primary-200 bg-white p-4 font-semibold text-primary-800 hover:border-primary-400"
        >
          📋 Leads — inbox, assign, notes, WhatsApp →
        </Link>
        <Link
          href="/admin/questions"
          className="rounded-xl border-2 border-primary-200 bg-white p-4 font-semibold text-primary-800 hover:border-primary-400"
        >
          ❓ Unanswered Questions →
        </Link>
        <Link
          href="/admin/content"
          className="rounded-xl border-2 border-primary-200 bg-white p-4 font-semibold text-primary-800 hover:border-primary-400"
        >
          ✍️ Content — FAQ Manager (live) →
        </Link>
        <Link
          href="/admin/knowledge"
          className="rounded-xl border-2 border-primary-200 bg-white p-4 font-semibold text-primary-800 hover:border-primary-400"
        >
          🧠 Chatbot Knowledge Base →
        </Link>
        <Link
          href="/admin/rates"
          className="rounded-xl border-2 border-primary-200 bg-white p-4 font-semibold text-primary-800 hover:border-primary-400"
        >
          ⚙️ Rate Manager (न्यूनतम पारिश्रमिक) →
        </Link>
        <Link
          href="/admin/notifications"
          className="rounded-xl border-2 border-primary-200 bg-white p-4 font-semibold text-primary-800 hover:border-primary-400"
        >
          🔔 Push Notifications →
        </Link>
        <Link
          href="/admin/security"
          className="rounded-xl border-2 border-primary-200 bg-white p-4 font-semibold text-primary-800 hover:border-primary-400"
        >
          🔒 Security — 2FA →
        </Link>
      </div>

      <div className="mt-8 rounded-xl border border-primary-100 bg-primary-50 p-5 text-sm text-gray-700">
        <p className="font-semibold text-primary-900">संस्करण २ — के-के छ</p>
        <p className="mt-1">
          Lead inbox (assign, notes, status history, WhatsApp follow-up),
          unanswered questions (chatbot content gap), rate manager (न्यूनतम
          पारिश्रमिक live), FAQ content editor (live), र chatbot knowledge base।
          यहाँबाट थपेका FAQ तुरुन्तै site मा देखिन्छन्। विस्तृत कानुनी guide भने
          verified push (chat) मार्फत नै — accuracy का लागि।
        </p>
      </div>
    </div>
  );
}
