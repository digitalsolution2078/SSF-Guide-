import { describe, expect, it } from "vitest";
import {
  calculateEmi,
  calculateGoalSip,
  calculateLumpsum,
  calculateInflation,
  calculateRetirementCorpus,
  calculateEmergencyFund,
  FinanceInputError,
} from "./finance";

describe("EMI", () => {
  it("zero-interest EMI is principal / months", () => {
    const r = calculateEmi(120_000, 0, 1);
    expect(r.emi).toBe(10_000);
    expect(r.totalInterest).toBe(0);
  });
  it("matches the standard EMI formula", () => {
    // 1,000,000 @ 12% for 10y → ~14,347/month
    const r = calculateEmi(1_000_000, 12, 10);
    expect(r.emi).toBeGreaterThan(14_000);
    expect(r.emi).toBeLessThan(14_500);
    // totalPayment is from the unrounded EMI, so allow small rounding drift
    expect(Math.abs(r.totalPayment - r.emi * 120)).toBeLessThan(120);
    expect(r.totalInterest).toBe(r.totalPayment - r.principal);
  });
  it("rejects bad input", () => {
    expect(() => calculateEmi(0, 10, 5)).toThrow(FinanceInputError);
    expect(() => calculateEmi(100000, 10, 0)).toThrow(FinanceInputError);
  });
});

describe("Goal SIP (reverse)", () => {
  it("is the inverse of forward SIP", () => {
    // require monthly to reach 1,000,000 in 10y @ 12%
    const g = calculateGoalSip(1_000_000, 10, 12);
    const i = 12 / 100 / 12;
    const n = 120;
    const fvOfMonthly = (g.monthly * ((1 + i) ** n - 1)) / i;
    expect(Math.abs(fvOfMonthly - 1_000_000)).toBeLessThan(1_000); // within rounding
  });
  it("zero return → target / months", () => {
    const g = calculateGoalSip(120_000, 1, 0);
    expect(g.monthly).toBe(10_000);
  });
});

describe("Lumpsum / FD", () => {
  it("quarterly compounding beats annual", () => {
    const annual = calculateLumpsum(100_000, 10, 5, 1);
    const quarterly = calculateLumpsum(100_000, 10, 5, 4);
    expect(quarterly.maturity).toBeGreaterThan(annual.maturity);
    expect(annual.interest).toBe(annual.maturity - annual.principal);
  });
  it("annual: 100k @ 10% for 1y = 110k", () => {
    const r = calculateLumpsum(100_000, 10, 1, 1);
    expect(r.maturity).toBe(110_000);
  });
});

describe("Inflation", () => {
  it("future cost rises, purchasing power falls symmetrically", () => {
    const r = calculateInflation(100_000, 10, 7);
    expect(r.futureCost).toBeGreaterThan(100_000);
    expect(r.futureValueOfToday).toBeLessThan(100_000);
    expect(r.erosionPct).toBeGreaterThan(0);
    expect(r.erosionPct).toBeLessThan(100);
  });
});

describe("Retirement corpus", () => {
  it("expense inflates to retirement and corpus scales with retirement years", () => {
    const r = calculateRetirementCorpus({
      currentAge: 30,
      retirementAge: 60,
      monthlyExpenseToday: 30_000,
      inflationPct: 6,
      yearsInRetirement: 20,
    });
    expect(r.yearsToRetirement).toBe(30);
    expect(r.monthlyExpenseAtRetirement).toBeGreaterThan(30_000);
    // corpus is from the unrounded monthly expense, so allow rounding drift
    expect(
      Math.abs(r.corpusNeeded - r.monthlyExpenseAtRetirement * 12 * 20),
    ).toBeLessThan(12 * 20);
  });
});

describe("Emergency fund", () => {
  it("recommends months × expense and computes the gap", () => {
    const r = calculateEmergencyFund(25_000, 6, 50_000);
    expect(r.recommended).toBe(150_000);
    expect(r.gap).toBe(100_000);
    expect(r.monthsCovered).toBe(2);
  });
  it("no gap when already covered", () => {
    const r = calculateEmergencyFund(20_000, 6, 200_000);
    expect(r.gap).toBe(0);
  });
});
