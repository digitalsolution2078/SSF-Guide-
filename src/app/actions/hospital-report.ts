"use server";

import { createHash } from "node:crypto";
import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { hospitals } from "@/content/hospitals";

// Per-IP limiter (shared-nothing; fine for a single instance). The IP itself is
// never stored — only a sha256 hash goes into HospitalReport.ipHash.
const WINDOW_MS = 3600_000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

const hospitalIds = new Set(hospitals.map((h) => h.id));

const schema = z.object({
  hospitalId: z.coerce
    .number()
    .int()
    .refine((id) => hospitalIds.has(id), "unknown hospital"),
  waitMinutes: z
    .union([z.literal(""), z.coerce.number().int().min(0).max(600)])
    .optional(),
  cashless: z.enum(["yes", "no", "unknown"]).default("unknown"),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(400).optional().or(z.literal("")),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});

export interface HospitalReportState {
  status: "idle" | "ok" | "error";
  message?: string;
}

export async function submitHospitalReportAction(
  _prev: HospitalReportState,
  formData: FormData,
): Promise<HospitalReportState> {
  const isEn = formData.get("locale") === "en";
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const ipHash = createHash("sha256").update(ip).digest("hex");

  const now = Date.now();
  const recent = (hits.get(ipHash) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ipHash, recent);
  if (hits.size > 10_000) hits.clear();
  if (recent.length > MAX_PER_WINDOW) {
    return {
      status: "error",
      message: isEn
        ? "Too many reports from this connection — please try again in an hour."
        : "यो connection बाट धेरै report पठाइयो — कृपया एक घण्टापछि प्रयास गर्नुहोस्।",
    };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: isEn
        ? "Something in the form did not check out — pick a star rating and keep the comment under 400 characters."
        : "फाराममा केही मिलेन — star rating रोज्नुहोस् र comment ४०० अक्षरभित्र राख्नुहोस्।",
    };
  }
  const d = parsed.data;
  if (d.website) return { status: "ok" }; // honeypot: silently accept

  try {
    await prisma.hospitalReport.create({
      data: {
        hospitalId: d.hospitalId,
        waitMinutes: typeof d.waitMinutes === "number" ? d.waitMinutes : null,
        cashless: d.cashless === "yes" ? true : d.cashless === "no" ? false : null,
        rating: d.rating,
        comment: d.comment ? d.comment : null,
        status: "PENDING",
        ipHash,
      },
    });
  } catch {
    return {
      status: "error",
      message: isEn
        ? "Could not save your report right now — please try again later."
        : "अहिले report save हुन सकेन — कृपया पछि फेरि प्रयास गर्नुहोस्।",
    };
  }

  return {
    status: "ok",
    message: isEn
      ? "Thank you — your report will appear after moderation."
      : "धन्यवाद — moderation पछि तपाईंको report यहाँ देखिन्छ।",
  };
}
