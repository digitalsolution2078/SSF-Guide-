import "server-only";
import {
  FOREIGN_EMPLOYMENT_RULE_V1,
  FORMAL_RULE_V1,
  INFORMAL_RULE_V1,
  MIN_BASIC_REMUNERATION,
  RULE_SOURCES,
  SELF_EMPLOYED_RULE_V1,
} from "./rules";
import { prisma } from "@/lib/db";
import type { RuleMeta, RuleParams } from "./types";

export const MIN_BASE_SETTING_KEY = "minBasicRemuneration";

// Admin-editable minimum basic remuneration (rate manager), cached 60s so the
// calculators don't hit the DB every call. Falls back to the verified constant.
let minBaseCache: { at: number; value: number } | null = null;

export async function getMinBasicRemuneration(): Promise<number> {
  if (minBaseCache && Date.now() - minBaseCache.at < 60_000) return minBaseCache.value;
  let value = MIN_BASIC_REMUNERATION;
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: MIN_BASE_SETTING_KEY } });
    const raw = row?.value;
    const n = typeof raw === "number" ? raw : Number(raw);
    if (Number.isFinite(n) && n > 0) value = n;
  } catch {
    /* fall back to constant */
  }
  minBaseCache = { at: Date.now(), value };
  return value;
}

export type CalculatorKey =
  | "CONTRIBUTION"
  | "ALLOCATION"
  | "FOREIGN_EMPLOYMENT"
  | "INFORMAL"
  | "SELF_EMPLOYED";

export interface ActiveRule {
  params: RuleParams;
  meta: RuleMeta;
}

/**
 * Resolves the active published CalculationRule for a calculator.
 *
 * Stage 1 note: served from canonical in-code constants (mirrors of the
 * seeded v1 rows). When the rate manager (Stage 3, /admin/rates) lands,
 * this becomes a Prisma lookup by calculatorKey + calculation date over
 * PUBLISHED rules — the function signature is already async for that.
 */
export async function getActiveRule(key: CalculatorKey): Promise<ActiveRule> {
  const effectiveFrom = "2025-04-14"; // २०८२ वैशाख १
  const minBase = await getMinBasicRemuneration();
  switch (key) {
    case "CONTRIBUTION":
    case "ALLOCATION":
      return {
        params: { ...FORMAL_RULE_V1, minBase },
        meta: {
          ruleId: "seed-formal-v1",
          version: 1,
          effectiveFrom,
          sourceTitle: RULE_SOURCES.FORMAL,
        },
      };
    case "FOREIGN_EMPLOYMENT":
      return {
        params: { ...FOREIGN_EMPLOYMENT_RULE_V1, industrialMinBase: minBase },
        meta: {
          ruleId: "seed-foreign-v1",
          version: 1,
          effectiveFrom,
          sourceTitle: RULE_SOURCES.FOREIGN_EMPLOYMENT,
        },
      };
    case "INFORMAL":
      return {
        params: { ...INFORMAL_RULE_V1, minBase },
        meta: {
          ruleId: "seed-informal-v1",
          version: 1,
          effectiveFrom,
          sourceTitle: RULE_SOURCES.INFORMAL,
        },
      };
    case "SELF_EMPLOYED":
      return {
        params: { ...SELF_EMPLOYED_RULE_V1, minBase },
        meta: {
          ruleId: "seed-selfemployed-v1",
          version: 1,
          effectiveFrom,
          sourceTitle: RULE_SOURCES.SELF_EMPLOYED,
        },
      };
  }
}
