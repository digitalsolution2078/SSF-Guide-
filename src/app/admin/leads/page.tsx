import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Leads", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: "bg-blue-50 text-blue-700",
  CONTACT_PENDING: "bg-yellow-50 text-yellow-700",
  CONTACTED: "bg-primary-50 text-primary-700",
  INFO_REQUIRED: "bg-orange-50 text-orange-700",
  CONVERTED: "bg-green-50 text-green-700",
  CLOSED: "bg-gray-100 text-gray-600",
};

export default async function AdminLeadsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: { service: true },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Leads ({leads.length})
        </h1>
        <Link href="/admin" className="text-sm text-primary-700 underline">
          ← Dashboard
        </Link>
      </div>

      {leads.length === 0 ? (
        <p className="mt-8 rounded-xl bg-gray-50 p-6 text-gray-500">
          अहिलेसम्म कुनै lead छैन — /request फाराम live छ; पहिलो अनुरोध आउनेबित्तिकै
          यहाँ देखिन्छ।
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-2 pr-4">Ref</th>
                <th className="py-2 pr-4">नाम</th>
                <th className="py-2 pr-4">Mobile</th>
                <th className="py-2 pr-4">सेवा</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">मिति</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 pr-4 font-mono">
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="text-primary-700 underline"
                    >
                      {l.refNumber}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">{l.fullName}</td>
                  <td className="py-2 pr-4">{l.mobile}</td>
                  <td className="py-2 pr-4">{l.service.titleNe}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[l.status] ?? ""}`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-gray-500">
                    {l.createdAt.toISOString().slice(0, 16).replace("T", " ")}
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
