import { describe, expect, it } from "vitest";
import { calculateTakeHome } from "./take-home";

describe("take-home salary", () => {
  it("deducts 11% SSF and shows employer 20% on top", () => {
    const r = calculateTakeHome({
      monthlySalary: 30_000,
      yearId: "2083/84",
      status: "individual",
      ssfContributor: true,
    });
    expect(r.employeeSsf).toBe(3_300); // 11%
    expect(r.employerSsf).toBe(6_000); // 20%
    // net = salary - ssf - tax
    expect(r.netMonthly).toBe(30_000 - r.employeeSsf - r.monthlyTax);
  });

  it("low salary under FY2083/84 exemption pays no tax → net = salary − SSF", () => {
    const r = calculateTakeHome({
      monthlySalary: 30_000, // 360k/year, under Rs 10L → 0 tax
      yearId: "2083/84",
      status: "individual",
      ssfContributor: true,
    });
    expect(r.monthlyTax).toBe(0);
    expect(r.netMonthly).toBe(26_700);
  });

  it("non-SSF: no SSF deduction, but tax applies", () => {
    const r = calculateTakeHome({
      monthlySalary: 30_000,
      yearId: "2083/84",
      status: "individual",
      ssfContributor: false,
    });
    expect(r.employeeSsf).toBe(0);
    expect(r.employerSsf).toBe(0);
    // net = salary - tax only
    expect(r.netMonthly).toBe(30_000 - r.monthlyTax);
  });

  it("annual SSF to your account = (employee + employer) × 12", () => {
    const r = calculateTakeHome({
      monthlySalary: 50_000,
      yearId: "2082/83",
      status: "individual",
      ssfContributor: true,
    });
    expect(r.annualSsfToYourAccount).toBe((r.employeeSsf + r.employerSsf) * 12);
  });
});
