"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateInflation, type InflationResult } from "@/lib/calculation/finance";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";
import { Callout } from "./ui";
import { Icon } from "./icons";

const labelCls = "block text-sm font-medium text-ink-700";

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
    <div>
      <div className="card p-5 md:p-6">
        <div className="mb-5">
          <Callout tone="info">
            {isEn
              ? "Inflation quietly reduces what your money can buy. See how much today's amount will cost — and be worth — in the future."
              : "मुद्रास्फीतिले चुपचाप तपाईंको पैसाको किन्ने क्षमता घटाउँछ। आजको रकम भविष्यमा कति पर्छ — र कति मूल्यको हुन्छ — हेर्नुहोस्।"}
          </Callout>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`${labelCls} sm:col-span-2`}>
            {isEn ? "Amount today (Rs.)" : "आजको रकम (रु.)"}
            <input
              type="number"
              min={100}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input mt-1"
            />
          </label>
          <label className={labelCls}>
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
          <label className={labelCls}>
            {isEn ? "Average inflation" : "औसत मुद्रास्फीति"}: {inflation}%
            <input
              type="range"
              min={2}
              max={15}
              step={0.5}
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              className="mt-2 w-full accent-primary-600"
            />
          </label>
        </div>
      </div>

      {result && (
        <section className="surface mt-6 p-5 md:p-6">
          <p className="text-sm text-ink-500">
            {isEn
              ? `${npr(amount)} kept as cash will be worth only`
              : `${npr(amount)} नगदै राखे मूल्य हुन्छ मात्र`}
          </p>
          <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">
            {npr(result.futureValueOfToday)}
          </p>
          <p className="mt-1 text-xs text-ink-500">
            {isEn
              ? `— ${result.erosionPct}% of its power lost`
              : `— किन्ने क्षमताको ${result.erosionPct}% गुम्छ`}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-xl border border-ink-200 bg-white p-3 sm:col-span-1">
              <p className="text-xs text-ink-500">
                {isEn
                  ? `What costs ${npr(amount)} today will cost`
                  : `आज ${npr(amount)} पर्ने कुरा`}
              </p>
              <p className="font-semibold text-ink-900">{npr(result.futureCost)}</p>
              <p className="mt-1 text-xs text-ink-500">
                {isEn ? `in ${years} years` : `${years} वर्षमा`}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Callout tone="info">
              {isEn
                ? "This is why keeping cash idle loses value — and why long-term savings like the SSF pension (which is inflation-adjusted) matter."
                : "त्यसैले नगद यत्तिकै राख्दा मूल्य घट्छ — र SSF pension जस्तो मुद्रास्फीति समायोजन हुने दीर्घकालीन बचत महत्त्वपूर्ण हुन्छ।"}
            </Callout>
          </div>

          <div className="mt-5">
            <Link href="/calculators/financial-planner" className="btn-ghost -ml-2">
              <Icon name="coins" size={16} />
              {isEn ? "See your SSF pension projection →" : "आफ्नो SSF pension projection हेर्नुहोस् →"}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
