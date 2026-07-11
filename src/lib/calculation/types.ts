// Rule parameter shapes stored in CalculationRule.parameters (Json).
// The engine is pure: rules come in as data, results go out as data.
// Amounts are NPR. Percentages are expressed as percent numbers (11 = 11%).

export type UserCategoryKey =
  | "EMPLOYEE"
  | "EMPLOYER"
  | "FOREIGN_EMPLOYMENT"
  | "SELF_EMPLOYED"
  | "INFORMAL_SECTOR"
  | "CONTRIBUTOR_BENEFICIARY"
  | "DEPENDENT_FAMILY"
  | "UNSURE";

export interface FormalRuleParams {
  kind: "FORMAL";
  employeePct: number; // 11
  employerPct: number; // 20
  employeeSplit: { pf: number; sst: number }; // 10 + 1
  employerSplit: { pf: number; gratuity: number; other: number }; // 10 + 8.33 + 1.67
  allocation: {
    medical: number; // 1.20
    accident: number; // 0.80
    dependent: number; // 0.67
    oldAge: number; // 28.33
    pension: number; // 20
    retirement: number; // 8.33
  };
  /** Minimum basic remuneration (NPR/month) — admin-configurable, gazette-sourced. */
  minBase: number;
}

export interface InformalRuleParams {
  kind: "INFORMAL";
  workerPct: number; // 11
  governmentPct: number; // 9.37
  allocation: { protection: number; oldAge: number }; // 10.37 + 10
  /** Contribution base is the minimum basic remuneration itself. */
  minBase: number;
}

export interface SelfEmployedRuleParams {
  kind: "SELF_EMPLOYED";
  totalPct: number; // 31
  minBaseMultiple: number; // 1
  maxBaseMultiple: number; // 3
  allocation: {
    medical: number; // 2.4
    accident: number; // 0.80
    dependent: number; // 1.80
    oldAge: number; // 26
    minPensionPct: number; // 16
  };
  minBase: number;
}

export interface ForeignEmploymentRuleParams {
  kind: "FOREIGN_EMPLOYMENT";
  minPct: number; // 21.33
  maxBaseMultiple: number; // 3
  allocation: { protection: number; oldAge: number }; // 7.48 + 13.85
  /** Industrial minimum basic remuneration (NPR/month). */
  industrialMinBase: number;
}

export type RuleParams =
  | FormalRuleParams
  | InformalRuleParams
  | SelfEmployedRuleParams
  | ForeignEmploymentRuleParams;

export interface RuleMeta {
  ruleId: string;
  version: number;
  effectiveFrom: string; // ISO date
  sourceTitle: string;
}

export interface AmountBreakdownItem {
  key: string;
  labelNe: string;
  labelEn: string;
  pct: number;
  amount: number;
}

export interface ContributionResult {
  base: number;
  employee: { total: number; parts: AmountBreakdownItem[] };
  employer: { total: number; parts: AmountBreakdownItem[] };
  total: number;
  totalPct: number;
  annualProjection: number;
  formula: string;
}

export interface AllocationResult {
  base: number;
  total: number;
  schemes: AmountBreakdownItem[];
  /** Pension vs retirement split inside old age. */
  oldAgeSplit: { pension: AmountBreakdownItem; retirement: AmountBreakdownItem };
}

export interface ForeignEmploymentResult {
  base: number;
  monthlyTotal: number;
  monthlyPct: number;
  periodMonths: number;
  periodTotal: number;
  schemes: AmountBreakdownItem[];
  assumptions: string[];
}

export interface InformalResult {
  base: number;
  worker: AmountBreakdownItem;
  government: AmountBreakdownItem;
  total: number;
  totalPct: number;
  schemes: AmountBreakdownItem[];
}

export class CalculationInputError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "BELOW_MIN_BASE"
      | "ABOVE_MAX_BASE"
      | "INVALID_INPUT",
  ) {
    super(message);
    this.name = "CalculationInputError";
  }
}
