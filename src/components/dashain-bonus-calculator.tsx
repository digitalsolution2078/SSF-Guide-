"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { dashainBonus } from "@/lib/calculation/salary-tools";
import { TAX_YEARS, type FilingStatus } from "@/lib/calculation/income-tax";
import { formatNpr } from "@/lib/money";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

export function DashainBonusCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [salary, setSalary] = useState(50_000);
  const [bonus, setBonus] = useState(50_000);
  const [yearId, setYearId] = useState("2083/84");
  const [status, setStatus] = useState<FilingStatus>("individual");
  const [ssf, setSsf] = useState(true);

  const r = useMemo(
    () =>
      dashainBonus({
        monthlySalary: salary,
        bonusAmount: bonus,
        yearId,
        status,
        ssfContributor: ssf,
      }),
    [salary, bonus, yearId, status, ssf],
  );
  const unified = TAX_YEARS[yearId]?.unified;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
          💡{" "}
          {isEn
            ? "The festival (13th-month) bonus is added to your annual income and taxed at your marginal rate. SSF is NOT deducted from the bonus. See what actually lands in hand."
            : "दशैँ (१३औँ महिना) बोनस वार्षिक आम्दानीमा थपिन्छ र तपाईंको दरमा कर लाग्छ। बोनसमा SSF कट्टी हुँदैन। हातमा कति आउँछ हेर्नुहोस्।"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Monthly salary (Rs.)" : "मासिक तलब (रु.)"}
            <input type="number" min={0} value={salary} onChange={(e) => setSalary(Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Bonus amount (Rs.)" : "बोनस रकम (रु.)"}
            <input type="number" min={0} value={bonus} onChange={(e) => setBonus(Number(e.target.value))} className={inputCls} />
            <button
              type="button"
              onClick={() => setBonus(salary)}
              className="mt-1 text-xs font-normal text-primary-600 underline"
            >
              {isEn ? "= one month's salary" : "= एक महिनाको तलब"}
            </button>
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Fiscal year" : "आर्थिक वर्ष"}
            <select value={yearId} onChange={(e) => setYearId(e.target.value)} className={inputCls}>
              {Object.values(TAX_YEARS).map((y) => (
                <option key={y.id} value={y.id}>{isEn ? y.label : y.labelNe}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Filing status" : "करदाता स्थिति"}
            <select value={status} onChange={(e) => setStatus(e.target.value as FilingStatus)} disabled={unified} className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400`}>
              <option value="individual">{isEn ? "Individual" : "एकल"}</option>
              <option value="couple">{isEn ? "Couple" : "दम्पती"}</option>
            </select>
          </label>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-primary-50 p-3 text-sm font-semibold text-primary-900">
          <input type="checkbox" checked={ssf} onChange={(e) => setSsf(e.target.checked)} className="h-4 w-4 accent-primary-600" />
          {isEn ? "I contribute to SSF" : "म SSF मा योगदान गर्छु"}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
          <p className="text-xs text-primary-100">{isEn ? "Bonus in hand" : "हातमा बोनस"}</p>
          <p className="mt-1 text-2xl font-bold">{npr(r.netBonus)}</p>
        </div>
        <div className="rounded-2xl border border-action-500/30 bg-action-50 p-5 shadow-sm">
          <p className="text-xs text-gray-600">{isEn ? "Extra tax on bonus" : "बोनसमा थप कर"}</p>
          <p className="mt-1 text-2xl font-bold text-action-700">{npr(r.extraTax)}</p>
        </div>
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">{isEn ? "Effective rate on bonus" : "बोनसमा प्रभावकारी दर"}</p>
          <p className="mt-1 text-2xl font-bold text-primary-800">{r.marginalRatePct}%</p>
        </div>
      </div>

      <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
        ⚠️{" "}
        {isEn
          ? "Preliminary estimate. The bonus can push part of your income into a higher bracket, so the effective rate may exceed your usual rate. Confirm with a tax professional."
          : "प्रारम्भिक अनुमान। बोनसले आम्दानीको केही भाग माथिल्लो स्ल्याबमा धकेल्न सक्छ, त्यसैले प्रभावकारी दर सामान्यभन्दा बढी हुनसक्छ। कर विशेषज्ञसँग पुष्टि गर्नुहोस्।"}
      </p>
    </div>
  );
}
