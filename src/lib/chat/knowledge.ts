import { articles } from "@/content/articles";
import { faqs } from "@/content/faqs";
import { checklists } from "@/content/checklists";
import { sourceByKey } from "@/content/sources";
import type { ContentBlock } from "@/content/types";

/**
 * Keyword retrieval over the approved content layer.
 * When Postgres+pgvector lands (Stage 4 full), this becomes an embedding
 * lookup over KnowledgeChunk — the KnowledgeChunkLite shape matches.
 */
export interface KnowledgeChunkLite {
  id: string;
  title: string;
  href: string;
  content: string;
  sourceTitles: string[];
  lastVerified: string;
}

function blocksToText(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "p":
        case "note":
          return b.text;
        case "list":
        case "steps":
          return b.items.join("; ");
        case "table":
          return b.rows.map((r) => r.join(" — ")).join("; ");
      }
    })
    .join("\n");
}

function sourceTitles(keys: string[]): string[] {
  return keys
    .map((k) => sourceByKey(k)?.title)
    .filter((t): t is string => Boolean(t));
}

function buildChunks(): KnowledgeChunkLite[] {
  const chunks: KnowledgeChunkLite[] = [];

  for (const a of articles) {
    // one chunk per section keeps retrieval focused
    for (const [i, s] of a.sections.entries()) {
      chunks.push({
        id: `article:${a.slug}:${i}`,
        title: `${a.title} — ${s.heading}`,
        href: `/school/${a.categorySlug}/${a.slug}`,
        content: `${a.shortAnswer}\n${s.heading}\n${blocksToText(s.blocks)}`,
        sourceTitles: sourceTitles(a.sourceKeys),
        lastVerified: a.lastVerified,
      });
    }
  }
  for (const f of faqs) {
    chunks.push({
      id: `faq:${f.slug}`,
      title: f.question,
      href: `/faq/${f.slug}`,
      content: `${f.question}\n${blocksToText(f.answerBlocks)}`,
      sourceTitles: sourceTitles(f.sourceKeys),
      lastVerified: f.lastVerified,
    });
  }
  for (const c of checklists) {
    chunks.push({
      id: `checklist:${c.slug}`,
      title: `${c.processName} — कागजात checklist`,
      href: `/checklists/${c.slug}`,
      content: `${c.processName}\nकागजात: ${c.items.map((i) => i.label).join("; ")}\nकहाँ: ${c.whereCompleted}\nप्रक्रिया: ${c.expectedWorkflow.join("; ")}`,
      sourceTitles: sourceTitles(c.sourceKeys),
      lastVerified: c.lastVerified,
    });
  }
  return chunks;
}

const ALL_CHUNKS = buildChunks();

/** Tokenize for both Devanagari and Latin text. */
function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s,।/?!.:;()\[\]{}"'`~—–-]+/)
    .filter((t) => t.length >= 2);
}

export function retrieveChunks(
  query: string,
  k = 6,
  extraChunks: KnowledgeChunkLite[] = [],
): KnowledgeChunkLite[] {
  const qTokens = tokens(query);
  if (qTokens.length === 0) return [];

  const scored = [...ALL_CHUNKS, ...extraChunks].map((chunk) => {
    const body = chunk.title.toLowerCase() + "\n" + chunk.content.toLowerCase();
    let score = 0;
    for (const t of qTokens) {
      if (chunk.title.toLowerCase().includes(t)) score += 3;
      else if (body.includes(t)) score += 1;
    }
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s) => s.chunk);
}
