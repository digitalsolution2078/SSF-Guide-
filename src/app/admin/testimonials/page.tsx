import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Testimonials", robots: { index: false } };
export const dynamic = "force-dynamic";

async function createAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const name = String(formData.get("name") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  if (name.length < 2 || quote.length < 5) return;
  await prisma.testimonial.create({
    data: {
      name,
      role: String(formData.get("role") ?? "").trim() || null,
      quote,
      rating: Math.min(5, Math.max(1, Number(formData.get("rating")) || 5)),
      published: formData.get("publish") === "on",
    },
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

async function togglePublishAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  const t = await prisma.testimonial.findUnique({ where: { id } });
  if (!t) return;
  await prisma.testimonial.update({ where: { id }, data: { published: !t.published } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

async function deleteAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  await prisma.testimonial.delete({ where: { id: String(formData.get("id")) } }).catch(() => {});
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export default async function TestimonialsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const items = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">      <h1 className="mt-2 text-2xl font-medium text-ink-900">⭐ Testimonials</h1>
      <p className="mt-1 text-sm text-ink-500">
        वास्तविक ग्राहकका अनुभव मात्र थप्नुहोस् (अनुमतिसहित)। Published भएका home page मा
        देखिन्छन्। कुनै नहुँदा section देखिँदैन।
      </p>

      <form action={createAction} className="mt-6 space-y-3 rounded-xl border border-ink-200 bg-white p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="block text-sm font-semibold text-ink-700">
            नाम
            <input name="name" required className="mt-1 w-full rounded-lg border border-ink-300 px-3 py-2" />
          </label>
          <label className="block text-sm font-semibold text-ink-700 sm:col-span-2">
            भूमिका (वैकल्पिक)
            <input name="role" placeholder="वैदेशिक रोजगार, कतार" className="mt-1 w-full rounded-lg border border-ink-300 px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm font-semibold text-ink-700">
          अनुभव (quote)
          <textarea name="quote" rows={3} required className="mt-1 w-full rounded-lg border border-ink-300 px-3 py-2" />
        </label>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            Rating
            <select name="rating" defaultValue="5" className="rounded-lg border border-ink-300 px-2 py-1">
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="publish" defaultChecked className="h-4 w-4 accent-primary-600" />
            Publish
          </label>
          <button type="submit" className="ml-auto rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700">थप्नुहोस्</button>
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-xl border border-ink-200 bg-white p-6 text-center text-ink-500">अहिलेसम्म कुनै testimonial छैन।</p>
        ) : (
          items.map((t) => (
            <div key={t.id} className="flex items-start justify-between gap-3 rounded-xl border border-ink-200 bg-white p-4">
              <div>
                <p className="text-sm text-ink-800">“{t.quote}”</p>
                <p className="mt-1 text-xs text-ink-500">
                  — {t.name}{t.role && `, ${t.role}`} · {"★".repeat(t.rating)} · {t.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <form action={togglePublishAction}>
                  <input type="hidden" name="id" value={t.id} />
                  <button className="rounded-lg border border-ink-300 px-3 py-1.5 text-xs text-ink-600 hover:bg-ink-50">
                    {t.published ? "Unpublish" : "Publish"}
                  </button>
                </form>
                <form action={deleteAction}>
                  <input type="hidden" name="id" value={t.id} />
                  <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
