import { prisma } from "./db";

/**
 * Admin-authored FAQs stored in the database (edited via /admin/content) and
 * rendered live on the public site alongside the verified file-based FAQs.
 * All reads are best-effort: if the DB is unreachable, public pages still work.
 */
export interface DbFaqLite {
  id: string;
  slug: string;
  question: string;
  answerRichText: string;
  popular: boolean;
}

const select = {
  id: true,
  slug: true,
  question: true,
  answerRichText: true,
  popular: true,
} as const;

export async function getPublishedDbFaqs(): Promise<DbFaqLite[]> {
  try {
    return await prisma.fAQ.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ popular: "desc" }, { question: "asc" }],
      select,
      take: 200,
    });
  } catch {
    return [];
  }
}

export async function getPublishedDbFaqBySlug(slug: string): Promise<DbFaqLite | null> {
  try {
    return await prisma.fAQ.findFirst({
      where: { slug, status: "PUBLISHED" },
      select,
    });
  } catch {
    return null;
  }
}
