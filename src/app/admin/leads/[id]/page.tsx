import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Lead Detail", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUSES = [
  "RECEIVED",
  "CONTACT_PENDING",
  "CONTACTED",
  "INFO_REQUIRED",
  "CONVERTED",
  "CLOSED",
] as const;

async function updateStatusAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  const toStatus = String(formData.get("status")) as (typeof STATUSES)[number];
  if (!STATUSES.includes(toStatus)) return;
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead || lead.status === toStatus) return;
  await prisma.$transaction([
    prisma.lead.update({ where: { id }, data: { status: toStatus } }),
    prisma.leadStatusHistory.create({
      data: { leadId: id, fromStatus: lead.status, toStatus, actorId: session.userId },
    }),
    prisma.auditLog.create({
      data: {
        actorId: session.userId,
        action: "LEAD_STATUS_CHANGE",
        entity: "Lead",
        entityId: id,
        before: { status: lead.status },
        after: { status: toStatus },
      },
    }),
  ]);
  revalidatePath(`/admin/leads/${id}`);
}

async function addNoteAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  const note = String(formData.get("note") ?? "").trim();
  if (!note) return;
  await prisma.leadActivity.create({
    data: { leadId: id, actorId: session.userId, note },
  });
  revalidatePath(`/admin/leads/${id}`);
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      service: true,
      activities: { orderBy: { createdAt: "desc" } },
      statusHistory: { orderBy: { createdAt: "desc" } },
      consents: true,
    },
  });
  if (!lead) notFound();

  const wa = lead.mobile.replace(/\D/g, "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin/leads" className="text-sm text-primary-700 underline">
        ← Leads
      </Link>
      <h1 className="mt-2 font-mono text-2xl font-bold text-gray-900">
        {lead.refNumber}
      </h1>

      <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p><strong>{lead.fullName}</strong> · {lead.district}</p>
          <p className="mt-1">{lead.mobile} {lead.email && `· ${lead.email}`}</p>
          <p className="mt-1 text-gray-500">
            {lead.userCategory} · सम्पर्क: {lead.preferredContact}
            {lead.currentCountry && ` · ${lead.currentCountry}`}
          </p>
          <p className="mt-1 text-gray-500">
            SSN: {lead.hasSSFAccount === null ? "?" : lead.hasSSFAccount ? "छ" : "छैन"} ·
            KYC: {lead.kycComplete === null ? "?" : lead.kycComplete ? "छ" : "छैन"}
          </p>
          <a
            href={`https://wa.me/${wa}?text=${encodeURIComponent(`नमस्कार ${lead.fullName} ज्यू, Digital Solution बाट — तपाईंको SSF सहायता अनुरोध (${lead.refNumber}) बारे।`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            💬 WhatsApp
          </a>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-gray-500">सेवा</p>
          <p className="font-semibold">{lead.service.titleNe}</p>
          <p className="mt-2 text-gray-500">समस्या</p>
          <p className="whitespace-pre-wrap">{lead.issueDescription}</p>
        </div>
      </div>

      <form
        action={updateStatusAction}
        className="mt-6 flex items-end gap-3 rounded-xl border border-gray-200 bg-white p-4"
      >
        <input type="hidden" name="id" value={lead.id} />
        <label className="block text-sm font-semibold text-gray-800">
          Status
          <select
            name="status"
            defaultValue={lead.status}
            className="mt-1 block rounded-lg border border-gray-300 px-3 py-2"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Update
        </button>
      </form>

      <form
        action={addNoteAction}
        className="mt-4 rounded-xl border border-gray-200 bg-white p-4"
      >
        <input type="hidden" name="id" value={lead.id} />
        <label className="block text-sm font-semibold text-gray-800">
          Internal note
          <textarea
            name="note"
            rows={2}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="mt-2 rounded-lg border border-primary-300 px-4 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50"
        >
          Add note
        </button>
        <ul className="mt-4 space-y-2 text-sm">
          {lead.activities.map((a) => (
            <li key={a.id} className="rounded-lg bg-gray-50 px-3 py-2">
              {a.note}
              <span className="ml-2 text-xs text-gray-400">
                {a.createdAt.toISOString().slice(0, 16).replace("T", " ")}
              </span>
            </li>
          ))}
        </ul>
      </form>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-500">
        <p className="font-semibold text-gray-700">History</p>
        {lead.statusHistory.map((h) => (
          <p key={h.id}>
            {h.createdAt.toISOString().slice(0, 16).replace("T", " ")}:{" "}
            {h.fromStatus ?? "—"} → {h.toStatus}
          </p>
        ))}
        <p className="mt-2 font-semibold text-gray-700">Consent</p>
        {lead.consents.map((c) => (
          <p key={c.id}>{c.kind}: {c.granted ? "granted" : "denied"} ({c.createdAt.toISOString().slice(0, 10)})</p>
        ))}
      </div>
    </div>
  );
}
