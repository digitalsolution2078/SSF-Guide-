import { describe, expect, it } from "vitest";
import {
  planSSF,
  planSSFByContribution,
  PlannerInputError,
  PENSION_DIVISOR,
} from "./planner";

describe("contribution-amount mode", () => {
  it("matches salary mode when amounts equal the formal percentages", () => {
    const bySalary = planSSF({
      monthlyBasicSalary: 30_000,
      currentAge: 30,
      annualReturnPct: 7,
      annualSalaryGrowthPct: 5,
    });
    const byAmount = planSSFByContribution({
      monthlyPensionContribution: 6_000, // 20% of 30k
      monthlyRetirementContribution: 2_499, // 8.33% of 30k
      currentAge: 30,
      annualReturnPct: 7,
      annualContributionGrowthPct: 5,
    });
    // same maths — tiny rounding drift allowed
    expect(
      Math.abs(byAmount.pensionFundAt60 - bySalary.pensionFundAt60),
    ).toBeLessThan(5);
    expect(byAmount.monthlyPensionAt60).toBe(
      Math.round(byAmount.pensionFundAt60 / PENSION_DIVISOR),
    );
  });

  it("allows zero retirement contribution (e.g. informal sector)", () => {
    const r = planSSFByContribution({
      monthlyPensionContribution: 1_500,
      monthlyRetirementContribution: 0,
      currentAge: 25,
      annualReturnPct: 7,
      annualContributionGrowthPct: 0,
    });
    expect(r.retirementLumpSumAt60).toBe(0);
    expect(r.pensionFundAt60).toBeGreaterThan(0);
  });

  it("rejects non-positive pension contribution", () => {
    expect(() =>
      planSSFByContribution({
        monthlyPensionContribution: 0,
        monthlyRetirementContribution: 100,
        currentAge: 30,
        annualReturnPct: 7,
        annualContributionGrowthPct: 0,
      }),
    ).toThrow(PlannerInputError);
  });
});

describe("SSF Financial Planner", () => {
  it("zero return, no growth: funds equal plain contribution sums", () => {
    const r = planSSF({
      monthlyBasicSalary: 30_000,
      currentAge: 30,
      annualReturnPct: 0,
      annualSalaryGrowthPct: 0,
    });
    // 30 years = 360 months; pension 6,000/mo, retirement 2,499/mo
    expect(r.contributionMonths).toBe(360);
    expect(r.pensionFundAt60).toBe(6_000 * 360);
    expect(r.retirementLumpSumAt60).toBe(Math.round(2_499 * 360));
    expect(r.totalReturnsEarned).toBe(0);
    expect(r.monthlyPensionAt60).toBe(
      Math.round((6_000 * 360) / PENSION_DIVISOR),
    );
  });

  it("7% return beats 0% return and earns positive returns", () => {
    const base = {
      monthlyBasicSalary: 30_000,
      currentAge: 30,
      annualSalaryGrowthPct: 0,
    };
    const r0 = planSSF({ ...base, annualReturnPct: 0 });
    const r7 = planSSF({ ...base, annualReturnPct: 7 });
    expect(r7.pensionFundAt60).toBeGreaterThan(r0.pensionFundAt60);
    expect(r7.totalReturnsEarned).toBeGreaterThan(0);
    // 30y of 6,000/mo at 7% ≈ 7.3M (annuity FV) — sanity band
    expect(r7.pensionFundAt60).toBeGreaterThan(6_500_000);
    expect(r7.pensionFundAt60).toBeLessThan(8_000_000);
  });

  it("pension = fund ÷ 160", () => {
    const r = planSSF({
      monthlyBasicSalary: 50_000,
      currentAge: 35,
      annualReturnPct: 7,
      annualSalaryGrowthPct: 3,
    });
    expect(r.monthlyPensionAt60).toBe(
      Math.round(r.pensionFundAt60 / PENSION_DIVISOR),
    );
  });

  it("flags pension ineligibility under 180 months", () => {
    const r = planSSF({
      monthlyBasicSalary: 30_000,
      currentAge: 50,
      annualReturnPct: 7,
      annualSalaryGrowthPct: 0,
    });
    expect(r.contributionMonths).toBe(120);
    expect(r.eligibleForPension).toBe(false);
  });

  it("rejects invalid inputs", () => {
    expect(() =>
      planSSF({ monthlyBasicSalary: -1, currentAge: 30, annualReturnPct: 7, annualSalaryGrowthPct: 0 }),
    ).toThrow(PlannerInputError);
    expect(() =>
      planSSF({ monthlyBasicSalary: 30_000, currentAge: 61, annualReturnPct: 7, annualSalaryGrowthPct: 0 }),
    ).toThrow(PlannerInputError);
    expect(() =>
      planSSF({ monthlyBasicSalary: 30_000, currentAge: 30, annualReturnPct: 25, annualSalaryGrowthPct: 0 }),
    ).toThrow(PlannerInputError);
  });

  it("timeline is yearly and monotonically increasing", () => {
    const r = planSSF({
      monthlyBasicSalary: 30_000,
      currentAge: 30,
      annualReturnPct: 7,
      annualSalaryGrowthPct: 5,
    });
    expect(r.timeline.length).toBe(30);
    for (let i = 1; i < r.timeline.length; i++) {
      expect(r.timeline[i].pensionFund).toBeGreaterThan(
        r.timeline[i - 1].pensionFund,
      );
    }
  });
});
