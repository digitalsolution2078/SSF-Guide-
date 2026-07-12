import type {
  ForeignEmploymentRuleParams,
  FormalRuleParams,
  InformalRuleParams,
  SelfEmployedRuleParams,
} from "./types";

/**
 * Canonical Phase-1 rule parameters, mirrored into the database by
 * `prisma/seed.ts`. Single source of truth: knowledge-base/verified-facts.md §1.
 *
 * minBase = the minimum BASIC remuneration used as the SSF contribution base.
 * FY 2082/83: the national minimum wage is Rs 19,550/month = Rs 12,170 basic
 * + Rs 7,380 dearness allowance (effective Shrawan 1, 2082). SSF contributions
 * are levied on the basic portion, so the minimum base is Rs 12,170 — verified
 * by the foreign-employment figure 21.33% × 12,170 ≈ Rs 2,596/month. Update
 * when the minimum wage is revised; ideally versioned via CalculationRule.
 */

export const MIN_BASIC_REMUNERATION = 12_170; // NPR/month basic (FY 2082/83)
/** @deprecated use MIN_BASIC_REMUNERATION */
export const MIN_BASE_PLACEHOLDER = MIN_BASIC_REMUNERATION;

export const FORMAL_RULE_V1: FormalRuleParams = {
  kind: "FORMAL",
  employeePct: 11,
  employerPct: 20,
  employeeSplit: { pf: 10, sst: 1 },
  employerSplit: { pf: 10, gratuity: 8.33, other: 1.67 },
  allocation: {
    medical: 1.2,
    accident: 0.8,
    dependent: 0.67,
    oldAge: 28.33,
    pension: 20,
    retirement: 8.33,
  },
  minBase: MIN_BASIC_REMUNERATION,
};

export const INFORMAL_RULE_V1: InformalRuleParams = {
  kind: "INFORMAL",
  workerPct: 11,
  governmentPct: 9.37,
  allocation: { protection: 10.37, oldAge: 10 },
  minBase: MIN_BASIC_REMUNERATION,
};

export const SELF_EMPLOYED_RULE_V1: SelfEmployedRuleParams = {
  kind: "SELF_EMPLOYED",
  totalPct: 31,
  minBaseMultiple: 1,
  maxBaseMultiple: 3,
  allocation: {
    medical: 2.4,
    accident: 0.8,
    dependent: 1.8,
    oldAge: 26,
    minPensionPct: 16,
  },
  minBase: MIN_BASIC_REMUNERATION,
};

export const FOREIGN_EMPLOYMENT_RULE_V1: ForeignEmploymentRuleParams = {
  kind: "FOREIGN_EMPLOYMENT",
  minPct: 21.33,
  maxBaseMultiple: 3,
  allocation: { protection: 7.48, oldAge: 13.85 },
  industrialMinBase: MIN_BASIC_REMUNERATION,
};

export const RULE_SOURCES = {
  FORMAL:
    "सामाजिक सुरक्षा योजना सञ्चालन कार्यविधि, २०७५ (५औँ संशोधन) दफा २५ — लागू २०८२।०१।०१",
  INFORMAL:
    "अनौपचारिक क्षेत्र तथा स्वरोजगार कार्यविधि, २०७९ (१म संशोधन) दफा ५(क)",
  SELF_EMPLOYED:
    "अनौपचारिक क्षेत्र तथा स्वरोजगार कार्यविधि, २०७९ (१म संशोधन) दफा ५(ख)",
  FOREIGN_EMPLOYMENT:
    "वैदेशिक रोजगार कार्यविधि, २०७९ (१म संशोधन २०८०।११।१७) दफा ६",
} as const;
