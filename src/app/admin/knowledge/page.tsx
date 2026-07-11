import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Chatbot Knowledge Base", robots: { index: false } };
export const dynamic = "force-dynamic";

async function addKnowledgeAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title || !content) return;
  await prisma.knowledgeDocument.create({
    data: {
      title,
      sourceType: "MANUAL",
      approved: true,
      approvedById: session.userId,
      chunks: { create: [{ content, tokenCount: Math.ceil(content.length / 4) }] },
    },
  });
  await prisma.auditLog.create({
    data: { actorId: session.userId, action: "KNOWLEDGE_ADD", entity: "KnowledgeDocument" },
  });
  revalidatePath("/admin/knowledge");
}

async function toggleKnowledgeAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  const doc = await prisma.knowledgeDocument.findUnique({ where: { id } });
  if (!doc) return;
  await prisma.knowledgeDocument.update({
    where: { id },
    data: { approved: !doc.approved },
  });
  revalidatePath("/admin/knowledge");
}

async function deleteKnowledgeAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  await prisma.knowledgeDocument.delete({ where: { id } });
  await prisma.auditLog.create({
    data: { actorId: session.userId, action: "KNOWLEDGE_DELETE", entity: "KnowledgeDocument", entityId: id },
  });
  revalidatePath("/admin/knowledge");
}

export default async function KnowledgePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const docs = await prisma.knowledgeDocument.findMany({
    orderBy: { updatedAt: "desc" },
    include: { chunks: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          🧠 Chatbot Knowledge Base
        </h1>
        <Link href="/admin" className="text-sm text-primary-700 underline">
          ← Dashboard
        </Link>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        यहाँ थपेको जानकारी Ask SSF AI ले <strong>१ मिनेटभित्र</strong> प्रयोग गर्न
        थाल्छ। AI ले verified तथ्य यहाँबाट र site का guides बाट मात्र लिन्छ —
        त्यसैले प्रमाणित जानकारी मात्र राख्नुहोस् (स्रोत/मिति उल्लेख गर्दा राम्रो)।
      </p>

      <form
        action={addKnowledgeAction}
        className="mt-6 rounded-xl border border-primary-100 bg-white p-5 shadow-sm"
      >
        <label className="block text-sm font-semibold text-gray-800">
          शीर्षक (प्रश्न/विषय)
          <input
            name="title"
            required
            placeholder="जस्तै: SSF को नयाँ ब्याजदर सूचना २०८३"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-gray-800">
          जानकारी (AI ले उत्तरमा प्रयोग गर्ने तथ्य)
          <textarea
            name="content"
            required
            rows={5}
            placeholder="स्पष्ट तथ्य लेख्नुहोस् — दर, रकम, मिति, प्रक्रिया। स्रोत पनि उल्लेख गर्नुहोस्।"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="mt-4 rounded-lg bg-primary-600 px-5 py-2.5 font-semibold text-white hover:bg-primary-700"
        >
          + Knowledge थप्नुहोस्
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {docs.length === 0 && (
          <p className="rounded-xl bg-gray-50 p-6 text-sm text-gray-500">
            अहिलेसम्म कुनै manual knowledge छैन। AI ले site का 8 guides, 16 FAQs
            र 10 checklists (verified-facts आधारित) बाट उत्तर दिइरहेको छ — यहाँ
            थप्नेबित्तिकै त्यो पनि समावेश हुन्छ।
          </p>
        )}
        {docs.map((d) => (
          <div
            key={d.id}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">
                  {d.title}{" "}
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs ${d.approved ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {d.approved ? "Live" : "Off"}
                  </span>
                </p>
                <p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-gray-600">
                  {d.chunks.map((c) => c.content).join("\n")}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {d.updatedAt.toISOString().slice(0, 16).replace("T", " ")}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <form action={toggleKnowledgeAction}>
                  <input type="hidden" name="id" value={d.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50"
                  >
                    {d.approved ? "Off गर्नुहोस्" : "Live गर्नुहोस्"}
                  </button>
                </form>
                <form action={deleteKnowledgeAction}>
                  <input type="hidden" name="id" value={d.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
