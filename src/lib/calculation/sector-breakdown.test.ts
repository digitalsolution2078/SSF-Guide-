import { describe, expect, it } from "vitest";
import { computeSectorBreakdown } from "./sector-breakdown";

describe("sector breakdown", () => {
  it("formal @ 30,000 splits into pension/gratuity/insurance", () => {
    const r = computeSectorBreakdown("formal", 30_000);
    expect(r.total).toBe(9_300); // 31%
    const pension = r.buckets.find((b) => b.key === "pension")!;
    const gratuity = r.buckets.find((b) => b.key === "gratuity")!;
    const insurance = r.buckets.find((b) => b.key === "insurance")!;
    expect(pension.amount).toBe(6_000); // 20%
    expect(gratuity.amount).toBe(2_499); // 8.33%
    expect(insurance.amount).toBe(801); // 2.67%
    // buckets sum to total (within rounding)
    const sum = r.buckets.reduce((a, b) => a + b.amount, 0);
    expect(Math.abs(sum - r.total)).toBeLessThanOrEqual(2);
  });

  it("formal whoPays: employee 11% + employer 20%", () => {
    const r = computeSectorBreakdown("formal", 30_000);
    expect(r.whoPays.find((w) => w.key === "employee")!.amount).toBe(3_300);
    expect(r.whoPays.find((w) => w.key === "employer")!.amount).toBe(6_000);
  });

  it("self-employed pension 16% + retirement 10% + insurance 5%", () => {
    const r = computeSectorBreakdown("self-employed", 20_000);
    expect(r.totalPct).toBe(31);
    expect(r.buckets.find((b) => b.key === "pension")!.amount).toBe(3_200);
    expect(r.buckets.find((b) => b.key === "gratuity")!.amount).toBe(2_000);
    expect(r.buckets.find((b) => b.key === "insurance")!.amount).toBe(1_000);
  });

  it("informal: worker 11% + government 9.37% = 20.37%", () => {
    const r = computeSectorBreakdown("informal", 15_000);
    expect(r.totalPct).toBeCloseTo(20.37);
    expect(r.whoPays.find((w) => w.key === "government")).toBeTruthy();
    expect(r.buckets).toHaveLength(2); // old-age + insurance
  });

  it("foreign: 21.33% self-paid, old-age + insurance", () => {
    const r = computeSectorBreakdown("foreign", 20_000);
    expect(r.totalPct).toBeCloseTo(21.33);
    expect(r.whoPays).toHaveLength(1);
    expect(r.buckets.map((b) => b.key).sort()).toEqual(["insurance", "oldage"]);
  });

  it("handles invalid base as zero", () => {
    const r = computeSectorBreakdown("formal", NaN);
    expect(r.total).toBe(0);
  });
});
