import { blogPosts } from "@/content/blog";
import { getPublishedDbBlog } from "@/lib/db-blog";

const BASE = "https://ssf.digitalsolutionnepal.com";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Google News sitemap — lists blog posts from the last 2 days (Google News only
 * indexes recent articles; the 30-day cutoff is the hard limit). Submit this
 * separately in Search Console. Fresh admin/blog posts appear here automatically.
 */
export async function GET() {
  const now = Date.now();
  const cutoff = now - 30 * 24 * 60 * 60 * 1000; // 30-day hard limit

  type Entry = { slug: string; title: string; date: string };
  const entries: Entry[] = [];

  for (const p of blogPosts) {
    const t = new Date(`${p.publishDate}T00:00:00Z`).getTime();
    if (t >= cutoff) entries.push({ slug: p.slug, title: p.title, date: new Date(t).toISOString() });
  }
  const db = await getPublishedDbBlog();
  for (const p of db) {
    if (p.publishedAt.getTime() >= cutoff) {
      entries.push({ slug: p.slug, title: p.title, date: p.publishedAt.toISOString() });
    }
  }
  entries.sort((a, b) => (a.date < b.date ? 1 : -1));

  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${BASE}/blog/${e.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>SSF Guide Nepal</news:name>
        <news:language>ne</news:language>
      </news:publication>
      <news:publication_date>${e.date}</news:publication_date>
      <news:title>${esc(e.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=900",
    },
  });
}
