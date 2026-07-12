"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateInflation, type InflationResult } from "@/lib/calculation/finance";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

export function InflationCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [amount, setAmount] = useState(100_000);
  const [years, setYears] = useState(20);
  const [inflation, setInflation] = useState(6);

  const result: InflationResult | null = useMemo(() => {
    try {
      return calculateInflation(amount, years, inflation);
    } catch {
      return null;
    }
  }, [amount, years, inflation]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
          💡{" "}
          {isEn
            ? "Inflation quietly reduces what your money can buy. See how much today's amount will cost — and be worth — in the future."
            : "मुद्रास्फीतिले चुपचाप तपाईंको पैसाको किन्ने क्षमता घटाउँछ। आजको रकम भविष्यमा कति पर्छ — र कति मूल्यको हुन्छ — हेर्नुहोस्।"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
            {isEn ? "Amount today (Rs.)" : "आजको रकम (रु.)"}
            <input
              type="number"
              min={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Years ahead" : "अगाडिको वर्ष"}: {years}
            <input
              type="range"
              min={1}
              max={40}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-2 w-full accent-primary-600"
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Average inflation" : "औसत मुद्रास्फीति"}: {inflation}%
            <input
              type="range"
              min={2}
              max={15}
              step={0.5}
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              className="mt-2 w-full accent-action-500"
            />
          </label>
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-action-500/30 bg-action-50 p-5 shadow-sm">
              <p className="text-xs text-gray-600">
                {isEn
                  ? `What costs ${npr(amount)} today will cost`
                  : `आज ${npr(amount)} पर्ने कुरा`}
              </p>
              <p className="mt-1 text-2xl font-bold text-action-700">
                {npr(result.futureCost)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {isEn ? `in ${years} years` : `${years} वर्षमा`}
              </p>
            </div>
            <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
              <p className="text-xs text-primary-100">
                {isEn
                  ? `${npr(amount)} kept as cash will be worth only`
                  : `${npr(amount)} नगदै राखे मूल्य हुन्छ मात्र`}
              </p>
              <p className="mt-1 text-2xl font-bold">
                {npr(result.futureValueOfToday)}
              </p>
              <p className="mt-1 text-xs text-primary-200">
                {isEn
                  ? `— ${result.erosionPct}% of its power lost`
                  : `— किन्ने क्षमताको ${result.erosionPct}% गुम्छ`}
              </p>
            </div>
          </div>

          <p className="rounded-lg bg-primary-50 px-4 py-3 text-sm text-gray-700">
            {isEn
              ? "This is why keeping cash idle loses value — and why long-term savings like the SSF pension (which is inflation-adjusted) matter."
              : "त्यसैले नगद यत्तिकै राख्दा मूल्य घट्छ — र SSF pension जस्तो मुद्रास्फीति समायोजन हुने दीर्घकालीन बचत महत्त्वपूर्ण हुन्छ।"}
          </p>

          <Link
            href="/calculators/financial-planner"
            className="block rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
          >
            💰 {isEn ? "See your SSF pension projection →" : "आफ्नो SSF pension projection हेर्नुहोस् →"}
          </Link>
        </>
      )}
    </div>
  );
}
