"use server";

import { z } from "zod";
import {
  calculateFormalContribution,
  calculateAllocation,
  calculateSelfEmployed,
  calculateForeignEmployment,
  calculateInformal,
} from "@/lib/calculation/engine";
import { getActiveRule } from "@/lib/calculation/provider";
import type {
  AllocationResult,
  AmountBreakdownItem,
  ContributionResult,
  ForeignEmploymentRuleParams,
  FormalRuleParams,
  InformalRuleParams,
  RuleMeta,
  SelfEmployedRuleParams,
} from "@/lib/calculation/types";
import { CalculationInputError } from "@/lib/calculation/types";

const inputSchema = z.object({
  sector: z.enum(["FORMAL", "SELF_EMPLOYED", "FOREIGN", "INFORMAL"]).default("FORMAL"),
  basicSalary: z.coerce.number().finite().positive().max(10_000_000).optional(),
  locale: z.enum(["ne", "en"]).default("ne"),
});

/** Normalized view for non-formal sectors. */
export interface GenericContributionView {
  headline: Array<{ label: string; amount: number; highlight?: boolean }>;
  schemes: AmountBreakdownItem[];
  note: string;
}

export interface ContributionActionState {
  status: "idle" | "ok" | "error";
  sector?: "FORMAL" | "SELF_EMPLOYED" | "FOREIGN" | "INFORMAL";
  errorCode?: "BELOW_MIN_BASE" | "ABOVE_MAX_BASE" | "INVALID_INPUT";
  errorMessage?: string;
  result?: ContributionResult;
  allocation?: AllocationResult;
  generic?: GenericContributionView;
  meta?: RuleMeta;
}

export async function calculateContributionAction(
  _prev: ContributionActionState,
  formData: FormData,
): Promise<ContributionActionState> {
  const parsed = inputSchema.safeParse({
    sector: formData.get("sector") ?? "FORMAL",
    basicSalary: formData.get("basicSalary") || undefined,
    locale: formData.get("locale") || "ne",
  });
  if (!parsed.success) {
    return { status: "error", errorCode: "INVALID_INPUT" };
  }
  const { sector, basicSalary, locale } = parsed.data;
  const isEn = locale === "en";
  const T = (ne: string, en: string) => (isEn ? en : ne);

  try {
    switch (sector) {
      case "FORMAL": {
        if (!basicSalary) return { status: "error", sector, errorCode: "INVALID_INPUT" };
        const { params, meta } = await getActiveRule("CONTRIBUTION");
        const rule = params as FormalRuleParams;
        return {
          status: "ok",
          sector,
          result: calculateFormalContribution(basicSalary, rule),
          allocation: calculateAllocation(basicSalary, rule),
          meta,
        };
      }
      case "SELF_EMPLOYED": {
        if (!basicSalary) return { status: "error", sector, errorCode: "INVALID_INPUT" };
        const { params, meta } = await getActiveRule("SELF_EMPLOYED");
        const r = calculateSelfEmployed(basicSalary, params as SelfEmployedRuleParams);
        return {
          status: "ok",
          sector,
          meta,
          generic: {
            headline: [
              { label: T("रोजेको आधार रकम", "Chosen base amount"), amount: r.base },
              { label: T("मासिक योगदान (३१%)", "Monthly contribution (31%)"), amount: r.total, highlight: true },
              { label: T("वार्षिक जम्मा", "Annual total"), amount: r.total * 12 },
            ],
            schemes: r.schemes,
            note: T(
              "स्वरोजगारले न्यूनतम पारिश्रमिकदेखि त्यसको ३ गुणासम्मको आधार रोजेर ३१% योगदान गर्छ — वृद्ध अवस्थाको २६% मध्ये कम्तीमा १६% pension योजनामा जान्छ।",
              "The self-employed choose a base from the minimum wage up to 3× that and contribute 31% — of the 26% old-age portion, at least 16% goes to the pension scheme.",
            ),
          },
        };
      }
      case "FOREIGN": {
        if (!basicSalary) return { status: "error", sector, errorCode: "INVALID_INPUT" };
        const { params, meta } = await getActiveRule("FOREIGN_EMPLOYMENT");
        const r = calculateForeignEmployment(
          { base: basicSalary, periodMonths: 12 },
          params as ForeignEmploymentRuleParams,
        );
        return {
          status: "ok",
          sector,
          meta,
          generic: {
            headline: [
              { label: T("आधार रकम", "Base amount"), amount: r.base },
              { label: T(`मासिक योगदान (${r.monthlyPct}%)`, `Monthly contribution (${r.monthlyPct}%)`), amount: r.monthlyTotal, highlight: true },
              { label: T("वार्षिक जम्मा", "Annual total"), amount: r.periodTotal },
            ],
            schemes: r.schemes,
            note: T(
              "वैदेशिक रोजगारीमा औद्योगिक न्यूनतम पारिश्रमिकको कम्तीमा २१.३३% (३ गुणासम्मको आधारमा) योगदान गरिन्छ — ७.४८% सुरक्षा योजना, १३.८५% वृद्ध अवस्था।",
              "In foreign employment, at least 21.33% of the industrial minimum wage is contributed (on a base up to 3×) — 7.48% to protection schemes, 13.85% to old age.",
            ),
          },
        };
      }
      case "INFORMAL": {
        const { params, meta } = await getActiveRule("INFORMAL");
        const r = calculateInformal(params as InformalRuleParams);
        return {
          status: "ok",
          sector,
          meta,
          generic: {
            headline: [
              { label: T(`श्रमिक स्वयं (${r.worker.pct}%)`, `Worker's share (${r.worker.pct}%)`), amount: r.worker.amount },
              { label: T(`नेपाल सरकार थप (${r.government.pct}%)`, `Government adds (${r.government.pct}%)`), amount: r.government.amount },
              { label: T(`कुल मासिक (${r.totalPct}%)`, `Total monthly (${r.totalPct}%)`), amount: r.total, highlight: true },
            ],
            schemes: r.schemes,
            note: T(
              "अनौपचारिक क्षेत्रमा न्यूनतम आधारभूत पारिश्रमिकको ११% श्रमिकले तिर्छ र ९.३७% नेपाल सरकारले थपिदिन्छ — सबैभन्दा सस्तो सामाजिक सुरक्षा। (आधार: न्यूनतम पारिश्रमिक; आफ्नो रकम राख्नु पर्दैन)",
              "In the informal sector the worker pays 11% of the minimum basic wage and the Government of Nepal adds 9.37% — the most affordable social security. (Base: minimum wage; you don't enter your own amount)",
            ),
          },
        };
      }
    }
  } catch (e) {
    if (e instanceof CalculationInputError) {
      return { status: "error", sector, errorCode: e.code, errorMessage: e.message };
    }
    throw e;
  }
}
