import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { hospitals } from "@/content/hospitals";

export const metadata = { title: "Hospital Reports", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUS_ORDER: Record<string, number> = { PENDING: 0, APPROVED: 1, REJECTED: 2 };
const hospitalName = (id: number) => hospitals.find((h) => h.id === id)?.name ?? `#${id}`;

/** Revalidate both locale variants of the public hospital page. */
function revalidateHospital(hospitalId: number) {
  // ne is served at "/" but rendered internally under "/ne" (next-intl as-needed).
  revalidatePath(`/hospitals/${hospitalId}`);
  revalidatePath(`/ne/hospitals/${hospitalId}`);
  revalidatePath(`/en/hospitals/${hospitalId}`);
  revalidatePath("/admin/hospital-reports");
}

async function setStatus(formData: FormData, status: "APPROVED" | "REJECTED") {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  const before = await prisma.hospitalReport.findUnique({ where: { id } });
  if (!before) return;
  const after = await prisma.hospitalReport.update({ where: { id }, data: { status } });
  await prisma.auditLog.create({
    data: {
      actorId: session.userId,
      action: `HOSPITAL_REPORT_${status}`,
      entity: "HospitalReport",
      entityId: id,
      before: { status: before.status },
      after: { status: after.status },
    },
  });
  revalidateHospital(before.hospitalId);
}

async function approveAction(formData: FormData) {
  "use server";
  await setStatus(formData, "APPROVED");
}

async function rejectAction(formData: FormData) {
  "use server";
  await setStatus(formData, "REJECTED");
}

async function deleteAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  const before = await prisma.hospitalReport.findUnique({ where: { id } });
  if (!before) return;
  await prisma.hospitalReport.delete({ where: { id } }).catch(() => {});
  await prisma.auditLog.create({
    data: {
      actorId: session.userId,
      action: "HOSPITAL_REPORT_DELETE",
      entity: "HospitalReport",
      entityId: id,
      before: {
        hospitalId: before.hospitalId,
        status: before.status,
        rating: before.rating,
        comment: before.comment,
      },
    },
  });
  revalidateHospital(before.hospitalId);
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "APPROVED"
      ? "bg-emerald-50 text-emerald-700"
      : status === "REJECTED"
        ? "bg-red-50 text-red-600"
        : "bg-amber-50 text-amber-700";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{status}</span>;
}

export default async function HospitalReportsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const rows = await prisma.hospitalReport.findMany({ orderBy: { createdAt: "desc" }, take: 300 });
  const items = [...rows].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9) || b.createdAt.getTime() - a.createdAt.getTime(),
  );
  const pending = rows.filter((r) => r.status === "PENDING").length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mt-2 text-2xl font-medium text-ink-900">🏥 Hospital Reports</h1>
      <p className="mt-1 text-sm text-ink-500">
        योगदानकर्ताले पठाएका गुमनाम अस्पताल अनुभव (पर्खाइ समय, क्यासलेस, rating, comment)। Approve
        गरेपछि मात्र सार्वजनिक अस्पताल पृष्ठमा देखिन्छ। नाम, फोन वा अपमानजनक comment भएका reject गर्नुहोस्।
      </p>

      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-700">{pending} pending</span>
        <span className="rounded-full bg-ink-100 px-3 py-1 text-ink-600">{rows.length} total (latest 300)</span>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 rounded-xl border border-ink-200 bg-white p-6 text-center text-ink-500">
          अहिलेसम्म कुनै hospital report छैन।
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-ink-200 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Hospital</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Wait</th>
                <th className="px-4 py-3">Cashless</th>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {items.map((r) => (
                <tr key={r.id} className={r.status === "PENDING" ? "bg-amber-50/30" : ""}>
                  <td className="px-4 py-3 align-top">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Link href={`/hospitals/${r.hospitalId}`} target="_blank" className="font-medium text-ink-900 hover:text-primary-700">
                      {hospitalName(r.hospitalId)}
                    </Link>
                    <p className="text-xs text-ink-400">#{r.hospitalId}</p>
                  </td>
                  <td className="px-4 py-3 align-top text-amber-500">{r.rating ? "★".repeat(r.rating) : "—"}</td>
                  <td className="px-4 py-3 align-top text-ink-700">{r.waitMinutes !== null ? `${r.waitMinutes} min` : "—"}</td>
                  <td className="px-4 py-3 align-top text-ink-700">
                    {r.cashless === null ? "—" : r.cashless ? "Yes" : "No"}
                  </td>
                  <td className="max-w-xs px-4 py-3 align-top text-ink-800">{r.comment ? `“${r.comment}”` : <span className="text-ink-400">—</span>}</td>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-xs text-ink-500">{r.createdAt.toISOString().slice(0, 10)}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex justify-end gap-1.5">
                      {r.status !== "APPROVED" && (
                        <form action={approveAction}>
                          <input type="hidden" name="id" value={r.id} />
                          <button className="rounded-lg border border-emerald-300 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50">
                            Approve
                          </button>
                        </form>
                      )}
                      {r.status !== "REJECTED" && (
                        <form action={rejectAction}>
                          <input type="hidden" name="id" value={r.id} />
                          <button className="rounded-lg border border-ink-300 px-2.5 py-1.5 text-xs text-ink-600 hover:bg-ink-50">
                            Reject
                          </button>
                        </form>
                      )}
                      <form action={deleteAction}>
                        <input type="hidden" name="id" value={r.id} />
                        <button className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
