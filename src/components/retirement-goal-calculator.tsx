"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  calculateRetirementCorpus,
  calculateGoalSip,
  type RetirementCorpusResult,
} from "@/lib/calculation/finance";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

export function RetirementGoalCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [age, setAge] = useState(30);
  const [expense, setExpense] = useState(30_000);
  const [inflation, setInflation] = useState(6);
  const [retireYears, setRetireYears] = useState(20);
  const [returnPct, setReturnPct] = useState(9);

  const result: RetirementCorpusResult | null = useMemo(() => {
    try {
      return calculateRetirementCorpus({
        currentAge: age,
        retirementAge: 60,
        monthlyExpenseToday: expense,
        inflationPct: inflation,
        yearsInRetirement: retireYears,
      });
    } catch {
      return null;
    }
  }, [age, expense, inflation, retireYears]);

  const monthlyToSave = useMemo(() => {
    if (!result) return null;
    try {
      return calculateGoalSip(result.corpusNeeded, result.yearsToRetirement, returnPct);
    } catch {
      return null;
    }
  }, [result, returnPct]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
          💡{" "}
          {isEn
            ? "How much will you need at 60 to keep your lifestyle — and how much to save monthly to get there? SSF pension covers part of this; the rest is on you."
            : "६० वर्षमा आफ्नो जीवनस्तर कायम राख्न कति चाहिन्छ — र त्यहाँ पुग्न मासिक कति बचाउने? SSF pension ले केही भाग ढाक्छ; बाँकी तपाईंको हातमा।"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Current age" : "हालको उमेर"}
            <input
              type="number"
              min={16}
              max={59}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Monthly expense today (Rs.)" : "आजको मासिक खर्च (रु.)"}
            <input
              type="number"
              min={1000}
              value={expense}
              onChange={(e) => setExpense(Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Average inflation" : "औसत मुद्रास्फीति"}: {inflation}%
            <input
              type="range"
              min={3}
              max={12}
              step={0.5}
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              className="mt-2 w-full accent-primary-600"
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Years in retirement" : "अवकाशपछिको वर्ष"}: {retireYears}
            <input
              type="range"
              min={10}
              max={35}
              step={1}
              value={retireYears}
              onChange={(e) => setRetireYears(Number(e.target.value))}
              className="mt-2 w-full accent-action-500"
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
            {isEn ? "Expected return on savings" : "बचतको अपेक्षित प्रतिफल"}: {returnPct}%
            <input
              type="range"
              min={4}
              max={15}
              step={0.5}
              value={returnPct}
              onChange={(e) => setReturnPct(Number(e.target.value))}
              className="mt-2 w-full accent-primary-600"
            />
          </label>
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-500">
                {isEn ? "Monthly expense at 60" : "६० वर्षमा मासिक खर्च"}
              </p>
              <p className="mt-1 text-xl font-bold text-primary-800">
                {npr(result.monthlyExpenseAtRetirement)}
              </p>
            </div>
            <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
              <p className="text-xs text-primary-100">
                {isEn ? "Corpus needed at 60" : "६० वर्षमा चाहिने कोष"}
              </p>
              <p className="mt-1 text-xl font-bold">{npr(result.corpusNeeded)}</p>
            </div>
            {monthlyToSave && (
              <div className="rounded-2xl border border-action-500/30 bg-action-50 p-5 shadow-sm">
                <p className="text-xs text-gray-600">
                  {isEn ? "Save per month from now" : "अहिलेदेखि मासिक बचत"}
                </p>
                <p className="mt-1 text-xl font-bold text-action-700">
                  {npr(monthlyToSave.monthly)}
                </p>
              </div>
            )}
          </div>

          <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
            ⚠️{" "}
            {isEn
              ? "A simplified estimate: expenses are inflated to age 60 and multiplied across your retirement years. Returns during retirement can reduce the corpus needed. Your SSF pension and retirement benefit reduce how much extra you must save — compare with the SSF Financial Planner."
              : "सरल अनुमान: खर्च ६० वर्षसम्म मुद्रास्फीतिले बढाइएको र अवकाश वर्षले गुणन गरिएको। अवकाशकालमा प्रतिफलले चाहिने कोष घटाउन सक्छ। तपाईंको SSF pension र अवकाश सुविधाले थप बचत घटाउँछ — SSF Financial Planner सँग तुलना गर्नुहोस्।"}
          </p>

          <Link
            href="/calculators/financial-planner"
            className="block rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
          >
            💰 {isEn ? "How much will SSF give you? →" : "SSF ले कति दिन्छ हेर्नुहोस् →"}
          </Link>
        </>
      )}
    </div>
  );
}
