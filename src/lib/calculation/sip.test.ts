import { describe, expect, it } from "vitest";
import { calculateSip, SipInputError } from "./sip";

describe("SIP calculator", () => {
  it("with 0% return, value equals amount invested", () => {
    const r = calculateSip({ monthly: 1_000, years: 5, annualReturnPct: 0 });
    expect(r.totalInvested).toBe(60_000); // 1000 * 60
    expect(r.maturityValue).toBe(60_000);
    expect(r.totalReturns).toBe(0);
  });

  it("earns positive returns with a positive rate", () => {
    const r = calculateSip({ monthly: 3_000, years: 20, annualReturnPct: 10 });
    expect(r.totalInvested).toBe(720_000); // 3000 * 240
    expect(r.maturityValue).toBeGreaterThan(r.totalInvested);
    expect(r.totalReturns).toBe(r.maturityValue - r.totalInvested);
  });

  it("matches the standard SIP future-value formula (end-of-month)", () => {
    const monthly = 5_000;
    const years = 10;
    const annual = 12;
    const n = years * 12;
    const i = annual / 100 / 12;
    // FV of an ordinary annuity: P * ((1+i)^n - 1) / i
    const expected = Math.round((monthly * ((1 + i) ** n - 1)) / i);
    const r = calculateSip({ monthly, years, annualReturnPct: annual });
    // allow ±1 rupee rounding drift from per-month rounding
    expect(Math.abs(r.maturityValue - expected)).toBeLessThanOrEqual(2);
  });

  it("step-up increases the maturity value", () => {
    const flat = calculateSip({ monthly: 2_000, years: 15, annualReturnPct: 10 });
    const stepped = calculateSip({
      monthly: 2_000,
      years: 15,
      annualReturnPct: 10,
      annualStepUpPct: 10,
    });
    expect(stepped.maturityValue).toBeGreaterThan(flat.maturityValue);
    expect(stepped.totalInvested).toBeGreaterThan(flat.totalInvested);
  });

  it("produces one timeline point per year", () => {
    const r = calculateSip({ monthly: 1_000, years: 12, annualReturnPct: 8 });
    expect(r.timeline).toHaveLength(12);
    expect(r.timeline[0].year).toBe(1);
    expect(r.timeline[11].year).toBe(12);
  });

  it("rejects invalid input", () => {
    expect(() => calculateSip({ monthly: 0, years: 5, annualReturnPct: 8 })).toThrow(
      SipInputError,
    );
    expect(() => calculateSip({ monthly: 1_000, years: 0, annualReturnPct: 8 })).toThrow(
      SipInputError,
    );
    expect(() =>
      calculateSip({ monthly: 1_000, years: 5, annualReturnPct: 50 }),
    ).toThrow(SipInputError);
  });
});
