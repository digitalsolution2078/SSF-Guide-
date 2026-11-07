/**
 * SSF contributor-loan eligibility & maximum-amount estimator.
 *
 * Rules mirror the Fund's published notices (see src/content/loans.ts):
 *  - Home loan: ≥18 months, ≥2 years to retirement (60), lowest of
 *    Rs 1.5 crore / 15 years' salary / salary to age 60, and an EMI cap of
 *    60% of household income (salary + spouse salary + other taxed income).
 *  - Education loan: ≥36 months, ≥2 years to retirement, lowest of
 *    Rs 35 lakh / 15 years' salary / salary to age 60 / actual cost.
 *  - Special loan: ≥36 months, ≥2 years to retirement, KYC updated,
 *    80% of the Retirement Amount balance.
 *
 * Pure functions; every output is a preliminary estimate — the Fund's
 * valuation and repayment-capacity assessment decide the final limit.
 */

export type LoanType = "home-land" | "home-build" | "education" | "special";

export interface LoanEligibilityInput {
  /** monthly basic salary (NPR) */
  basicSalary: number;
  /** current age in completed years */
  age: number;
  /** months of regular contribution so far */
  monthsContributed: number;
  /** monthly salary of a contributing spouse, if any (NPR) */
  spouseSalary?: number;
  /** other monthly income with tax deducted at source (NPR) */
  otherIncome?: number;
  /** balance in the Retirement Amount (NPR) — for the special loan */
  retirementBalance?: number;
  /** actual course cost (NPR) — caps the education loan */
  educationCost?: number;
}

export type LoanCap =
  | "ceiling"
  | "salary15"
  | "salaryTo60"
  | "emi"
  | "balance"
  | "cost"
  | "none";

export type IneligibleReason = "months" | "retirement" | "balance";

export interface LoanLimit {
  type: LoanType;
  eligible: boolean;
  reasons: IneligibleReason[];
  /** months still needed before the contribution rule is met (0 when met) */
  monthsShort: number;
  maxAmount: number;
  cappedBy: LoanCap;
  /** annual interest assumed for EMI maths (null when the Fund hasn't published one) */
  ratePct: number | null;
  /** term used for the EMI illustration, years */
  termYears: number;
  /** estimated monthly EMI at maxAmount (0 when no published rate) */
  emi: number;
  /** monthly EMI ceiling (60% of household income) — home loan only */
  emiCap?: number;
}

export const RETIREMENT_AGE = 60;
export const HOME_LOAN_CEILING = 15_000_000;
export const EDUCATION_LOAN_CEILING = 3_500_000;
export const HOME_LOAN_MIN_MONTHS = 18;
export const EDUCATION_LOAN_MIN_MONTHS = 36;
export const SPECIAL_LOAN_MIN_MONTHS = 36;
export const MIN_YEARS_TO_RETIRE = 2;
export const EMI_INCOME_SHARE = 0.6;
export const SPECIAL_LOAN_SHARE = 0.8;
export const HOME_LAND_RATE = 6;
export const HOME_BUILD_RATE = 5.85;
export const HOME_LOAN_MAX_TERM = 20;
export const EDUCATION_LOAN_MAX_TERM = 15;
/** Illustrative only — the Fund has not published the education-loan rate. */
export const EDUCATION_RATE_ASSUMED = 6;

export function monthlyEmi(principal: number, annualRatePct: number, years: number): number {
  const n = Math.round(years * 12);
  if (n <= 0 || principal <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  return r === 0 ? principal / n : (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
}

/** Largest principal whose EMI at (rate, years) does not exceed `emiCap`. */
export function principalForEmi(emiCap: number, annualRatePct: number, years: number): number {
  const n = Math.round(years * 12);
  if (n <= 0 || emiCap <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  return r === 0 ? emiCap * n : (emiCap * (1 - (1 + r) ** -n)) / r;
}

function pickMin(candidates: { cap: LoanCap; value: number }[]): { cap: LoanCap; value: number } {
  return candidates.reduce((best, c) => (c.value < best.value ? c : best));
}

export function assessLoan(type: LoanType, input: LoanEligibilityInput): LoanLimit {
  const salary = Math.max(0, input.basicSalary || 0);
  const age = Math.max(0, input.age || 0);
  const months = Math.max(0, Math.floor(input.monthsContributed || 0));
  const yearsTo60 = Math.max(0, RETIREMENT_AGE - age);

  const reasons: IneligibleReason[] = [];
  const minMonths =
    type === "education"
      ? EDUCATION_LOAN_MIN_MONTHS
      : type === "special"
        ? SPECIAL_LOAN_MIN_MONTHS
        : HOME_LOAN_MIN_MONTHS;
  if (months < minMonths) reasons.push("months");
  if (yearsTo60 < MIN_YEARS_TO_RETIRE) reasons.push("retirement");

  const salary15 = salary * 12 * 15;
  const salaryTo60 = salary * 12 * yearsTo60;

  if (type === "special") {
    const balance = Math.max(0, input.retirementBalance || 0);
    if (balance <= 0) reasons.push("balance");
    const max = Math.round(balance * SPECIAL_LOAN_SHARE);
    return {
      type,
      eligible: reasons.length === 0,
      reasons,
      monthsShort: Math.max(0, minMonths - months),
      maxAmount: reasons.length === 0 ? max : 0,
      cappedBy: "balance",
      ratePct: null,
      termYears: Math.min(5, Math.max(1, yearsTo60)),
      emi: 0,
    };
  }

  if (type === "education") {
    const candidates: { cap: LoanCap; value: number }[] = [
      { cap: "ceiling", value: EDUCATION_LOAN_CEILING },
      { cap: "salary15", value: salary15 },
      { cap: "salaryTo60", value: salaryTo60 },
    ];
    if (input.educationCost && input.educationCost > 0) candidates.push({ cap: "cost", value: input.educationCost });
    const best = pickMin(candidates);
    const termYears = Math.min(EDUCATION_LOAN_MAX_TERM, Math.max(1, yearsTo60));
    const max = reasons.length === 0 ? Math.round(best.value) : 0;
    return {
      type,
      eligible: reasons.length === 0,
      reasons,
      monthsShort: Math.max(0, minMonths - months),
      maxAmount: max,
      cappedBy: best.cap,
      ratePct: EDUCATION_RATE_ASSUMED,
      termYears,
      emi: monthlyEmi(max, EDUCATION_RATE_ASSUMED, termYears),
    };
  }

  // home loan (land or build)
  const rate = type === "home-land" ? HOME_LAND_RATE : HOME_BUILD_RATE;
  const termYears = Math.min(HOME_LOAN_MAX_TERM, Math.max(1, yearsTo60));
  const household = salary + Math.max(0, input.spouseSalary || 0) + Math.max(0, input.otherIncome || 0);
  const emiCap = household * EMI_INCOME_SHARE;
  const byEmi = principalForEmi(emiCap, rate, termYears);
  const best = pickMin([
    { cap: "ceiling", value: HOME_LOAN_CEILING },
    { cap: "salary15", value: salary15 },
    { cap: "salaryTo60", value: salaryTo60 },
    { cap: "emi", value: byEmi },
  ]);
  const max = reasons.length === 0 ? Math.round(best.value) : 0;
  return {
    type,
    eligible: reasons.length === 0,
    reasons,
    monthsShort: Math.max(0, minMonths - months),
    maxAmount: max,
    cappedBy: best.cap,
    ratePct: rate,
    termYears,
    emi: monthlyEmi(max, rate, termYears),
    emiCap,
  };
}

export function assessAllLoans(input: LoanEligibilityInput): LoanLimit[] {
  return (["home-build", "home-land", "education", "special"] as LoanType[]).map((t) => assessLoan(t, input));
}
