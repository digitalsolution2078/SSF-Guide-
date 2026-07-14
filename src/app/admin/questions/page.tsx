import { redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Unanswered Questions", robots: { index: false } };
export const dynamic = "force-dynamic";

async function resolveAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  await prisma.unansweredQuestion.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/questions");
}

export default async function QuestionsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const questions = await prisma.unansweredQuestion.findMany({
    orderBy: [{ count: "desc" }, { createdAt: "desc" }],
    take: 200,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">      <h1 className="mt-2 text-2xl font-bold text-gray-900">
        ❓ Unanswered Questions
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        AI ले भरोसाका साथ जवाफ दिन नसकेका प्रश्न — content gap देखाउँछ। यी विषयमा
        guide/FAQ/knowledge थपे chatbot बलियो हुन्छ।
      </p>

      {questions.length === 0 ? (
        <p className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
          अहिलेसम्म कुनै unanswered question छैन। 🎉
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {questions.map((q) => (
            <li
              key={q.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div>
                <p className="text-gray-900">{q.question}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {q.origin} · {q.count}× · {q.createdAt.toISOString().slice(0, 10)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {q.count > 1 && (
                  <span className="rounded-full bg-action-50 px-2 py-1 text-xs font-bold text-action-700">
                    {q.count}×
                  </span>
                )}
                <Link
                  href="/admin/knowledge"
                  className="rounded-lg border border-primary-300 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50"
                >
                  + Knowledge
                </Link>
                <form action={resolveAction}>
                  <input type="hidden" name="id" value={q.id} />
                  <button
                    type="submit"
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                  >
                    ✓ Resolve
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
