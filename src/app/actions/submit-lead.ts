"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const CONSENT_TEXT =
  "म सहायता अनुरोधका लागि आफ्नो जानकारी प्रयोग गर्न सहमत छु। मैले बुझेको छु कि Digital Solution स्वतन्त्र सहायता प्रदायक हो, आधिकारिक SSF कार्यालय होइन।";
const MARKETING_TEXT = "म Digital Solution का उपयोगी updates प्राप्त गर्न चाहन्छु।";

// simple per-IP limiter (shared-nothing; fine for single instance)
const WINDOW_MS = 3600_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

const schema = z.object({
  serviceSlug: z.enum([
    "kyc_verification",
    "registration",
    "profile_correction",
    "nominee_update",
    "contribution_problem",
    "employer_assistance",
    "claim_guidance",
    "other",
  ]),
  fullName: z.string().trim().min(2).max(100),
  mobile: z.string().trim().regex(/^\+?[0-9]{7,15}$/),
  district: z.string().trim().min(2).max(50),
  userCategory: z.enum([
    "EMPLOYEE",
    "EMPLOYER",
    "FOREIGN_EMPLOYMENT",
    "SELF_EMPLOYED",
    "INFORMAL_SECTOR",
    "CONTRIBUTOR_BENEFICIARY",
    "DEPENDENT_FAMILY",
    "UNSURE",
  ]),
  preferredContact: z.enum(["WHATSAPP", "PHONE", "EMAIL"]),
  email: z.string().trim().email().max(100).optional().or(z.literal("")),
  currentCountry: z.string().trim().max(60).optional().or(z.literal("")),
  issueDescription: z.string().trim().min(5).max(2000),
  hasSSFAccount: z.enum(["yes", "no", "unknown"]),
  kycComplete: z.enum(["yes", "no", "unknown"]),
  consent: z.literal("on"),
  marketing: z.string().optional(),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});

export interface LeadFormState {
  status: "idle" | "error";
  message?: string;
}

async function nextRefNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const start = new Date(Date.UTC(year, 0, 1));
  const count = await prisma.lead.count({ where: { createdAt: { gte: start } } });
  return `DS-SSF-${year}-${String(count + 1).padStart(6, "0")}`;
}

export async function submitLeadAction(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) hits.clear();
  if (recent.length > MAX_PER_WINDOW) {
    return {
      status: "error",
      message: "धेरै अनुरोध पठाइयो — कृपया केही समयपछि प्रयास गर्नुहोस्।",
    };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message:
        "फाराममा केही मिलेन — नाम, mobile नम्बर, जिल्ला र समस्या विवरण जाँच्नुहोस् र सहमति checkbox मा टिक लगाउनुहोस्।",
    };
  }
  const d = parsed.data;
  if (d.website) return { status: "idle" }; // honeypot: silently accept

  const service = await prisma.service.findUnique({
    where: { slug: d.serviceSlug },
  });
  if (!service) return { status: "error", message: "Service फेला परेन।" };

  const toBool = (v: string) => (v === "yes" ? true : v === "no" ? false : null);

  let refNumber = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    refNumber = await nextRefNumber();
    try {
      await prisma.$transaction(async (tx) => {
        const lead = await tx.lead.create({
          data: {
            refNumber,
            channel: "WEB_FORM",
            serviceId: service.id,
            fullName: d.fullName,
            mobile: d.mobile,
            district: d.district,
            userCategory: d.userCategory,
            preferredLanguage: "ne",
            preferredContact: d.preferredContact,
            email: d.email || null,
            currentCountry: d.currentCountry || null,
            issueDescription: d.issueDescription,
            hasSSFAccount: toBool(d.hasSSFAccount),
            kycComplete: toBool(d.kycComplete),
          },
        });
        await tx.leadStatusHistory.create({
          data: { leadId: lead.id, toStatus: "RECEIVED" },
        });
        await tx.consentRecord.create({
          data: {
            leadId: lead.id,
            kind: "SERVICE_CONTACT",
            granted: true,
            textShown: CONSENT_TEXT,
            ip,
          },
        });
        if (d.marketing === "on") {
          await tx.consentRecord.create({
            data: {
              leadId: lead.id,
              kind: "MARKETING",
              granted: true,
              textShown: MARKETING_TEXT,
              ip,
            },
          });
        }
      });
      break;
    } catch (e) {
      if (attempt === 2) throw e; // unique refNumber collision retry
    }
  }

  redirect(`/request/success/${refNumber}`);
}
