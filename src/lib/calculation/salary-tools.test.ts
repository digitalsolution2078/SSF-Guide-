import { describe, expect, it } from "vitest";
import {
  netToGross,
  dashainBonus,
  pensionTopUp,
  fdMonthlyIncome,
  dailyWageOvertime,
  rebateOptimizer,
} from "./salary-tools";
import { calculateTakeHome } from "./take-home";

const OPTS = { yearId: "2083/84", status: "individual" as const, ssfContributor: true };

describe("net → gross", () => {
  it("round-trips: take-home(gross) ≈ target net", () => {
    const r = netToGross(45_000, OPTS);
    const back = calculateTakeHome({ monthlySalary: r.gross, ...OPTS }).netMonthly;
    expect(Math.abs(back - 45_000)).toBeLessThanOrEqual(2);
    expect(r.gross).toBeGreaterThan(45_000); // gross exceeds net
  });
});

describe("Dashain bonus", () => {
  it("no tax under exemption → full bonus is net", () => {
    // 30k salary (360k/yr) + 30k bonus = 390k, under Rs 10L → 0 tax
    const r = dashainBonus({
      monthlySalary: 30_000,
      bonusAmount: 30_000,
      ...OPTS,
    });
    expect(r.extraTax).toBe(0);
    expect(r.netBonus).toBe(30_000);
  });
  it("high earner pays marginal tax on the bonus", () => {
    const r = dashainBonus({
      monthlySalary: 200_000, // 2.4M/yr → into 20% band
      bonusAmount: 200_000,
      ...OPTS,
    });
    expect(r.extraTax).toBeGreaterThan(0);
    expect(r.netBonus).toBeLessThan(200_000);
    expect(r.marginalRatePct).toBeGreaterThan(0);
  });
});

describe("pension top-up", () => {
  it("no deficit when SSF pension already meets target", () => {
    const r = pensionTopUp({
      targetMonthly: 20_000,
      ssfPensionMonthly: 25_000,
      yearsToRetirement: 20,
      yearsInRetirement: 20,
      annualReturnPct: 10,
    });
    expect(r.deficit).toBe(0);
    expect(r.requiredMonthlySip).toBe(0);
  });
  it("computes required SIP for the gap", () => {
    const r = pensionTopUp({
      targetMonthly: 50_000,
      ssfPensionMonthly: 20_000,
      yearsToRetirement: 25,
      yearsInRetirement: 20,
      annualReturnPct: 10,
    });
    expect(r.deficit).toBe(30_000);
    expect(r.corpusNeeded).toBe(30_000 * 12 * 20);
    expect(r.requiredMonthlySip).toBeGreaterThan(0);
  });
});

describe("FD monthly income", () => {
  it("nets interest after tax", () => {
    // 10 lakh @ 10% = 100,000/yr gross; 5% tax → 95,000 net
    const r = fdMonthlyIncome({ principal: 1_000_000, annualRatePct: 10, interestTaxPct: 5 });
    expect(r.netAnnual).toBe(95_000);
    expect(r.netMonthly).toBe(Math.round(95_000 / 12));
    expect(r.grossMonthly).toBeGreaterThan(r.netMonthly);
  });
});

describe("daily wage & overtime", () => {
  it("OT paid at 1.5× hourly (Labour Act)", () => {
    const r = dailyWageOvertime({
      monthlySalary: 26_000,
      workingDaysPerMonth: 26,
      hoursPerDay: 8,
      otHours: 10,
    });
    expect(r.dailyRate).toBe(1_000);
    expect(r.hourlyRate).toBe(125);
    expect(r.otRate).toBe(Math.round(125 * 1.5));
    // OT pay is computed from the unrounded rate (187.5 × 10), then rounded
    expect(r.otPay).toBe(Math.round(125 * 1.5 * 10));
  });
});

describe("rebate optimizer", () => {
  it("computes remaining deduction room", () => {
    const r = rebateOptimizer({
      annualIncome: 1_200_000,
      currentRetirement: 100_000,
      currentLife: 10_000,
      currentHealth: 0,
    });
    expect(r.retirementCap).toBe(400_000); // 1/3 of 1.2M
    expect(r.retirementRoom).toBe(300_000);
    expect(r.lifeRoom).toBe(30_000);
    expect(r.healthRoom).toBe(20_000);
    expect(r.totalRoom).toBe(350_000);
  });
});
