import { prisma } from "./db";

/** Admin-authored blog posts (edited via /admin/blog), rendered live on /blog
 *  alongside the file-based posts. All reads are best-effort. */
export interface DbBlogLite {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  emoji: string;
  category: string;
  body: string;
  publishedAt: Date;
}

export async function getPublishedDbBlog(): Promise<DbBlogLite[]> {
  try {
    return await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 200,
    });
  } catch {
    return [];
  }
}

export async function getPublishedDbBlogBySlug(slug: string): Promise<DbBlogLite | null> {
  try {
    return await prisma.blogPost.findFirst({ where: { slug, status: "PUBLISHED" } });
  } catch {
    return null;
  }
}

export function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
  return s || "";
}
