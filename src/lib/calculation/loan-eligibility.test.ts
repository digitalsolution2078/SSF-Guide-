import { describe, expect, it } from "vitest";
import {
  assessLoan,
  assessAllLoans,
  monthlyEmi,
  principalForEmi,
  HOME_LOAN_CEILING,
  EDUCATION_LOAN_CEILING,
} from "./loan-eligibility";

describe("EMI helpers", () => {
  it("principalForEmi inverts monthlyEmi", () => {
    const p = 5_000_000;
    const emi = monthlyEmi(p, 5.85, 20);
    expect(principalForEmi(emi, 5.85, 20)).toBeCloseTo(p, 0);
  });

  it("handles a zero rate", () => {
    expect(monthlyEmi(120_000, 0, 10)).toBeCloseTo(1_000, 6);
    expect(principalForEmi(1_000, 0, 10)).toBeCloseTo(120_000, 6);
  });
});

describe("home loan", () => {
  it("requires 18 months and 2 years to retirement", () => {
    const base = { basicSalary: 50_000, age: 35, monthsContributed: 12 };
    expect(assessLoan("home-build", base).eligible).toBe(false);
    expect(assessLoan("home-build", base).reasons).toContain("months");
    expect(assessLoan("home-build", base).monthsShort).toBe(6);
    expect(assessLoan("home-build", { ...base, monthsContributed: 18 }).eligible).toBe(true);
    expect(assessLoan("home-build", { ...base, monthsContributed: 18, age: 59 }).reasons).toContain("retirement");
  });

  it("is capped by the 60% EMI rule for a typical salary", () => {
    const r = assessLoan("home-build", { basicSalary: 50_000, age: 35, monthsContributed: 24 });
    expect(r.eligible).toBe(true);
    expect(r.cappedBy).toBe("emi");
    expect(r.emiCap).toBeCloseTo(30_000, 6);
    expect(r.emi).toBeLessThanOrEqual(30_000 + 1);
    expect(r.ratePct).toBe(5.85);
    expect(r.termYears).toBe(20);
  });

  it("uses 6% for land and never exceeds Rs 1.5 crore", () => {
    const r = assessLoan("home-land", {
      basicSalary: 400_000,
      age: 30,
      monthsContributed: 60,
      spouseSalary: 300_000,
    });
    expect(r.ratePct).toBe(6);
    expect(r.maxAmount).toBe(HOME_LOAN_CEILING);
    expect(r.cappedBy).toBe("ceiling");
  });

  it("limits term and salary cap by years to 60", () => {
    const r = assessLoan("home-build", { basicSalary: 200_000, age: 55, monthsContributed: 100 });
    expect(r.termYears).toBe(5);
    // salaryTo60 = 200k*12*5 = 12,000,000 < 15 years' salary; EMI cap at 5 years is lower still
    expect(["salaryTo60", "emi"]).toContain(r.cappedBy);
    expect(r.maxAmount).toBeLessThanOrEqual(12_000_000);
  });
});

describe("education loan", () => {
  it("needs 36 months and caps at Rs 35 lakh or actual cost", () => {
    const base = { basicSalary: 80_000, age: 40, monthsContributed: 30 };
    expect(assessLoan("education", base).eligible).toBe(false);
    const ok = assessLoan("education", { ...base, monthsContributed: 36 });
    expect(ok.eligible).toBe(true);
    expect(ok.maxAmount).toBe(EDUCATION_LOAN_CEILING);
    const withCost = assessLoan("education", { ...base, monthsContributed: 36, educationCost: 1_200_000 });
    expect(withCost.maxAmount).toBe(1_200_000);
    expect(withCost.cappedBy).toBe("cost");
  });
});

describe("special loan", () => {
  it("is 80% of the retirement balance and needs a balance", () => {
    const r = assessLoan("special", { basicSalary: 30_000, age: 30, monthsContributed: 40, retirementBalance: 250_000 });
    expect(r.eligible).toBe(true);
    expect(r.maxAmount).toBe(200_000);
    expect(r.ratePct).toBeNull();
    const none = assessLoan("special", { basicSalary: 30_000, age: 30, monthsContributed: 40 });
    expect(none.eligible).toBe(false);
    expect(none.reasons).toContain("balance");
  });
});

describe("assessAllLoans", () => {
  it("returns the four products in display order", () => {
    const all = assessAllLoans({ basicSalary: 40_000, age: 30, monthsContributed: 20, retirementBalance: 100_000 });
    expect(all.map((l) => l.type)).toEqual(["home-build", "home-land", "education", "special"]);
    expect(all[0].eligible).toBe(true);
    expect(all[2].eligible).toBe(false); // 20 < 36 months
  });
});
