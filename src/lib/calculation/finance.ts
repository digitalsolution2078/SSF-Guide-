/**
 * General personal-finance calculators — market-standard tools adapted for the
 * SSF Guide Nepal audience (workers, employers, self-employed, migrants,
 * families). All pure functions; every result is a preliminary educational
 * estimate, not financial advice.
 */

export class FinanceInputError extends Error {}

function req(cond: boolean, msg: string) {
  if (!cond) throw new FinanceInputError(msg);
}

/* ── 1. Loan / EMI ──────────────────────────────────────────────────── */
export interface EmiResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
}
export function calculateEmi(
  principal: number,
  annualRatePct: number,
  years: number,
): EmiResult {
  req(Number.isFinite(principal) && principal > 0, "Loan amount must be positive");
  req(annualRatePct >= 0 && annualRatePct <= 40, "Rate must be 0–40%");
  req(years > 0 && years <= 40, "Tenure must be 1–40 years");
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;
  const emi = r === 0 ? principal / n : (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  const totalPayment = emi * n;
  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalPayment - principal),
    principal: Math.round(principal),
  };
}

/* ── 2. Goal-based SIP (reverse SIP) ────────────────────────────────── */
export interface GoalSipResult {
  monthly: number;
  totalInvested: number;
  returns: number;
  target: number;
}
export function calculateGoalSip(
  target: number,
  years: number,
  annualReturnPct: number,
): GoalSipResult {
  req(Number.isFinite(target) && target > 0, "Target must be positive");
  req(years > 0 && years <= 60, "Years must be 1–60");
  req(annualReturnPct >= 0 && annualReturnPct <= 30, "Return must be 0–30%");
  const n = Math.round(years * 12);
  const i = annualReturnPct / 100 / 12;
  const monthly = i === 0 ? target / n : (target * i) / ((1 + i) ** n - 1);
  const totalInvested = monthly * n;
  return {
    monthly: Math.round(monthly),
    totalInvested: Math.round(totalInvested),
    returns: Math.round(target - totalInvested),
    target: Math.round(target),
  };
}

/* ── 3. Lump sum / Fixed Deposit ────────────────────────────────────── */
export interface LumpsumResult {
  maturity: number;
  principal: number;
  interest: number;
}
/** compoundsPerYear: 1 yearly, 2 half-yearly, 4 quarterly, 12 monthly. */
export function calculateLumpsum(
  principal: number,
  annualRatePct: number,
  years: number,
  compoundsPerYear = 4,
): LumpsumResult {
  req(Number.isFinite(principal) && principal > 0, "Amount must be positive");
  req(annualRatePct >= 0 && annualRatePct <= 30, "Rate must be 0–30%");
  req(years > 0 && years <= 60, "Years must be 1–60");
  req([1, 2, 4, 12].includes(compoundsPerYear), "Invalid compounding frequency");
  const m = compoundsPerYear;
  const maturity = principal * (1 + annualRatePct / 100 / m) ** (m * years);
  return {
    maturity: Math.round(maturity),
    principal: Math.round(principal),
    interest: Math.round(maturity - principal),
  };
}

/* ── 4. Inflation / purchasing power ────────────────────────────────── */
export interface InflationResult {
  futureCost: number; // what costs `amount` today will cost in `years`
  futureValueOfToday: number; // what `amount` today will be worth (purchasing power) in `years`
  erosionPct: number; // % of purchasing power lost
}
export function calculateInflation(
  amount: number,
  years: number,
  annualInflationPct: number,
): InflationResult {
  req(Number.isFinite(amount) && amount > 0, "Amount must be positive");
  req(years > 0 && years <= 60, "Years must be 1–60");
  req(annualInflationPct >= 0 && annualInflationPct <= 30, "Inflation must be 0–30%");
  const factor = (1 + annualInflationPct / 100) ** years;
  const futureCost = amount * factor;
  const futureValueOfToday = amount / factor;
  return {
    futureCost: Math.round(futureCost),
    futureValueOfToday: Math.round(futureValueOfToday),
    erosionPct: Math.round((1 - 1 / factor) * 100),
  };
}

/* ── 5. Retirement corpus ───────────────────────────────────────────── */
export interface RetirementCorpusInput {
  currentAge: number;
  retirementAge: number;
  monthlyExpenseToday: number;
  inflationPct: number;
  yearsInRetirement: number;
}
export interface RetirementCorpusResult {
  monthlyExpenseAtRetirement: number;
  corpusNeeded: number;
  yearsToRetirement: number;
}
export function calculateRetirementCorpus(
  input: RetirementCorpusInput,
): RetirementCorpusResult {
  const { currentAge, retirementAge, monthlyExpenseToday, inflationPct, yearsInRetirement } = input;
  req(currentAge >= 16 && currentAge < retirementAge, "Age must be below retirement age");
  req(retirementAge > currentAge && retirementAge <= 75, "Retirement age must be valid");
  req(monthlyExpenseToday > 0, "Monthly expense must be positive");
  req(inflationPct >= 0 && inflationPct <= 20, "Inflation must be 0–20%");
  req(yearsInRetirement > 0 && yearsInRetirement <= 45, "Retirement years must be 1–45");
  const yearsToRetirement = retirementAge - currentAge;
  const monthlyExpenseAtRetirement =
    monthlyExpenseToday * (1 + inflationPct / 100) ** yearsToRetirement;
  // Transparent estimate: fund covers inflated expenses across retirement years.
  const corpusNeeded = monthlyExpenseAtRetirement * 12 * yearsInRetirement;
  return {
    monthlyExpenseAtRetirement: Math.round(monthlyExpenseAtRetirement),
    corpusNeeded: Math.round(corpusNeeded),
    yearsToRetirement,
  };
}

/* ── 6. Emergency fund ──────────────────────────────────────────────── */
export interface EmergencyFundResult {
  recommended: number;
  gap: number; // shortfall vs current savings (0 if covered)
  monthsCovered: number; // how many months the current savings already cover
}
export function calculateEmergencyFund(
  monthlyExpense: number,
  months: number,
  currentSavings = 0,
): EmergencyFundResult {
  req(monthlyExpense > 0, "Monthly expense must be positive");
  req(months >= 1 && months <= 24, "Months must be 1–24");
  req(currentSavings >= 0, "Savings cannot be negative");
  const recommended = monthlyExpense * months;
  return {
    recommended: Math.round(recommended),
    gap: Math.round(Math.max(0, recommended - currentSavings)),
    monthsCovered: Math.round((currentSavings / monthlyExpense) * 10) / 10,
  };
}
