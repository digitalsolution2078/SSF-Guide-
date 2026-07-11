// Acceptance tests §12.1 — exact vectors from
// planning/phase1-development-prompt.md
import { describe, expect, it } from "vitest";
import {
  calculateAllocation,
  calculateForeignEmployment,
  calculateFormalContribution,
  calculateInformal,
  calculateSelfEmployed,
  estimateMonthlyPension,
} from "./engine";
import {
  FOREIGN_EMPLOYMENT_RULE_V1,
  FORMAL_RULE_V1,
  INFORMAL_RULE_V1,
  SELF_EMPLOYED_RULE_V1,
} from "./rules";
import { CalculationInputError } from "./types";

describe("C1 — formal contribution, basic salary 30,000", () => {
  const r = calculateFormalContribution(30_000, FORMAL_RULE_V1);

  it("employee 3,300 / employer 6,000 / total 9,300", () => {
    expect(r.employee.total).toBe(3_300);
    expect(r.employer.total).toBe(6_000);
    expect(r.total).toBe(9_300);
  });

  it("employee split: PF 3,000 + SST 300", () => {
    const pf = r.employee.parts.find((p) => p.key === "employee_pf")!;
    const sst = r.employee.parts.find((p) => p.key === "employee_sst")!;
    expect(pf.amount).toBe(3_000);
    expect(sst.amount).toBe(300);
  });

  it("employer parts sum exactly to employer total", () => {
    const sum = r.employer.parts.reduce((a, p) => a + p.amount, 0);
    expect(sum).toBe(r.employer.total);
  });
});

describe("C2 — allocation, basic salary 30,000", () => {
  const r = calculateAllocation(30_000, FORMAL_RULE_V1);
  const byKey = Object.fromEntries(r.schemes.map((s) => [s.key, s.amount]));

  it("medical 360 / accident 240 / dependent 201 / old age 8,499", () => {
    expect(byKey.medical).toBe(360);
    expect(byKey.accident).toBe(240);
    expect(byKey.dependent).toBe(201);
    expect(byKey.old_age).toBe(8_499);
  });

  it("segments sum to 9,300", () => {
    expect(r.schemes.reduce((a, s) => a + s.amount, 0)).toBe(9_300);
  });

  it("old age splits into pension 6,000 + retirement 2,499", () => {
    expect(r.oldAgeSplit.pension.amount).toBe(6_000);
    expect(r.oldAgeSplit.retirement.amount).toBe(2_499);
    expect(
      r.oldAgeSplit.pension.amount + r.oldAgeSplit.retirement.amount,
    ).toBe(byKey.old_age);
  });
});

describe("C3 — annual projection", () => {
  it("30,000 basic → 111,600/year", () => {
    const r = calculateFormalContribution(30_000, FORMAL_RULE_V1);
    expect(r.annualProjection).toBe(111_600);
  });
});

describe("C4 — below minimum basic remuneration", () => {
  it("rejects with BELOW_MIN_BASE and no result", () => {
    expect(() =>
      calculateFormalContribution(FORMAL_RULE_V1.minBase - 1, FORMAL_RULE_V1),
    ).toThrowError(CalculationInputError);
    try {
      calculateFormalContribution(1_000, FORMAL_RULE_V1);
    } catch (e) {
      expect((e as CalculationInputError).code).toBe("BELOW_MIN_BASE");
    }
  });

  it("rejects zero/negative/NaN", () => {
    for (const bad of [0, -5, NaN, Infinity]) {
      expect(() =>
        calculateFormalContribution(bad, FORMAL_RULE_V1),
      ).toThrowError(CalculationInputError);
    }
  });
});

describe("C6 — foreign employment at industrial minimum M", () => {
  const M = FOREIGN_EMPLOYMENT_RULE_V1.industrialMinBase;
  const r = calculateForeignEmployment(
    { base: M, periodMonths: 12 },
    FOREIGN_EMPLOYMENT_RULE_V1,
  );

  it("monthly total = 21.33% of M", () => {
    expect(r.monthlyTotal).toBe(Math.round(M * 0.2133));
  });

  it("split 7.48% / 13.85% of M, summing to monthly total", () => {
    const protection = r.schemes.find((s) => s.key === "protection")!;
    const oldAge = r.schemes.find((s) => s.key === "old_age")!;
    expect(protection.pct).toBe(7.48);
    expect(oldAge.pct).toBe(13.85);
    expect(protection.amount + oldAge.amount).toBe(r.monthlyTotal);
  });

  it("period total = monthly × months", () => {
    expect(r.periodTotal).toBe(r.monthlyTotal * 12);
  });
});

describe("C7 — foreign employment base above 3×M", () => {
  it("rejects with ABOVE_MAX_BASE", () => {
    const M = FOREIGN_EMPLOYMENT_RULE_V1.industrialMinBase;
    try {
      calculateForeignEmployment(
        { base: 3 * M + 1, periodMonths: 12 },
        FOREIGN_EMPLOYMENT_RULE_V1,
      );
      expect.unreachable("should have thrown");
    } catch (e) {
      expect((e as CalculationInputError).code).toBe("ABOVE_MAX_BASE");
    }
  });
});

describe("C8 — self-employed at 2× minimum wage W", () => {
  const W = SELF_EMPLOYED_RULE_V1.minBase;
  const r = calculateSelfEmployed(2 * W, SELF_EMPLOYED_RULE_V1);

  it("total = 31% of 2W", () => {
    expect(r.total).toBe(Math.round(2 * W * 0.31));
  });

  it("allocation 2.4 / 0.8 / 1.8 / 26", () => {
    const pcts = Object.fromEntries(r.schemes.map((s) => [s.key, s.pct]));
    expect(pcts.medical).toBe(2.4);
    expect(pcts.accident).toBe(0.8);
    expect(pcts.dependent).toBe(1.8);
    expect(pcts.old_age).toBe(26);
  });

  it("pension portion ≥ 16% of 2W", () => {
    expect(r.pensionMinimum).toBeGreaterThanOrEqual(
      Math.floor(2 * W * 0.16),
    );
  });

  it("rejects base above 3× minimum", () => {
    expect(() =>
      calculateSelfEmployed(3 * W + 1, SELF_EMPLOYED_RULE_V1),
    ).toThrowError(CalculationInputError);
  });
});

describe("C9 — informal sector", () => {
  const r = calculateInformal(INFORMAL_RULE_V1);

  it("worker 11% and government 9.37% shown separately; total 20.37%", () => {
    expect(r.worker.pct).toBe(11);
    expect(r.government.pct).toBe(9.37);
    expect(r.totalPct).toBeCloseTo(20.37);
    expect(r.total).toBe(Math.round(INFORMAL_RULE_V1.minBase * 0.2037));
  });

  it("scheme segments sum to total", () => {
    expect(r.schemes.reduce((a, s) => a + s.amount, 0)).toBe(r.total);
  });
});

describe("pension formula (÷160) — Procedure 2075 §20", () => {
  it("balance 1,600,000 → 10,000/month", () => {
    expect(estimateMonthlyPension(1_600_000)).toBe(10_000);
  });
});

describe("rounding reconciliation invariant", () => {
  it("allocation segments always sum to total across salary sweep", () => {
    for (let salary = 15_000; salary <= 200_000; salary += 1_037) {
      const r = calculateAllocation(salary, FORMAL_RULE_V1);
      expect(r.schemes.reduce((a, s) => a + s.amount, 0)).toBe(r.total);
    }
  });
});
