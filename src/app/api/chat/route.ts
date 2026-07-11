import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { retrieveChunks, type KnowledgeChunkLite } from "@/lib/chat/knowledge";
import { generateAssistantReply, isGeminiConfigured } from "@/lib/chat/gemini";
import { prisma } from "@/lib/db";

// Admin-managed knowledge (approved KnowledgeDocuments), cached for 60s so
// every chat turn doesn't hit the database.
let dbChunksCache: { at: number; chunks: KnowledgeChunkLite[] } | null = null;

async function getDbChunks(): Promise<KnowledgeChunkLite[]> {
  if (dbChunksCache && Date.now() - dbChunksCache.at < 60_000) {
    return dbChunksCache.chunks;
  }
  try {
    const docs = await prisma.knowledgeDocument.findMany({
      where: { approved: true },
      include: { chunks: true },
    });
    const chunks = docs.map((d) => ({
      id: `db:${d.id}`,
      title: d.title,
      href: "/school",
      content: `${d.title}\n${d.chunks.map((c) => c.content).join("\n")}`,
      sourceTitles: ["Digital Solution knowledge base"],
      lastVerified: d.updatedAt.toISOString().slice(0, 10),
    }));
    dbChunksCache = { at: Date.now(), chunks };
    return chunks;
  } catch {
    return dbChunksCache?.chunks ?? [];
  }
}

// Simple per-IP sliding-window rate limit (in-memory; replace with a
// shared store when deploying multi-instance).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) hits.clear(); // memory backstop
  return recent.length > MAX_PER_WINDOW;
}

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        text: z.string().min(1).max(2_000),
      }),
    )
    .min(1)
    .max(20),
  userCategory: z.string().max(40).optional(),
  topic: z.string().max(40).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "धेरै प्रश्न पठाइयो — कृपया एक मिनेटपछि प्रयास गर्नुहोस्।" },
      { status: 429 },
    );
  }

  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { messages, userCategory, topic } = parsed.data;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json({ error: "No user message" }, { status: 400 });
  }

  // Category/topic context sharpens retrieval
  const retrievalQuery = [lastUser.text, topic, userCategory]
    .filter(Boolean)
    .join(" ");
  const chunks = retrieveChunks(retrievalQuery, 6, await getDbChunks());

  const reply = await generateAssistantReply(messages, chunks);

  return NextResponse.json({
    ...reply,
    aiAvailable: isGeminiConfigured(),
    citations: chunks.slice(0, 3).map((c) => ({
      title: c.title,
      href: c.href,
      sources: c.sourceTitles,
      lastVerified: c.lastVerified,
    })),
  });
}
