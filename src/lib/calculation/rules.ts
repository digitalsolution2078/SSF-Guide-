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
 * minBase values are placeholders — the current gazette-notified minimum
 * basic remuneration must be entered by the admin before launch and is
 * versioned via CalculationRule, never hardcoded in UI.
 */

export const MIN_BASE_PLACEHOLDER = 15_000; // NPR/month — replace via admin before launch

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
  minBase: MIN_BASE_PLACEHOLDER,
};

export const INFORMAL_RULE_V1: InformalRuleParams = {
  kind: "INFORMAL",
  workerPct: 11,
  governmentPct: 9.37,
  allocation: { protection: 10.37, oldAge: 10 },
  minBase: MIN_BASE_PLACEHOLDER,
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
  minBase: MIN_BASE_PLACEHOLDER,
};

export const FOREIGN_EMPLOYMENT_RULE_V1: ForeignEmploymentRuleParams = {
  kind: "FOREIGN_EMPLOYMENT",
  minPct: 21.33,
  maxBaseMultiple: 3,
  allocation: { protection: 7.48, oldAge: 13.85 },
  industrialMinBase: MIN_BASE_PLACEHOLDER,
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
