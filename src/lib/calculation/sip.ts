/**
 * SIP (Systematic Investment Plan) calculator — a plain, educational
 * compound-growth model for regular monthly investing. It is NOT SSF-specific:
 * it helps people understand how small monthly amounts grow over time so they
 * can compare it with (or complement) SSF's old-age savings.
 *
 * Model: each month `monthly` is invested and the whole balance compounds at
 * the chosen annual return (compounded monthly). An optional annual step-up
 * increases the monthly amount every year (people's income usually grows).
 * All results are preliminary educational estimates, not investment advice.
 */

export interface SipInput {
  monthly: number; // monthly investment amount
  years: number; // investment horizon in years
  annualReturnPct: number; // expected annual return, e.g. 10
  annualStepUpPct?: number; // optional yearly increase of the monthly amount
}

export interface SipYearPoint {
  year: number;
  invested: number; // cumulative invested by end of this year
  value: number; // fund value at end of this year
}

export interface SipResult {
  months: number;
  totalInvested: number;
  maturityValue: number;
  totalReturns: number;
  timeline: SipYearPoint[]; // one point per year
}

export class SipInputError extends Error {}

export function calculateSip(input: SipInput): SipResult {
  const { monthly, years, annualReturnPct } = input;
  const stepUp = input.annualStepUpPct ?? 0;

  if (!Number.isFinite(monthly) || monthly <= 0)
    throw new SipInputError("Monthly amount must be positive");
  if (!Number.isFinite(years) || years <= 0 || years > 60)
    throw new SipInputError("Years must be between 1 and 60");
  if (annualReturnPct < 0 || annualReturnPct > 30)
    throw new SipInputError("Return must be between 0 and 30 percent");
  if (stepUp < 0 || stepUp > 25)
    throw new SipInputError("Step-up must be between 0 and 25 percent");

  const months = Math.round(years * 12);
  const monthlyRate = annualReturnPct / 100 / 12;

  let dep = monthly;
  let value = 0;
  let invested = 0;
  const timeline: SipYearPoint[] = [];

  for (let m = 1; m <= months; m++) {
    value = value * (1 + monthlyRate) + dep;
    invested += dep;
    if (m % 12 === 0) {
      timeline.push({
        year: Math.round(m / 12),
        invested: Math.round(invested),
        value: Math.round(value),
      });
      dep *= 1 + stepUp / 100;
    }
  }

  return {
    months,
    totalInvested: Math.round(invested),
    maturityValue: Math.round(value),
    totalReturns: Math.round(value - invested),
    timeline,
  };
}
