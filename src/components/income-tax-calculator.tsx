"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  calculateIncomeTax,
  TAX_YEARS,
  type FilingStatus,
  type TaxResult,
} from "@/lib/calculation/income-tax";
import { formatNpr } from "@/lib/money";
import { Callout } from "./ui";

const labelCls = "block text-sm font-medium text-ink-700";
const helpCls = "mt-1 block text-xs font-normal text-ink-500";

export function IncomeTaxCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [yearId, setYearId] = useState("2083/84");
  const [status, setStatus] = useState<FilingStatus>("individual");
  const [period, setPeriod] = useState<"monthly" | "annual">("monthly");
  const [amount, setAmount] = useState(80_000);
  const [ssf, setSsf] = useState(true);
  const [retire, setRetire] = useState(0);
  const [life, setLife] = useState(0);
  const [health, setHealth] = useState(0);
  const [female, setFemale] = useState(false);

  const cfg = TAX_YEARS[yearId];
  const annualIncome = period === "monthly" ? amount * 12 : amount;

  const result: TaxResult | null = useMemo(() => {
    try {
      return calculateIncomeTax({
        yearId,
        status,
        annualIncome,
        ssfContributor: ssf,
        retirementContribution: retire,
        lifeInsurancePremium: life,
        healthInsurancePremium: health,
        femaleRebate: female,
      });
    } catch {
      return null;
    }
  }, [yearId, status, annualIncome, ssf, retire, life, health, female]);

  return (
    <div>
      <div className="card p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            {isEn ? "Fiscal year" : "आर्थिक वर्ष"}
            <select
              value={yearId}
              onChange={(e) => setYearId(e.target.value)}
              className="select mt-1"
            >
              {Object.values(TAX_YEARS).map((y) => (
                <option key={y.id} value={y.id}>
                  {isEn ? y.label : y.labelNe}
                </option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            {isEn ? "Filing status" : "करदाता स्थिति"}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as FilingStatus)}
              disabled={cfg?.unified}
              className="select mt-1 disabled:bg-ink-100 disabled:text-ink-400"
            >
              <option value="individual">{isEn ? "Individual" : "एकल"}</option>
              <option value="couple">{isEn ? "Couple" : "दम्पती"}</option>
            </select>
            {cfg?.unified && (
              <span className={helpCls}>
                {isEn
                  ? "This year uses one unified schedule for all"
                  : "यो वर्ष सबैका लागि एउटै एकीकृत दर"}
              </span>
            )}
          </label>
          <label className={labelCls}>
            {isEn ? "Income" : "आम्दानी"}
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input mt-1"
            />
          </label>
          <label className={labelCls}>
            {isEn ? "Income period" : "आम्दानी अवधि"}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as "monthly" | "annual")}
              className="select mt-1"
            >
              <option value="monthly">{isEn ? "Per month" : "प्रति महिना"}</option>
              <option value="annual">{isEn ? "Per year" : "प्रति वर्ष"}</option>
            </select>
            <span className={helpCls}>
              {isEn
                ? `Annual: ${npr(annualIncome)}`
                : `वार्षिक: ${npr(annualIncome)}`}
            </span>
          </label>
        </div>

        <div className="mt-4 rounded-xl border border-ink-200 bg-ink-50 p-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-900">
            <input
              type="checkbox"
              checked={ssf}
              onChange={(e) => setSsf(e.target.checked)}
              className="h-4 w-4 accent-primary-600"
            />
            {isEn
              ? "I contribute to SSF (सामाजिक सुरक्षा कोष)"
              : "म SSF (सामाजिक सुरक्षा कोष) मा योगदान गर्छु"}
          </label>
          <p className="mt-1 text-xs text-ink-500">
            {isEn
              ? "SSF contributors have the 1% social security tax on the first slab waived."
              : "SSF योगदानकर्तालाई पहिलो स्ल्याबको १% सामाजिक सुरक्षा कर छुट हुन्छ।"}
          </p>
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold text-primary-700">
            {isEn ? "Deductions & rebate (optional)" : "छुट तथा कटौती (वैकल्पिक)"}
          </summary>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className={labelCls}>
              {isEn ? "Retirement/SSF (annual)" : "अवकाश/SSF (वार्षिक)"}
              <input
                type="number"
                min={0}
                value={retire}
                onChange={(e) => setRetire(Number(e.target.value))}
                className="input mt-1"
              />
              <span className={helpCls}>
                {isEn ? "cap Rs 5L or ⅓ income" : "सीमा रु. ५ लाख वा ⅓ आम्दानी"}
              </span>
            </label>
            <label className={labelCls}>
              {isEn ? "Life insurance" : "जीवन बीमा"}
              <input
                type="number"
                min={0}
                value={life}
                onChange={(e) => setLife(Number(e.target.value))}
                className="input mt-1"
              />
              <span className={helpCls}>
                {isEn ? "cap Rs 40,000" : "सीमा रु. ४०,०००"}
              </span>
            </label>
            <label className={labelCls}>
              {isEn ? "Health insurance" : "स्वास्थ्य बीमा"}
              <input
                type="number"
                min={0}
                value={health}
                onChange={(e) => setHealth(Number(e.target.value))}
                className="input mt-1"
              />
              <span className={helpCls}>
                {isEn ? "cap Rs 20,000" : "सीमा रु. २०,०००"}
              </span>
            </label>
          </div>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={female}
              onChange={(e) => setFemale(e.target.checked)}
              className="h-4 w-4 accent-primary-600"
            />
            {isEn
              ? "10% rebate — resident woman with employment income only"
              : "१०% छुट — रोजगारी आम्दानी मात्र भएकी नेपाली महिला"}
          </label>
        </details>
      </div>

      {result && (
        <section className="surface mt-6 p-5 md:p-6">
          <p className="text-sm text-ink-500">
            {isEn ? "Annual tax" : "वार्षिक कर"}
          </p>
          <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">
            {npr(result.totalTax)}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn ? "Monthly tax" : "मासिक कर"}
              </p>
              <p className="font-semibold text-ink-900">{npr(result.monthlyTax)}</p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn ? "Effective rate" : "प्रभावकारी दर"}
              </p>
              <p className="font-semibold text-ink-900">{result.effectiveRatePct}%</p>
            </div>
          </div>

          {result.sstWaived > 0 && (
            <div className="mt-4">
              <Callout tone="success">
                {isEn
                  ? `Because you contribute to SSF, ${npr(result.sstWaived)} of social security tax on the first slab is waived.`
                  : `तपाईं SSF मा योगदान गर्नुहुने भएकाले पहिलो स्ल्याबको ${npr(result.sstWaived)} सामाजिक सुरक्षा कर छुट भयो।`}
              </Callout>
            </div>
          )}

          <div className="mt-5 overflow-hidden rounded-xl border border-ink-200 bg-white">
            <p className="px-4 pb-2 pt-4 text-sm font-semibold text-ink-900">
              {isEn ? "Slab-by-slab breakdown" : "स्ल्याब अनुसार विवरण"}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-ink-50">
                  <tr className="text-left text-xs text-ink-500">
                    <th className="px-4 py-2 font-medium">{isEn ? "Income slab (Rs.)" : "आम्दानी स्ल्याब (रु.)"}</th>
                    <th className="px-4 py-2 text-right font-medium">{isEn ? "Rate" : "दर"}</th>
                    <th className="px-4 py-2 text-right font-medium">{isEn ? "Taxed" : "करयोग्य"}</th>
                    <th className="px-4 py-2 text-right font-medium">{isEn ? "Tax" : "कर"}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.bands.map((b, i) => (
                    <tr key={i} className="border-b border-ink-100">
                      <td className="px-4 py-2 text-ink-700">
                        {b.from.toLocaleString("en-IN")}–
                        {b.to === null ? (isEn ? "above" : "माथि") : b.to.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2 text-right text-ink-700">{b.rate}%</td>
                      <td className="px-4 py-2 text-right text-ink-600">
                        {b.taxable.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2 text-right font-semibold text-ink-900">
                        {b.waived ? (
                          <span className="text-emerald-600">
                            {isEn ? "waived" : "छुट"}
                          </span>
                        ) : (
                          b.tax.toLocaleString("en-IN")
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-1 px-4 py-3 text-xs text-ink-500">
              <p>
                {isEn ? "Total deductions applied: " : "लागू कटौती: "}
                <span className="font-semibold text-ink-900">{npr(result.totalDeductions)}</span>
                {" · "}
                {isEn ? "Taxable income: " : "करयोग्य आम्दानी: "}
                <span className="font-semibold text-ink-900">{npr(result.taxableIncome)}</span>
              </p>
              {result.rebate > 0 && (
                <p>
                  {isEn ? "10% female rebate: −" : "१०% महिला छुट: −"}
                  {npr(result.rebate)}
                </p>
              )}
              <p>
                {isEn ? "Estimated take-home (annual): " : "अनुमानित हातमा (वार्षिक): "}
                <span className="font-bold text-primary-700">
                  {npr(result.takeHomeAnnual)}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Callout tone="warn">
              {isEn
                ? "Preliminary educational estimate based on the salary slabs. It ignores non-salary income, foreign-employment/remote-area adjustments, and other special rebates. FY 2083/84 rates are subject to the Finance Act 2083. Confirm with the Inland Revenue Department or a tax professional."
                : "तलब स्ल्याबमा आधारित प्रारम्भिक शैक्षिक अनुमान। गैर-तलब आम्दानी, वैदेशिक/दुर्गम क्षेत्र समायोजन र अन्य विशेष छुट यसमा समावेश छैनन्। आ.व. २०८३/८४ को दर आर्थिक ऐन २०८३ अधीनमा। आन्तरिक राजस्व विभाग वा कर विशेषज्ञसँग पुष्टि गर्नुहोस्।"}
            </Callout>
          </div>
        </section>
      )}
    </div>
  );
}
