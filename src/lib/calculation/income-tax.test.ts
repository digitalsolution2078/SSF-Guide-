import { describe, expect, it } from "vitest";
import { calculateIncomeTax, TaxInputError } from "./income-tax";

describe("Nepal income tax — FY 2082/83", () => {
  it("individual with SSF: first 1% band waived", () => {
    // Rs 800,000, SSF contributor, no other deductions
    const r = calculateIncomeTax({
      yearId: "2082/83",
      status: "individual",
      annualIncome: 800_000,
      ssfContributor: true,
    });
    // Band1 0–500k @1% waived = 0; Band2 500–700k @10% = 20,000; Band3 700–800k @20% = 20,000
    expect(r.sstWaived).toBe(5_000);
    expect(r.totalTax).toBe(40_000);
  });

  it("individual without SSF pays the 1% SST", () => {
    const r = calculateIncomeTax({
      yearId: "2082/83",
      status: "individual",
      annualIncome: 800_000,
      ssfContributor: false,
    });
    // adds 1% of 500,000 = 5,000
    expect(r.totalTax).toBe(45_000);
    expect(r.sstWaived).toBe(0);
  });

  it("couple has a wider first band", () => {
    const r = calculateIncomeTax({
      yearId: "2082/83",
      status: "couple",
      annualIncome: 600_000,
      ssfContributor: true,
    });
    // all within 0–600k first band, waived
    expect(r.totalTax).toBe(0);
  });

  it("applies retirement + insurance deductions with caps", () => {
    const r = calculateIncomeTax({
      yearId: "2082/83",
      status: "individual",
      annualIncome: 1_000_000,
      ssfContributor: true,
      retirementContribution: 200_000, // under both caps
      lifeInsurancePremium: 60_000, // capped to 40,000
      healthInsurancePremium: 30_000, // capped to 20,000
    });
    expect(r.totalDeductions).toBe(260_000);
    expect(r.taxableIncome).toBe(740_000);
  });
});

describe("Nepal income tax — FY 2083/84 (unified)", () => {
  it("income up to Rs 10 lakh with SSF is tax-free", () => {
    const r = calculateIncomeTax({
      yearId: "2083/84",
      status: "individual",
      annualIncome: 1_000_000,
      ssfContributor: true,
    });
    expect(r.totalTax).toBe(0);
    expect(r.sstWaived).toBe(10_000); // 1% of 10 lakh
  });

  it("ignores married/single distinction (unified)", () => {
    const asIndividual = calculateIncomeTax({
      yearId: "2083/84",
      status: "individual",
      annualIncome: 2_000_000,
      ssfContributor: true,
    });
    const asCouple = calculateIncomeTax({
      yearId: "2083/84",
      status: "couple",
      annualIncome: 2_000_000,
      ssfContributor: true,
    });
    expect(asIndividual.totalTax).toBe(asCouple.totalTax);
  });

  it("computes progressive tax at Rs 20 lakh", () => {
    const r = calculateIncomeTax({
      yearId: "2083/84",
      status: "individual",
      annualIncome: 2_000_000,
      ssfContributor: true,
    });
    // 0–10L @1% waived; 10–15L @10% = 50,000; 15–20L @20% = 100,000
    expect(r.totalTax).toBe(150_000);
  });
});

describe("female rebate and edge cases", () => {
  it("applies a 10% rebate", () => {
    const base = calculateIncomeTax({
      yearId: "2083/84",
      status: "individual",
      annualIncome: 2_000_000,
      ssfContributor: true,
    });
    const withRebate = calculateIncomeTax({
      yearId: "2083/84",
      status: "individual",
      annualIncome: 2_000_000,
      ssfContributor: true,
      femaleRebate: true,
    });
    expect(withRebate.totalTax).toBe(Math.round(base.totalTax * 0.9));
  });

  it("zero income → zero tax", () => {
    const r = calculateIncomeTax({
      yearId: "2083/84",
      status: "individual",
      annualIncome: 0,
      ssfContributor: false,
    });
    expect(r.totalTax).toBe(0);
    expect(r.effectiveRatePct).toBe(0);
  });

  it("rejects an unknown fiscal year", () => {
    expect(() =>
      calculateIncomeTax({
        yearId: "2099/00",
        status: "individual",
        annualIncome: 100,
        ssfContributor: false,
      }),
    ).toThrow(TaxInputError);
  });
});
