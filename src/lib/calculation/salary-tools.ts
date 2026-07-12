/**
 * Nepal-specific salary/tax micro-tools built on the income-tax and finance
 * engines. All pure functions; results are preliminary educational estimates.
 */
import { calculateIncomeTax, type FilingStatus } from "./income-tax";
import { calculateTakeHome } from "./take-home";
import { calculateGoalSip } from "./finance";

const round = (n: number) => Math.round(n);
const round1 = (n: number) => Math.round(n * 10) / 10;

/* ── Net → Gross converter (reverse of take-home) ───────────────────── */
export interface NetToGrossResult {
  gross: number;
  net: number;
  employeeSsf: number;
  monthlyTax: number;
}
export function netToGross(
  netTarget: number,
  opts: { yearId: string; status: FilingStatus; ssfContributor: boolean },
): NetToGrossResult {
  if (!(netTarget > 0)) return { gross: 0, net: 0, employeeSsf: 0, monthlyTax: 0 };
  let lo = netTarget;
  let hi = netTarget * 3 + 100_000;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const th = calculateTakeHome({ monthlySalary: mid, ...opts }).netMonthly;
    if (th < netTarget) lo = mid;
    else hi = mid;
  }
  const gross = round(hi);
  const th = calculateTakeHome({ monthlySalary: gross, ...opts });
  return {
    gross,
    net: th.netMonthly,
    employeeSsf: th.employeeSsf,
    monthlyTax: th.monthlyTax,
  };
}

/* ── Dashain / festival (13th-month) bonus planner ──────────────────── */
export interface DashainBonusResult {
  bonus: number;
  extraTax: number;
  netBonus: number;
  marginalRatePct: number;
}
export function dashainBonus(opts: {
  monthlySalary: number;
  bonusAmount: number;
  yearId: string;
  status: FilingStatus;
  ssfContributor: boolean;
}): DashainBonusResult {
  const annual = Math.max(0, opts.monthlySalary * 12);
  // SSF is NOT levied on festival bonus, so the retirement deduction is unchanged.
  const retire = opts.ssfContributor ? round(opts.monthlySalary * 0.11) * 12 : 0;
  const common = {
    yearId: opts.yearId,
    status: opts.status,
    ssfContributor: opts.ssfContributor,
    retirementContribution: retire,
  };
  const t0 = calculateIncomeTax({ ...common, annualIncome: annual });
  const t1 = calculateIncomeTax({ ...common, annualIncome: annual + opts.bonusAmount });
  const extraTax = Math.max(0, t1.totalTax - t0.totalTax);
  return {
    bonus: round(opts.bonusAmount),
    extraTax: round(extraTax),
    netBonus: round(opts.bonusAmount - extraTax),
    marginalRatePct: opts.bonusAmount > 0 ? round1((extraTax / opts.bonusAmount) * 100) : 0,
  };
}

/* ── Pension top-up simulator ───────────────────────────────────────── */
export interface PensionTopUpResult {
  deficit: number; // monthly gap SSF pension doesn't cover
  corpusNeeded: number;
  requiredMonthlySip: number;
}
export function pensionTopUp(opts: {
  targetMonthly: number;
  ssfPensionMonthly: number;
  yearsToRetirement: number;
  yearsInRetirement: number;
  annualReturnPct: number;
}): PensionTopUpResult {
  const deficit = Math.max(0, opts.targetMonthly - opts.ssfPensionMonthly);
  const corpusNeeded = deficit * 12 * opts.yearsInRetirement;
  let requiredMonthlySip = 0;
  if (deficit > 0 && opts.yearsToRetirement > 0) {
    try {
      requiredMonthlySip = calculateGoalSip(
        corpusNeeded,
        opts.yearsToRetirement,
        opts.annualReturnPct,
      ).monthly;
    } catch {
      requiredMonthlySip = 0;
    }
  }
  return { deficit: round(deficit), corpusNeeded: round(corpusNeeded), requiredMonthlySip };
}

/* ── FD monthly income (for retirees living off interest) ───────────── */
export interface FdIncomeResult {
  grossMonthly: number;
  taxMonthly: number;
  netMonthly: number;
  netQuarterly: number;
  netAnnual: number;
}
export function fdMonthlyIncome(opts: {
  principal: number;
  annualRatePct: number;
  interestTaxPct: number;
}): FdIncomeResult {
  const annualInterest = (opts.principal * opts.annualRatePct) / 100;
  const netAnnual = annualInterest * (1 - opts.interestTaxPct / 100);
  return {
    grossMonthly: round(annualInterest / 12),
    taxMonthly: round((annualInterest - netAnnual) / 12),
    netMonthly: round(netAnnual / 12),
    netQuarterly: round(netAnnual / 4),
    netAnnual: round(netAnnual),
  };
}

/* ── Daily wage & overtime (Labour Act 2074) ────────────────────────── */
export interface WageOtResult {
  dailyRate: number;
  hourlyRate: number;
  otRate: number; // 1.5× hourly
  otPay: number;
  totalWithOt: number;
}
export function dailyWageOvertime(opts: {
  monthlySalary: number;
  workingDaysPerMonth: number;
  hoursPerDay: number;
  otHours: number;
}): WageOtResult {
  const dailyRate = opts.workingDaysPerMonth > 0 ? opts.monthlySalary / opts.workingDaysPerMonth : 0;
  const hourlyRate = opts.hoursPerDay > 0 ? dailyRate / opts.hoursPerDay : 0;
  const otRate = hourlyRate * 1.5; // Labour Act 2074: OT at 1.5× normal rate
  const otPay = otRate * Math.max(0, opts.otHours);
  return {
    dailyRate: round(dailyRate),
    hourlyRate: round(hourlyRate),
    otRate: round(otRate),
    otPay: round(otPay),
    totalWithOt: round(opts.monthlySalary + otPay),
  };
}

/* ── Rebate / deduction optimizer ───────────────────────────────────── */
export interface RebateOptimizerResult {
  incomeCap: number; // 1/3 of income
  retirementCap: number; // min(500k, 1/3 income)
  retirementRoom: number;
  lifeRoom: number;
  healthRoom: number;
  totalRoom: number;
}
export function rebateOptimizer(opts: {
  annualIncome: number;
  currentRetirement: number;
  currentLife: number;
  currentHealth: number;
}): RebateOptimizerResult {
  const incomeCap = opts.annualIncome / 3;
  const retirementCap = Math.min(500_000, incomeCap);
  const retirementRoom = Math.max(0, retirementCap - opts.currentRetirement);
  const lifeRoom = Math.max(0, 40_000 - opts.currentLife);
  const healthRoom = Math.max(0, 20_000 - opts.currentHealth);
  return {
    incomeCap: round(incomeCap),
    retirementCap: round(retirementCap),
    retirementRoom: round(retirementRoom),
    lifeRoom: round(lifeRoom),
    healthRoom: round(healthRoom),
    totalRoom: round(retirementRoom + lifeRoom + healthRoom),
  };
}
