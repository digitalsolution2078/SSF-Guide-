/**
 * SSF Financial Planner — long-horizon projection of the old-age scheme.
 *
 * Model: every month `pensionPct` (20%) and `retirementPct` (8.33%) of the
 * basic salary are deposited into two funds that compound monthly at the
 * chosen annual return (SSF investment returns historically ~6-8%; user
 * adjustable). Salary optionally grows yearly. At age 60:
 *   monthly pension = pension-fund balance ÷ 160  (Procedure 2075 §20)
 *   gratuity/retirement fund = lump sum.
 * All results are preliminary educational estimates.
 */

export interface PlannerInput {
  monthlyBasicSalary: number;
  currentAge: number; // years
  retirementAge?: number; // default 60
  annualReturnPct: number; // e.g. 7
  annualSalaryGrowthPct: number; // e.g. 5
}

export interface PlannerYearPoint {
  age: number;
  pensionFund: number;
  retirementFund: number;
  totalContributed: number;
}

export interface PlannerResult {
  contributionYears: number;
  contributionMonths: number;
  pensionFundAt60: number;
  retirementLumpSumAt60: number;
  monthlyPensionAt60: number;
  totalContributed: number;
  totalReturnsEarned: number;
  eligibleForPension: boolean; // needs >= 180 months
  timeline: PlannerYearPoint[]; // sampled yearly
}

export const PENSION_PCT = 20;
export const RETIREMENT_PCT = 8.33;
export const PENSION_DIVISOR = 160;
export const MIN_PENSION_MONTHS = 180;

export class PlannerInputError extends Error {}

export function planSSF(input: PlannerInput): PlannerResult {
  const retirementAge = input.retirementAge ?? 60;
  const { monthlyBasicSalary, currentAge, annualReturnPct, annualSalaryGrowthPct } =
    input;

  if (!Number.isFinite(monthlyBasicSalary) || monthlyBasicSalary <= 0)
    throw new PlannerInputError("Salary must be positive");
  if (!Number.isFinite(currentAge) || currentAge < 16 || currentAge >= retirementAge)
    throw new PlannerInputError("Age must be between 16 and retirement age");
  if (annualReturnPct < 0 || annualReturnPct > 20)
    throw new PlannerInputError("Return must be between 0 and 20 percent");
  if (annualSalaryGrowthPct < 0 || annualSalaryGrowthPct > 25)
    throw new PlannerInputError("Salary growth must be between 0 and 25 percent");

  const months = Math.round((retirementAge - currentAge) * 12);
  const monthlyRate = annualReturnPct / 100 / 12;

  let salary = monthlyBasicSalary;
  let pensionFund = 0;
  let retirementFund = 0;
  let contributed = 0;
  const timeline: PlannerYearPoint[] = [];

  for (let m = 1; m <= months; m++) {
    const pensionDeposit = (salary * PENSION_PCT) / 100;
    const retirementDeposit = (salary * RETIREMENT_PCT) / 100;
    pensionFund = pensionFund * (1 + monthlyRate) + pensionDeposit;
    retirementFund = retirementFund * (1 + monthlyRate) + retirementDeposit;
    contributed += pensionDeposit + retirementDeposit;

    if (m % 12 === 0) {
      salary *= 1 + annualSalaryGrowthPct / 100;
      timeline.push({
        age: Math.round(currentAge + m / 12),
        pensionFund: Math.round(pensionFund),
        retirementFund: Math.round(retirementFund),
        totalContributed: Math.round(contributed),
      });
    }
  }

  const pensionFundAt60 = Math.round(pensionFund);
  const retirementLumpSumAt60 = Math.round(retirementFund);

  return {
    contributionYears: Math.floor(months / 12),
    contributionMonths: months,
    pensionFundAt60,
    retirementLumpSumAt60,
    monthlyPensionAt60: Math.round(pensionFund / PENSION_DIVISOR),
    totalContributed: Math.round(contributed),
    totalReturnsEarned: Math.round(pensionFund + retirementFund - contributed),
    eligibleForPension: months >= MIN_PENSION_MONTHS,
    timeline,
  };
}
