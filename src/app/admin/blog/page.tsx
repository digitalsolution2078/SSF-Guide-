import { redirect } from "next/navigation";
import Link from "next/link";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/db-blog";

export const metadata = { title: "Content — Blog", robots: { index: false } };
export const dynamic = "force-dynamic";

async function createPostAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (title.length < 5 || excerpt.length < 5 || body.length < 10) return;
  const emoji = String(formData.get("emoji") ?? "📝").trim().slice(0, 4) || "📝";
  const category = String(formData.get("category") ?? "समाचार").trim().slice(0, 30) || "समाचार";
  let slug = slugify(String(formData.get("slug") ?? ""));
  if (!slug) slug = `post-${randomUUID().slice(0, 8)}`;
  // ensure uniqueness
  if (await prisma.blogPost.findUnique({ where: { slug } })) slug = `${slug}-${randomUUID().slice(0, 4)}`;
  await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt,
      body,
      emoji,
      category,
      status: formData.get("publish") === "on" ? "PUBLISHED" : "DRAFT",
    },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

async function togglePublishAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const id = String(formData.get("id"));
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return;
  await prisma.blogPost.update({
    where: { id },
    data: { status: post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
  });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

async function deletePostAction(formData: FormData) {
  "use server";
  const session = await getSession();
  if (!session) redirect("/admin/login");
  await prisma.blogPost.delete({ where: { id: String(formData.get("id")) } }).catch(() => {});
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

export default async function AdminBlogPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" }, take: 200 });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin" className="text-sm text-primary-700 underline">← Dashboard</Link>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">📰 Content — Blog Manager</h1>
      <p className="mt-1 text-sm text-gray-500">
        यहाँबाट लेखेका blog post तुरुन्तै <code>/blog</code> मा देखिन्छन् (Published भए)।
        Body मा <code>## शीर्षक</code>, <code>### उप-शीर्षक</code>, <code>- bullet</code> प्रयोग गर्न मिल्छ।
      </p>

      <form action={createPostAction} className="mt-6 space-y-3 rounded-xl border border-gray-200 bg-white p-5">
        <p className="font-semibold text-gray-800">नयाँ post</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <label className="block text-sm font-semibold text-gray-700 sm:col-span-3">
            शीर्षक
            <input name="title" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Emoji
            <input name="emoji" defaultValue="📝" maxLength={4} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-700">
            Category
            <input name="category" defaultValue="समाचार" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="block text-sm font-semibold text-gray-700">
            Slug (वैकल्पिक, English)
            <input name="slug" placeholder="ssf-new-update" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
        </div>
        <label className="block text-sm font-semibold text-gray-700">
          Excerpt (छोटो सार)
          <textarea name="excerpt" rows={2} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <label className="block text-sm font-semibold text-gray-700">
          Body
          <textarea name="body" rows={8} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm" />
        </label>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="publish" defaultChecked className="h-4 w-4 accent-primary-600" />
            तुरुन्तै publish
          </label>
          <button type="submit" className="ml-auto rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700">
            प्रकाशित गर्नुहोस्
          </button>
        </div>
      </form>

      <div className="mt-8">
        <p className="mb-3 text-sm font-semibold text-gray-800">Blog posts ({posts.length})</p>
        {posts.length === 0 ? (
          <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500">अहिलेसम्म कुनै post छैन।</p>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
                <div>
                  <p className="font-medium text-gray-900">{p.emoji} {p.title}</p>
                  <p className="mt-1 text-xs text-gray-400">{p.status} · {p.category} · /blog/{p.slug}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href={`/admin/blog/${p.id}`} className="rounded-lg border border-primary-300 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-50">Edit</Link>
                  <form action={togglePublishAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                      {p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deletePostAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
