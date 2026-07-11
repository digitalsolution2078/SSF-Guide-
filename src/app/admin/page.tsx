import { redirect } from "next/navigation";
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

  const [leads, chatSessions, calcSessions, videos, sources, rules] =
    await Promise.all([
      prisma.lead.count(),
      prisma.chatSession.count(),
      prisma.calculationSession.count(),
      prisma.video.count(),
      prisma.source.count(),
      prisma.calculationRule.count({ where: { status: "PUBLISHED" } }),
    ]);

  const cards = [
    { label: "Leads (सहायता अनुरोध)", value: leads, note: "Lead form live भएपछि यहाँ देखिन्छ" },
    { label: "Chat sessions", value: chatSessions, note: "logging चाँडै जोडिन्छ" },
    { label: "Calculator sessions", value: calcSessions, note: "logging चाँडै जोडिन्छ" },
    { label: "Videos", value: videos, note: "seeded catalog" },
    { label: "Official sources", value: sources, note: "source registry" },
    { label: "Published rate rules", value: rules, note: "versioned" },
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

      <div className="mt-8 rounded-xl border border-primary-100 bg-primary-50 p-5 text-sm text-gray-700">
        <p className="font-semibold text-primary-900">यो पहिलो संस्करण हो</p>
        <p className="mt-1">
          अहिले: dashboard + secure login। अर्को चरणमा: lead inbox (assign, notes,
          WhatsApp follow-up), content editing, rate manager र unanswered
          questions। Content परिवर्तन अहिलेलाई chat मार्फत गर्नुहोस् — verified
          गरेर push गरिन्छ।
        </p>
      </div>
    </div>
  );
}
