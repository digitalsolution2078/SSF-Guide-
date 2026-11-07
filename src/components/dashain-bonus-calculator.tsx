"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { dashainBonus } from "@/lib/calculation/salary-tools";
import { TAX_YEARS, type FilingStatus } from "@/lib/calculation/income-tax";
import { formatNpr } from "@/lib/money";
import { Callout } from "./ui";

const labelCls = "block text-sm font-medium text-ink-700";

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
    <div>
      <div className="card p-5 md:p-6">
        <div className="mb-5">
          <Callout tone="info">
            {isEn
              ? "The festival (13th-month) bonus is added to your annual income and taxed at your marginal rate. SSF is NOT deducted from the bonus. See what actually lands in hand."
              : "दशैँ (१३औँ महिना) बोनस वार्षिक आम्दानीमा थपिन्छ र तपाईंको दरमा कर लाग्छ। बोनसमा SSF कट्टी हुँदैन। हातमा कति आउँछ हेर्नुहोस्।"}
          </Callout>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            {isEn ? "Monthly salary (Rs.)" : "मासिक तलब (रु.)"}
            <input type="number" min={0} value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="input mt-1" />
          </label>
          <label className={labelCls}>
            {isEn ? "Bonus amount (Rs.)" : "बोनस रकम (रु.)"}
            <input type="number" min={0} value={bonus} onChange={(e) => setBonus(Number(e.target.value))} className="input mt-1" />
            <button
              type="button"
              onClick={() => setBonus(salary)}
              className="mt-1 text-xs font-normal text-primary-700 underline hover:text-primary-800"
            >
              {isEn ? "= one month's salary" : "= एक महिनाको तलब"}
            </button>
          </label>
          <label className={labelCls}>
            {isEn ? "Fiscal year" : "आर्थिक वर्ष"}
            <select value={yearId} onChange={(e) => setYearId(e.target.value)} className="select mt-1">
              {Object.values(TAX_YEARS).map((y) => (
                <option key={y.id} value={y.id}>{isEn ? y.label : y.labelNe}</option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            {isEn ? "Filing status" : "करदाता स्थिति"}
            <select value={status} onChange={(e) => setStatus(e.target.value as FilingStatus)} disabled={unified} className="select mt-1 disabled:bg-ink-100 disabled:text-ink-400">
              <option value="individual">{isEn ? "Individual" : "एकल"}</option>
              <option value="couple">{isEn ? "Couple" : "दम्पती"}</option>
            </select>
          </label>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm font-medium text-ink-900">
          <input type="checkbox" checked={ssf} onChange={(e) => setSsf(e.target.checked)} className="h-4 w-4 accent-primary-600" />
          {isEn ? "I contribute to SSF" : "म SSF मा योगदान गर्छु"}
        </label>
      </div>

      <section className="surface mt-6 p-5 md:p-6">
        <p className="text-sm text-ink-500">{isEn ? "Bonus in hand" : "हातमा बोनस"}</p>
        <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">{npr(r.netBonus)}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-ink-200 bg-white p-3">
            <p className="text-xs text-ink-500">{isEn ? "Extra tax on bonus" : "बोनसमा थप कर"}</p>
            <p className="font-semibold text-ink-900">{npr(r.extraTax)}</p>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-3">
            <p className="text-xs text-ink-500">{isEn ? "Effective rate on bonus" : "बोनसमा प्रभावकारी दर"}</p>
            <p className="font-semibold text-ink-900">{r.marginalRatePct}%</p>
          </div>
        </div>

        <div className="mt-4">
          <Callout tone="warn">
            {isEn
              ? "Preliminary estimate. The bonus can push part of your income into a higher bracket, so the effective rate may exceed your usual rate. Confirm with a tax professional."
              : "प्रारम्भिक अनुमान। बोनसले आम्दानीको केही भाग माथिल्लो स्ल्याबमा धकेल्न सक्छ, त्यसैले प्रभावकारी दर सामान्यभन्दा बढी हुनसक्छ। कर विशेषज्ञसँग पुष्टि गर्नुहोस्।"}
          </Callout>
        </div>
      </section>
    </div>
  );
}
