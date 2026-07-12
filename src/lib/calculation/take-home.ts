/**
 * Take-home (cash-in-hand) salary estimate for a formal-sector employee.
 * Combines the SSF employee deduction (11% of basic) with Nepal income tax
 * (reusing income-tax.ts). Preliminary educational estimate only — assumes the
 * entered salary is the SSF/tax base and treats the employee SSF contribution as
 * the deductible retirement contribution. For edge cases (allowances, employer
 * SSF treatment, other deductions) use the full Income Tax calculator.
 */

import {
  calculateIncomeTax,
  type FilingStatus,
  type TaxResult,
} from "./income-tax";

export const EMPLOYEE_SSF_PCT = 11;
export const EMPLOYER_SSF_PCT = 20;

export interface TakeHomeInput {
  monthlySalary: number;
  yearId: string;
  status: FilingStatus;
  ssfContributor: boolean;
}

export interface TakeHomeResult {
  monthlySalary: number;
  employeeSsf: number; // deducted from salary
  employerSsf: number; // added on top, into your SSF account
  monthlyTax: number;
  netMonthly: number; // cash in hand
  netAnnual: number;
  annualSsfToYourAccount: number; // employee + employer, yearly
  effectiveTaxRatePct: number;
  tax: TaxResult;
}

export function calculateTakeHome(input: TakeHomeInput): TakeHomeResult {
  const salary = Math.max(0, input.monthlySalary || 0);
  const employeeSsf = input.ssfContributor
    ? Math.round((salary * EMPLOYEE_SSF_PCT) / 100)
    : 0;
  const employerSsf = input.ssfContributor
    ? Math.round((salary * EMPLOYER_SSF_PCT) / 100)
    : 0;

  const annualIncome = salary * 12;
  const tax = calculateIncomeTax({
    yearId: input.yearId,
    status: input.status,
    annualIncome,
    ssfContributor: input.ssfContributor,
    retirementContribution: employeeSsf * 12,
  });
  const monthlyTax = Math.round(tax.totalTax / 12);
  const netMonthly = salary - employeeSsf - monthlyTax;

  return {
    monthlySalary: salary,
    employeeSsf,
    employerSsf,
    monthlyTax,
    netMonthly,
    netAnnual: netMonthly * 12,
    annualSsfToYourAccount: (employeeSsf + employerSsf) * 12,
    effectiveTaxRatePct: tax.effectiveRatePct,
    tax,
  };
}
