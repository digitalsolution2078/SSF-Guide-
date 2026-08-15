import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Edit Post", robots: { index: false } };
export const dynamic = "force-dynamic";

async function saveAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (title.length < 5 || excerpt.length < 5 || body.length < 10) return;
  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      excerpt,
      body,
      emoji: String(formData.get("emoji") ?? "📝").trim().slice(0, 4) || "📝",
      category: String(formData.get("category") ?? "समाचार").trim().slice(0, 30) || "समाचार",
      status: formData.get("publish") === "on" ? "PUBLISHED" : "DRAFT",
    },
  });
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin/blog" className="text-sm text-primary-700 underline">← Blog</Link>
      <h1 className="mt-2 text-2xl font-medium text-ink-900">Post सम्पादन</h1>
      <p className="mt-1 text-xs text-ink-400">/blog/{post.slug}</p>
      <form action={saveAction} className="mt-6 space-y-3 rounded-xl border border-ink-200 bg-white p-5">
        <input type="hidden" name="id" value={post.id} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <label className="block text-sm font-semibold text-ink-700 sm:col-span-3">
            शीर्षक
            <input name="title" defaultValue={post.title} required className="mt-1 w-full rounded-lg border border-ink-300 px-3 py-2" />
          </label>
          <label className="block text-sm font-semibold text-ink-700">
            Emoji
            <input name="emoji" defaultValue={post.emoji} maxLength={4} className="mt-1 w-full rounded-lg border border-ink-300 px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm font-semibold text-ink-700">
          Category
          <input name="category" defaultValue={post.category} className="mt-1 w-full rounded-lg border border-ink-300 px-3 py-2" />
        </label>
        <label className="block text-sm font-semibold text-ink-700">
          Excerpt
          <textarea name="excerpt" rows={2} defaultValue={post.excerpt} required className="mt-1 w-full rounded-lg border border-ink-300 px-3 py-2" />
        </label>
        <label className="block text-sm font-semibold text-ink-700">
          Body
          <textarea name="body" rows={10} defaultValue={post.body} required className="mt-1 w-full rounded-lg border border-ink-300 px-3 py-2 font-mono text-sm" />
        </label>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="publish" defaultChecked={post.status === "PUBLISHED"} className="h-4 w-4 accent-primary-600" />
            Published
          </label>
          <button type="submit" className="ml-auto rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700">Save</button>
        </div>
      </form>
    </div>
  );
}
