import { redirect } from "next/navigation";
import Link from "next/link";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Content — FAQs", robots: { index: false } };
export const dynamic = "force-dynamic";

async function createFaqAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (question.length < 5 || answer.length < 5) return;
  const publish = formData.get("publish") === "on";
  const popular = formData.get("popular") === "on";
  await prisma.fAQ.create({
    data: {
      slug: `faq-${randomUUID().slice(0, 8)}`,
      locale: "ne",
      question,
      answerRichText: answer,
      popular,
      status: publish ? "PUBLISHED" : "DRAFT",
    },
  });
  revalidatePath("/admin/content");
  revalidatePath("/faq");
}

async function togglePublishAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  const faq = await prisma.fAQ.findUnique({ where: { id } });
  if (!faq) return;
  await prisma.fAQ.update({
    where: { id },
    data: { status: faq.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
  });
  revalidatePath("/admin/content");
  revalidatePath("/faq");
}

async function deleteFaqAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  await prisma.fAQ.delete({ where: { id } }).catch(() => {});
  revalidatePath("/admin/content");
  revalidatePath("/faq");
}

export default async function ContentPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const faqs = await prisma.fAQ.findMany({ orderBy: { question: "asc" }, take: 200 });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin" className="text-sm text-primary-700 underline">
        ← Dashboard
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">✍️ Content — FAQ Manager</h1>
      <p className="mt-1 text-sm text-gray-500">
        यहाँबाट थपेका FAQ तुरुन्तै वेबसाइटको FAQ page मा देखिन्छन् (Published भए)।
        विस्तृत guide जस्ता कानुनी-संवेदनशील content भने verified push (chat) मार्फत नै।
      </p>

      {/* Create */}
      <form
        action={createFaqAction}
        className="mt-6 space-y-3 rounded-xl border border-gray-200 bg-white p-5"
      >
        <p className="font-semibold text-gray-800">नयाँ FAQ थप्नुहोस्</p>
        <label className="block text-sm font-semibold text-gray-700">
          प्रश्न
          <input
            name="question"
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="जस्तै: SSF को पैसा कहिले झिक्न पाइन्छ?"
          />
        </label>
        <label className="block text-sm font-semibold text-gray-700">
          उत्तर (नयाँ लाइन = नयाँ अनुच्छेद; “- ” ले bullet)
          <textarea
            name="answer"
            rows={5}
            required
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="publish" defaultChecked className="h-4 w-4 accent-primary-600" />
            तुरुन्तै publish
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="popular" className="h-4 w-4 accent-action-500" />
            लोकप्रिय
          </label>
          <button
            type="submit"
            className="ml-auto rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700"
          >
            थप्नुहोस्
          </button>
        </div>
      </form>

      {/* List */}
      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold text-gray-800">
          Admin FAQs ({faqs.length})
        </p>
        {faqs.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">
            अहिलेसम्म कुनै admin FAQ छैन। माथिबाट थप्नुहोस्।
          </p>
        ) : (
          <ul className="space-y-3">
            {faqs.map((f) => (
              <li key={f.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{f.question}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {f.status}
                      {f.popular && " · लोकप्रिय"} · /faq/{f.slug}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      href={`/admin/content/${f.id}`}
                      className="rounded-lg border border-primary-300 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50"
                    >
                      Edit
                    </Link>
                    <form action={togglePublishAction}>
                      <input type="hidden" name="id" value={f.id} />
                      <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                        {f.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deleteFaqAction}>
                      <input type="hidden" name="id" value={f.id} />
                      <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
