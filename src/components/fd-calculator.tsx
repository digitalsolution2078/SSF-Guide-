"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateLumpsum, type LumpsumResult } from "@/lib/calculation/finance";
import { formatNpr } from "@/lib/money";
import { Callout } from "./ui";

const labelCls = "block text-sm font-medium text-ink-700";

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
    <div>
      <div className="card p-5 md:p-6">
        <div className="mb-5">
          <Callout tone="info">
            {isEn
              ? "For a one-time deposit (fixed deposit or lump-sum investment). See how compounding grows it over time."
              : "एकपटक जम्मा गर्ने रकम (Fixed Deposit वा एकमुष्ट लगानी) का लागि। Compounding ले समयसँगै कति बढाउँछ हेर्नुहोस्।"}
          </Callout>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`${labelCls} sm:col-span-2`}>
            {isEn ? "Deposit amount (Rs.)" : "जम्मा रकम (रु.)"}
            <input
              type="number"
              min={1000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="input mt-1"
            />
          </label>
          <label className={labelCls}>
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
          <label className={labelCls}>
            {isEn ? "Period (years)" : "अवधि (वर्ष)"}: {years}
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-2 w-full accent-primary-600"
            />
          </label>
          <label className={`${labelCls} sm:col-span-2`}>
            {isEn ? "Compounding frequency" : "Compounding आवृत्ति"}
            <select
              value={freq}
              onChange={(e) => setFreq(Number(e.target.value))}
              className="select mt-1"
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
        <section className="surface mt-6 p-5 md:p-6">
          <p className="text-sm text-ink-500">
            {isEn ? "Maturity value" : "परिपक्व मूल्य"}
          </p>
          <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">
            {npr(result.maturity)}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn ? "Deposited" : "जम्मा गरेको"}
              </p>
              <p className="font-semibold text-ink-900">{npr(result.principal)}</p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn ? "Interest earned" : "प्राप्त ब्याज"}
              </p>
              <p className="font-semibold text-ink-900">+{npr(result.interest)}</p>
            </div>
          </div>

          <div className="mt-4">
            <Callout tone="warn">
              {isEn
                ? "A preliminary estimate before tax. Interest income may be taxable; bank FD rates vary. This is not financial advice."
                : "कर अघिको प्रारम्भिक अनुमान। ब्याज आयमा कर लाग्न सक्छ; बैंक FD दर फरक हुन्छ। यो वित्तीय सल्लाह होइन।"}
            </Callout>
          </div>
        </section>
      )}
    </div>
  );
}
