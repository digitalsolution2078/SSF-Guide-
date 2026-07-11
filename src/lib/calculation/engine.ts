import {
  AllocationResult,
  AmountBreakdownItem,
  CalculationInputError,
  ContributionResult,
  ForeignEmploymentResult,
  ForeignEmploymentRuleParams,
  FormalRuleParams,
  InformalResult,
  InformalRuleParams,
  SelfEmployedRuleParams,
} from "./types";

/**
 * Money rounding: round to the nearest rupee at each displayed line, but
 * guarantee segments sum exactly to the rounded total by assigning the
 * residual to the largest segment (largest-remainder style, single pass).
 */
export function roundNPR(amount: number): number {
  return Math.round(amount);
}

function pctOf(base: number, pct: number): number {
  // Normalize IEEE-754 noise (e.g. 15000 × 20.37 → 305549.99999999994)
  // before the caller rounds to whole rupees.
  return Math.round(base * pct * 1e6) / 1e6 / 100;
}

function reconcile(
  items: AmountBreakdownItem[],
  targetTotal: number,
): AmountBreakdownItem[] {
  const sum = items.reduce((a, i) => a + i.amount, 0);
  const diff = targetTotal - sum;
  if (diff === 0) return items;
  const largest = items.reduce((a, b) => (b.amount > a.amount ? b : a));
  return items.map((i) =>
    i === largest ? { ...i, amount: i.amount + diff } : i,
  );
}

function assertPositiveAmount(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new CalculationInputError(
      `${label} must be a positive number`,
      "INVALID_INPUT",
    );
  }
}

// ---------- Formal-sector contribution (Calculator: CONTRIBUTION) ----------

export function calculateFormalContribution(
  basicSalary: number,
  params: FormalRuleParams,
): ContributionResult {
  assertPositiveAmount(basicSalary, "Basic salary");
  if (basicSalary < params.minBase) {
    throw new CalculationInputError(
      `Basic salary cannot be below the minimum basic remuneration (NPR ${params.minBase})`,
      "BELOW_MIN_BASE",
    );
  }

  const employeeParts: AmountBreakdownItem[] = [
    {
      key: "employee_pf",
      labelNe: "सञ्चय कोष (श्रमिक)",
      labelEn: "Provident fund (employee)",
      pct: params.employeeSplit.pf,
      amount: roundNPR(pctOf(basicSalary, params.employeeSplit.pf)),
    },
    {
      key: "employee_sst",
      labelNe: "सामाजिक सुरक्षा कर",
      labelEn: "Social security tax",
      pct: params.employeeSplit.sst,
      amount: roundNPR(pctOf(basicSalary, params.employeeSplit.sst)),
    },
  ];
  const employerParts: AmountBreakdownItem[] = [
    {
      key: "employer_pf",
      labelNe: "सञ्चय कोष (रोजगारदाता)",
      labelEn: "Provident fund (employer)",
      pct: params.employerSplit.pf,
      amount: roundNPR(pctOf(basicSalary, params.employerSplit.pf)),
    },
    {
      key: "employer_gratuity",
      labelNe: "उपदान",
      labelEn: "Gratuity",
      pct: params.employerSplit.gratuity,
      amount: roundNPR(pctOf(basicSalary, params.employerSplit.gratuity)),
    },
    {
      key: "employer_other",
      labelNe: "अन्य",
      labelEn: "Other",
      pct: params.employerSplit.other,
      amount: roundNPR(pctOf(basicSalary, params.employerSplit.other)),
    },
  ];

  const employeeTotal = roundNPR(pctOf(basicSalary, params.employeePct));
  const employerTotal = roundNPR(pctOf(basicSalary, params.employerPct));
  const totalPct = params.employeePct + params.employerPct;
  const total = employeeTotal + employerTotal;

  return {
    base: basicSalary,
    employee: {
      total: employeeTotal,
      parts: reconcile(employeeParts, employeeTotal),
    },
    employer: {
      total: employerTotal,
      parts: reconcile(employerParts, employerTotal),
    },
    total,
    totalPct,
    annualProjection: total * 12,
    formula: `${params.employeePct}% (श्रमिक) + ${params.employerPct}% (रोजगारदाता) = ${totalPct}% × आधारभूत पारिश्रमिक`,
  };
}

// ---------- Allocation across schemes (Calculator: ALLOCATION) ----------

export function calculateAllocation(
  basicSalary: number,
  params: FormalRuleParams,
): AllocationResult {
  assertPositiveAmount(basicSalary, "Basic salary");
  if (basicSalary < params.minBase) {
    throw new CalculationInputError(
      `Basic salary cannot be below the minimum basic remuneration (NPR ${params.minBase})`,
      "BELOW_MIN_BASE",
    );
  }

  const a = params.allocation;
  const total = roundNPR(
    pctOf(basicSalary, params.employeePct + params.employerPct),
  );

  const schemes: AmountBreakdownItem[] = reconcile(
    [
      {
        key: "medical",
        labelNe: "औषधि उपचार, स्वास्थ्य तथा मातृत्व सुरक्षा",
        labelEn: "Medical treatment, health & maternity",
        pct: a.medical,
        amount: roundNPR(pctOf(basicSalary, a.medical)),
      },
      {
        key: "accident",
        labelNe: "दुर्घटना तथा अशक्तता सुरक्षा",
        labelEn: "Accident & disability",
        pct: a.accident,
        amount: roundNPR(pctOf(basicSalary, a.accident)),
      },
      {
        key: "dependent",
        labelNe: "आश्रित परिवार सुरक्षा",
        labelEn: "Dependent family",
        pct: a.dependent,
        amount: roundNPR(pctOf(basicSalary, a.dependent)),
      },
      {
        key: "old_age",
        labelNe: "वृद्ध अवस्था सुरक्षा",
        labelEn: "Old age protection",
        pct: a.oldAge,
        amount: roundNPR(pctOf(basicSalary, a.oldAge)),
      },
    ],
    total,
  );

  const oldAgeItem = schemes.find((s) => s.key === "old_age")!;
  const pension: AmountBreakdownItem = {
    key: "pension",
    labelNe: "निवृत्तभरण योजना",
    labelEn: "Pension scheme",
    pct: a.pension,
    amount: roundNPR(pctOf(basicSalary, a.pension)),
  };
  const retirement: AmountBreakdownItem = {
    key: "retirement",
    labelNe: "अवकाश सुविधा योजना",
    labelEn: "Retirement benefit scheme",
    pct: a.retirement,
    amount: oldAgeItem.amount - roundNPR(pctOf(basicSalary, a.pension)),
  };

  return {
    base: basicSalary,
    total,
    schemes,
    oldAgeSplit: { pension, retirement },
  };
}

// ---------- Foreign employment (Calculator: FOREIGN_EMPLOYMENT) ----------

export function calculateForeignEmployment(
  input: { base: number; periodMonths: number },
  params: ForeignEmploymentRuleParams,
): ForeignEmploymentResult {
  assertPositiveAmount(input.base, "Contribution base");
  if (
    !Number.isInteger(input.periodMonths) ||
    input.periodMonths < 1 ||
    input.periodMonths > 600
  ) {
    throw new CalculationInputError(
      "Contribution period must be between 1 and 600 months",
      "INVALID_INPUT",
    );
  }
  if (input.base < params.industrialMinBase) {
    throw new CalculationInputError(
      `Contribution base cannot be below the industrial minimum basic remuneration (NPR ${params.industrialMinBase})`,
      "BELOW_MIN_BASE",
    );
  }
  const maxBase = params.industrialMinBase * params.maxBaseMultiple;
  if (input.base > maxBase) {
    throw new CalculationInputError(
      `Contribution base cannot exceed ${params.maxBaseMultiple}× the industrial minimum (NPR ${maxBase})`,
      "ABOVE_MAX_BASE",
    );
  }

  const monthlyTotal = roundNPR(pctOf(input.base, params.minPct));
  const schemes: AmountBreakdownItem[] = reconcile(
    [
      {
        key: "protection",
        labelNe: "औषधि उपचार + दुर्घटना + आश्रित परिवार",
        labelEn: "Medical + accident + dependent family",
        pct: params.allocation.protection,
        amount: roundNPR(pctOf(input.base, params.allocation.protection)),
      },
      {
        key: "old_age",
        labelNe: "वृद्ध अवस्था सुरक्षा",
        labelEn: "Old age protection",
        pct: params.allocation.oldAge,
        amount: roundNPR(pctOf(input.base, params.allocation.oldAge)),
      },
    ],
    monthlyTotal,
  );

  return {
    base: input.base,
    monthlyTotal,
    monthlyPct: params.minPct,
    periodMonths: input.periodMonths,
    periodTotal: monthlyTotal * input.periodMonths,
    schemes,
    assumptions: [
      `योगदान दर: औद्योगिक न्यूनतम आधारभूत पारिश्रमिकको ${params.minPct}% (वैदेशिक रोजगार कार्यविधि २०७९, दफा ६)`,
      "यो नतिजा प्रारम्भिक जानकारी हो — आधिकारिक रकम SSF ले तोकेबमोजिम हुन्छ।",
    ],
  };
}

// ---------- Informal sector ----------

export function calculateInformal(params: InformalRuleParams): InformalResult {
  const base = params.minBase;
  assertPositiveAmount(base, "Minimum basic remuneration");

  const worker: AmountBreakdownItem = {
    key: "worker",
    labelNe: "श्रमिक स्वयंको योगदान",
    labelEn: "Worker's own contribution",
    pct: params.workerPct,
    amount: roundNPR(pctOf(base, params.workerPct)),
  };
  const government: AmountBreakdownItem = {
    key: "government",
    labelNe: "नेपाल सरकारबाट थप",
    labelEn: "Government of Nepal top-up",
    pct: params.governmentPct,
    amount: roundNPR(pctOf(base, params.governmentPct)),
  };
  const totalPct = params.workerPct + params.governmentPct;
  const total = roundNPR(pctOf(base, totalPct));

  const schemes = reconcile(
    [
      {
        key: "protection",
        labelNe: "औषधि उपचार + दुर्घटना + आश्रित परिवार",
        labelEn: "Medical + accident + dependent family",
        pct: params.allocation.protection,
        amount: roundNPR(pctOf(base, params.allocation.protection)),
      },
      {
        key: "old_age",
        labelNe: "वृद्ध अवस्था सुरक्षा",
        labelEn: "Old age protection",
        pct: params.allocation.oldAge,
        amount: roundNPR(pctOf(base, params.allocation.oldAge)),
      },
    ],
    total,
  );

  return { base, worker, government, total, totalPct, schemes };
}

// ---------- Self-employed ----------

export function calculateSelfEmployed(
  chosenBase: number,
  params: SelfEmployedRuleParams,
): AllocationResult & { pensionMinimum: number } {
  assertPositiveAmount(chosenBase, "Chosen contribution base");
  const min = params.minBase * params.minBaseMultiple;
  const max = params.minBase * params.maxBaseMultiple;
  if (chosenBase < min) {
    throw new CalculationInputError(
      `Contribution base cannot be below the minimum basic remuneration (NPR ${min})`,
      "BELOW_MIN_BASE",
    );
  }
  if (chosenBase > max) {
    throw new CalculationInputError(
      `Contribution base cannot exceed ${params.maxBaseMultiple}× the minimum basic remuneration (NPR ${max})`,
      "ABOVE_MAX_BASE",
    );
  }

  const a = params.allocation;
  const total = roundNPR(pctOf(chosenBase, params.totalPct));
  const schemes: AmountBreakdownItem[] = reconcile(
    [
      {
        key: "medical",
        labelNe: "औषधि उपचार, स्वास्थ्य तथा मातृत्व सुरक्षा",
        labelEn: "Medical treatment, health & maternity",
        pct: a.medical,
        amount: roundNPR(pctOf(chosenBase, a.medical)),
      },
      {
        key: "accident",
        labelNe: "दुर्घटना तथा अशक्तता सुरक्षा",
        labelEn: "Accident & disability",
        pct: a.accident,
        amount: roundNPR(pctOf(chosenBase, a.accident)),
      },
      {
        key: "dependent",
        labelNe: "आश्रित परिवार सुरक्षा",
        labelEn: "Dependent family",
        pct: a.dependent,
        amount: roundNPR(pctOf(chosenBase, a.dependent)),
      },
      {
        key: "old_age",
        labelNe: "वृद्ध अवस्था सुरक्षा",
        labelEn: "Old age protection",
        pct: a.oldAge,
        amount: roundNPR(pctOf(chosenBase, a.oldAge)),
      },
    ],
    total,
  );

  const oldAge = schemes.find((s) => s.key === "old_age")!;
  const pensionMinimum = roundNPR(pctOf(chosenBase, a.minPensionPct));

  return {
    base: chosenBase,
    total,
    schemes,
    oldAgeSplit: {
      pension: {
        key: "pension",
        labelNe: "निवृत्तभरण योजना (न्यूनतम)",
        labelEn: "Pension scheme (minimum)",
        pct: a.minPensionPct,
        amount: pensionMinimum,
      },
      retirement: {
        key: "retirement",
        labelNe: "अवकाश सुविधा योजना (बाँकी)",
        labelEn: "Retirement benefit scheme (remainder)",
        pct: a.oldAge - a.minPensionPct,
        amount: oldAge.amount - pensionMinimum,
      },
    },
    pensionMinimum,
  };
}

// ---------- Pension estimate (used by Job Leaving Scenario Guide) ----------

/**
 * Statutory formula: (pension-scheme deposits + investment returns) ÷ 160
 * = lifelong monthly pension. Scheme Operation Procedure 2075 §20–22.
 * Any UI showing this MUST label it preliminary guidance, never a promise.
 */
export function estimateMonthlyPension(totalPensionBalance: number): number {
  assertPositiveAmount(totalPensionBalance, "Pension balance");
  return roundNPR(totalPensionBalance / 160);
}
