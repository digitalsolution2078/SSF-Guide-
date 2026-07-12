/**
 * Nepal salary income-tax calculator for natural persons.
 *
 * Rates from the Finance Act / Budget for each fiscal year (figures verified
 * against Inland Revenue Department slabs and Budget 2083/84 announcements):
 *   FY 2082/83 — separate single/couple schedules, top rate 39%.
 *   FY 2083/84 — unified schedule (no married/single split), first 1% band
 *                raised to Rs 10 lakh, top rate cut to 29%; effective 1 Shrawan
 *                2083 (~mid-July 2026), subject to the Finance Act 2083.
 *
 * The first 1% band is the Social Security Tax (SST). It is WAIVED for a person
 * who contributes to the Social Security Fund (SSF). All results are
 * preliminary educational estimates, not tax advice.
 */

export class TaxInputError extends Error {}

export type FilingStatus = "individual" | "couple";

export interface TaxBracket {
  /** upper bound of this band (null = no upper limit) */
  upTo: number | null;
  /** marginal rate in percent */
  rate: number;
}

export interface TaxYearConfig {
  id: string; // "2083/84"
  label: string;
  labelNe: string;
  unified: boolean; // true → same slabs for all, ignore status
  provisional?: boolean; // subject to the Finance Act
  brackets: { individual: TaxBracket[]; couple: TaxBracket[] };
  caps: {
    retirement: number; // absolute cap
    retirementIncomeFraction: number; // e.g. 1/3
    lifeInsurance: number;
    healthInsurance: number;
  };
}

const CAPS = {
  retirement: 500_000,
  retirementIncomeFraction: 1 / 3,
  lifeInsurance: 40_000,
  healthInsurance: 20_000,
};

export const TAX_YEARS: Record<string, TaxYearConfig> = {
  "2083/84": {
    id: "2083/84",
    label: "FY 2083/84 (2026/27)",
    labelNe: "आ.व. २०८३/८४ (नयाँ)",
    unified: true,
    provisional: true,
    brackets: {
      individual: [
        { upTo: 1_000_000, rate: 1 },
        { upTo: 1_500_000, rate: 10 },
        { upTo: 2_500_000, rate: 20 },
        { upTo: 4_000_000, rate: 27 },
        { upTo: null, rate: 29 },
      ],
      couple: [
        { upTo: 1_000_000, rate: 1 },
        { upTo: 1_500_000, rate: 10 },
        { upTo: 2_500_000, rate: 20 },
        { upTo: 4_000_000, rate: 27 },
        { upTo: null, rate: 29 },
      ],
    },
    caps: CAPS,
  },
  "2082/83": {
    id: "2082/83",
    label: "FY 2082/83 (2025/26)",
    labelNe: "आ.व. २०८२/८३",
    unified: false,
    brackets: {
      individual: [
        { upTo: 500_000, rate: 1 },
        { upTo: 700_000, rate: 10 },
        { upTo: 1_000_000, rate: 20 },
        { upTo: 2_000_000, rate: 30 },
        { upTo: 5_000_000, rate: 36 },
        { upTo: null, rate: 39 },
      ],
      couple: [
        { upTo: 600_000, rate: 1 },
        { upTo: 800_000, rate: 10 },
        { upTo: 1_100_000, rate: 20 },
        { upTo: 2_000_000, rate: 30 },
        { upTo: 5_000_000, rate: 36 },
        { upTo: null, rate: 39 },
      ],
    },
    caps: CAPS,
  },
};

export interface TaxInput {
  yearId: string;
  status: FilingStatus;
  annualIncome: number; // assessable income before the deductions below
  ssfContributor: boolean; // waives the 1% first-band SST
  retirementContribution?: number; // annual, deductible (SSF/EPF/CIT)
  lifeInsurancePremium?: number; // annual
  healthInsurancePremium?: number; // annual
  femaleRebate?: boolean; // 10% rebate (resident woman, employment income only)
}

export interface TaxBandResult {
  from: number;
  to: number | null;
  rate: number;
  taxable: number; // income taxed in this band
  tax: number;
  waived: boolean; // first-band SST waived by SSF
}

export interface TaxResult {
  yearId: string;
  assessableIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  bands: TaxBandResult[];
  sstWaived: number; // 1% first-band tax removed by SSF
  taxBeforeRebate: number;
  rebate: number;
  totalTax: number;
  monthlyTax: number;
  effectiveRatePct: number; // totalTax / assessableIncome
  takeHomeAnnual: number; // assessableIncome - totalTax
}

export function calculateIncomeTax(input: TaxInput): TaxResult {
  const cfg = TAX_YEARS[input.yearId];
  if (!cfg) throw new TaxInputError("Unknown fiscal year");
  if (!Number.isFinite(input.annualIncome) || input.annualIncome < 0)
    throw new TaxInputError("Income must be zero or positive");

  const status: FilingStatus = cfg.unified ? "individual" : input.status;
  const brackets = cfg.brackets[status];

  const retire = Math.max(0, input.retirementContribution ?? 0);
  const life = Math.max(0, input.lifeInsurancePremium ?? 0);
  const health = Math.max(0, input.healthInsurancePremium ?? 0);

  const retireDeduction = Math.min(
    retire,
    cfg.caps.retirement,
    input.annualIncome * cfg.caps.retirementIncomeFraction,
  );
  const lifeDeduction = Math.min(life, cfg.caps.lifeInsurance);
  const healthDeduction = Math.min(health, cfg.caps.healthInsurance);
  const totalDeductions = retireDeduction + lifeDeduction + healthDeduction;

  const taxableIncome = Math.max(0, input.annualIncome - totalDeductions);

  const bands: TaxBandResult[] = [];
  let lower = 0;
  let sstWaived = 0;
  let taxBeforeRebate = 0;

  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i];
    const upper = b.upTo ?? Infinity;
    if (taxableIncome <= lower) break;
    const taxedHere = Math.min(taxableIncome, upper) - lower;
    if (taxedHere <= 0) {
      lower = upper;
      continue;
    }
    const rawTax = (taxedHere * b.rate) / 100;
    const isFirstBand = i === 0;
    const waived = isFirstBand && input.ssfContributor;
    const tax = waived ? 0 : rawTax;
    if (waived) sstWaived = rawTax;
    taxBeforeRebate += tax;
    bands.push({
      from: lower,
      to: b.upTo,
      rate: b.rate,
      taxable: Math.round(taxedHere),
      tax: Math.round(tax),
      waived,
    });
    lower = upper;
  }

  const rebate = input.femaleRebate ? taxBeforeRebate * 0.1 : 0;
  const totalTax = Math.max(0, taxBeforeRebate - rebate);

  return {
    yearId: cfg.id,
    assessableIncome: Math.round(input.annualIncome),
    totalDeductions: Math.round(totalDeductions),
    taxableIncome: Math.round(taxableIncome),
    bands,
    sstWaived: Math.round(sstWaived),
    taxBeforeRebate: Math.round(taxBeforeRebate),
    rebate: Math.round(rebate),
    totalTax: Math.round(totalTax),
    monthlyTax: Math.round(totalTax / 12),
    effectiveRatePct:
      input.annualIncome > 0
        ? Math.round((totalTax / input.annualIncome) * 1000) / 10
        : 0,
    takeHomeAnnual: Math.round(input.annualIncome - totalTax),
  };
}
