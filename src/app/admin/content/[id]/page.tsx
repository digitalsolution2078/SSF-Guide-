import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Edit FAQ", robots: { index: false } };
export const dynamic = "force-dynamic";

async function saveAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (question.length < 5 || answer.length < 5) return;
  await prisma.fAQ.update({
    where: { id },
    data: {
      question,
      answerRichText: answer,
      popular: formData.get("popular") === "on",
      status: formData.get("publish") === "on" ? "PUBLISHED" : "DRAFT",
    },
  });
  revalidatePath("/faq");
  redirect("/admin/content");
}

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const faq = await prisma.fAQ.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin/content" className="text-sm text-primary-700 underline">
        ← Content
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">FAQ सम्पादन</h1>
      <p className="mt-1 text-xs text-gray-400">/faq/{faq.slug}</p>

      <form
        action={saveAction}
        className="mt-6 space-y-3 rounded-xl border border-gray-200 bg-white p-5"
      >
        <input type="hidden" name="id" value={faq.id} />
        <label className="block text-sm font-semibold text-gray-700">
          प्रश्न
          <input
            name="question"
            defaultValue={faq.question}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="block text-sm font-semibold text-gray-700">
          उत्तर
          <textarea
            name="answer"
            rows={7}
            defaultValue={faq.answerRichText}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="publish" defaultChecked={faq.status === "PUBLISHED"} className="h-4 w-4 accent-primary-600" />
            Published
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="popular" defaultChecked={faq.popular} className="h-4 w-4 accent-action-500" />
            लोकप्रिय
          </label>
          <button
            type="submit"
            className="ml-auto rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
