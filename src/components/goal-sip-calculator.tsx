"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateGoalSip, type GoalSipResult } from "@/lib/calculation/finance";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

const GOALS = [
  { key: "house", ne: "घर 🏠", en: "House 🏠", target: 5_000_000, years: 15 },
  { key: "edu", ne: "बच्चाको शिक्षा 🎓", en: "Child's education 🎓", target: 2_500_000, years: 12 },
  { key: "car", ne: "गाडी 🚗", en: "Car 🚗", target: 3_000_000, years: 7 },
  { key: "wedding", ne: "विवाह 💍", en: "Wedding 💍", target: 1_500_000, years: 5 },
];

export function GoalSipCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [target, setTarget] = useState(2_500_000);
  const [years, setYears] = useState(12);
  const [returnPct, setReturnPct] = useState(10);

  const result: GoalSipResult | null = useMemo(() => {
    try {
      return calculateGoalSip(target, years, returnPct);
    } catch {
      return null;
    }
  }, [target, years, returnPct]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-3 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
          💡{" "}
          {isEn
            ? "Have a goal amount in mind? This tells you how much to invest every month to reach it — the reverse of a normal SIP."
            : "कुनै लक्ष्य रकम मनमा छ? त्यो पुर्‍याउन हरेक महिना कति लगानी गर्नुपर्छ यसले बताउँछ — सामान्य SIP को उल्टो।"}
        </p>
        <div className="mb-5 flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => {
                setTarget(g.target);
                setYears(g.years);
              }}
              className="rounded-full border border-primary-200 px-3 py-1.5 text-xs text-primary-800 hover:bg-primary-50"
            >
              {isEn ? g.en : g.ne}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
            {isEn ? "Goal amount (Rs.)" : "लक्ष्य रकम (रु.)"}
            <input
              type="number"
              min={10000}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Years to reach it" : "पुर्‍याउने अवधि (वर्ष)"}: {years}
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
            {isEn ? "Expected annual return" : "अपेक्षित वार्षिक प्रतिफल"}: {returnPct}%
            <input
              type="range"
              min={4}
              max={20}
              step={0.5}
              value={returnPct}
              onChange={(e) => setReturnPct(Number(e.target.value))}
              className="mt-2 w-full accent-action-500"
            />
          </label>
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
              <p className="text-xs text-primary-100">
                {isEn ? "Invest per month" : "प्रति महिना लगानी"}
              </p>
              <p className="mt-1 text-2xl font-bold">{npr(result.monthly)}</p>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-500">
                {isEn ? "You invest in total" : "जम्मा लगानी"}
              </p>
              <p className="mt-1 text-2xl font-bold text-primary-800">
                {npr(result.totalInvested)}
              </p>
            </div>
            <div className="rounded-2xl border border-action-500/30 bg-action-50 p-5 shadow-sm">
              <p className="text-xs text-gray-600">
                {isEn ? "Growth adds" : "वृद्धिले थप्छ"}
              </p>
              <p className="mt-1 text-2xl font-bold text-action-700">
                +{npr(result.returns)}
              </p>
            </div>
          </div>

          <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
            ⚠️{" "}
            {isEn
              ? "A preliminary educational estimate assuming a constant return; real returns vary and carry risk. This is not investment advice."
              : "स्थिर प्रतिफल मानेको प्रारम्भिक शैक्षिक अनुमान; वास्तविक प्रतिफल फरक र जोखिमयुक्त हुन्छ। यो लगानी सल्लाह होइन।"}
          </p>

          <Link
            href="/calculators/sip"
            className="block rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
          >
            📈 {isEn ? "Try the SIP Calculator →" : "SIP Calculator प्रयोग गर्नुहोस् →"}
          </Link>
        </>
      )}
    </div>
  );
}
