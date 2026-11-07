"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateGoalSip, type GoalSipResult } from "@/lib/calculation/finance";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";
import { Callout } from "./ui";
import { Icon } from "./icons";

const labelCls = "block text-sm font-medium text-ink-700";

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
    <div>
      <div className="card p-5 md:p-6">
        <div className="mb-4">
          <Callout tone="info">
            {isEn
              ? "Have a goal amount in mind? This tells you how much to invest every month to reach it — the reverse of a normal SIP."
              : "कुनै लक्ष्य रकम मनमा छ? त्यो पुर्‍याउन हरेक महिना कति लगानी गर्नुपर्छ यसले बताउँछ — सामान्य SIP को उल्टो।"}
          </Callout>
        </div>
        <div className="mb-5 flex flex-wrap gap-2">
          {GOALS.map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => {
                setTarget(g.target);
                setYears(g.years);
              }}
              className="chip"
            >
              {isEn ? g.en : g.ne}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`${labelCls} sm:col-span-2`}>
            {isEn ? "Goal amount (Rs.)" : "लक्ष्य रकम (रु.)"}
            <input
              type="number"
              min={10000}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="input mt-1"
            />
          </label>
          <label className={labelCls}>
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
          <label className={labelCls}>
            {isEn ? "Expected annual return" : "अपेक्षित वार्षिक प्रतिफल"}: {returnPct}%
            <input
              type="range"
              min={4}
              max={20}
              step={0.5}
              value={returnPct}
              onChange={(e) => setReturnPct(Number(e.target.value))}
              className="mt-2 w-full accent-primary-600"
            />
          </label>
        </div>
      </div>

      {result && (
        <section className="surface mt-6 p-5 md:p-6">
          <p className="text-sm text-ink-500">
            {isEn ? "Invest per month" : "प्रति महिना लगानी"}
          </p>
          <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">
            {npr(result.monthly)}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn ? "You invest in total" : "जम्मा लगानी"}
              </p>
              <p className="font-semibold text-ink-900">{npr(result.totalInvested)}</p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn ? "Growth adds" : "वृद्धिले थप्छ"}
              </p>
              <p className="font-semibold text-ink-900">+{npr(result.returns)}</p>
            </div>
          </div>

          <div className="mt-4">
            <Callout tone="warn">
              {isEn
                ? "A preliminary educational estimate assuming a constant return; real returns vary and carry risk. This is not investment advice."
                : "स्थिर प्रतिफल मानेको प्रारम्भिक शैक्षिक अनुमान; वास्तविक प्रतिफल फरक र जोखिमयुक्त हुन्छ। यो लगानी सल्लाह होइन।"}
            </Callout>
          </div>

          <div className="mt-5">
            <Link href="/calculators/sip" className="btn-ghost -ml-2">
              <Icon name="trending" size={16} />
              {isEn ? "Try the SIP Calculator →" : "SIP Calculator प्रयोग गर्नुहोस् →"}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
