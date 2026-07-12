"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateLumpsum, type LumpsumResult } from "@/lib/calculation/finance";
import { formatNpr } from "@/lib/money";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

const FREQ = [
  { v: 1, ne: "वार्षिक", en: "Yearly" },
  { v: 2, ne: "अर्धवार्षिक", en: "Half-yearly" },
  { v: 4, ne: "त्रैमासिक", en: "Quarterly" },
  { v: 12, ne: "मासिक", en: "Monthly" },
];

export function FdCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [principal, setPrincipal] = useState(500_000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(5);
  const [freq, setFreq] = useState(4);

  const result: LumpsumResult | null = useMemo(() => {
    try {
      return calculateLumpsum(principal, rate, years, freq);
    } catch {
      return null;
    }
  }, [principal, rate, years, freq]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
          💡{" "}
          {isEn
            ? "For a one-time deposit (fixed deposit or lump-sum investment). See how compounding grows it over time."
            : "एकपटक जम्मा गर्ने रकम (Fixed Deposit वा एकमुष्ट लगानी) का लागि। Compounding ले समयसँगै कति बढाउँछ हेर्नुहोस्।"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
            {isEn ? "Deposit amount (Rs.)" : "जम्मा रकम (रु.)"}
            <input
              type="number"
              min={1000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Annual interest rate" : "वार्षिक ब्याज दर"}: {rate}%
            <input
              type="range"
              min={1}
              max={15}
              step={0.25}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mt-2 w-full accent-primary-600"
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Period (years)" : "अवधि (वर्ष)"}: {years}
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-2 w-full accent-action-500"
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
            {isEn ? "Compounding frequency" : "Compounding आवृत्ति"}
            <select
              value={freq}
              onChange={(e) => setFreq(Number(e.target.value))}
              className={inputCls}
            >
              {FREQ.map((f) => (
                <option key={f.v} value={f.v}>
                  {isEn ? f.en : f.ne}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
              <p className="text-xs text-primary-100">
                {isEn ? "Maturity value" : "परिपक्व मूल्य"}
              </p>
              <p className="mt-1 text-2xl font-bold">{npr(result.maturity)}</p>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-500">
                {isEn ? "Deposited" : "जम्मा गरेको"}
              </p>
              <p className="mt-1 text-2xl font-bold text-primary-800">
                {npr(result.principal)}
              </p>
            </div>
            <div className="rounded-2xl border border-action-500/30 bg-action-50 p-5 shadow-sm">
              <p className="text-xs text-gray-600">
                {isEn ? "Interest earned" : "प्राप्त ब्याज"}
              </p>
              <p className="mt-1 text-2xl font-bold text-action-700">
                +{npr(result.interest)}
              </p>
            </div>
          </div>

          <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
            ⚠️{" "}
            {isEn
              ? "A preliminary estimate before tax. Interest income may be taxable; bank FD rates vary. This is not financial advice."
              : "कर अघिको प्रारम्भिक अनुमान। ब्याज आयमा कर लाग्न सक्छ; बैंक FD दर फरक हुन्छ। यो वित्तीय सल्लाह होइन।"}
          </p>
        </>
      )}
    </div>
  );
}
