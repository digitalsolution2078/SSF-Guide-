"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateSip, type SipResult } from "@/lib/calculation/sip";
import { Link } from "@/i18n/navigation";

function nprNe(n: number): string {
  if (n >= 10_000_000) return `रु. ${(n / 10_000_000).toFixed(2)} करोड`;
  if (n >= 100_000) return `रु. ${(n / 100_000).toFixed(1)} लाख`;
  return `रु. ${n.toLocaleString("en-IN")}`;
}
function nprEn(n: number): string {
  if (n >= 10_000_000) return `Rs. ${(n / 10_000_000).toFixed(2)} crore`;
  if (n >= 100_000) return `Rs. ${(n / 100_000).toFixed(1)} lakh`;
  return `Rs. ${n.toLocaleString("en-IN")}`;
}

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

export function SipCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = isEn ? nprEn : nprNe;

  const [monthly, setMonthly] = useState(3_000);
  const [years, setYears] = useState(20);
  const [returnPct, setReturnPct] = useState(10);
  const [stepUp, setStepUp] = useState(0);

  const result: SipResult | null = useMemo(() => {
    try {
      return calculateSip({
        monthly,
        years,
        annualReturnPct: returnPct,
        annualStepUpPct: stepUp,
      });
    } catch {
      return null;
    }
  }, [monthly, years, returnPct, stepUp]);

  const maxVal = result
    ? Math.max(...result.timeline.map((t) => t.value), 1)
    : 1;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
          💡{" "}
          {isEn
            ? "A SIP means investing a fixed amount every month. Thanks to compounding, small monthly amounts can grow large over the years. This is a general educational tool — not investment advice, and returns are never guaranteed."
            : "SIP भनेको हरेक महिना निश्चित रकम लगानी गर्नु हो। Compounding का कारण सानो मासिक रकम पनि वर्षौंमा ठूलो बन्न सक्छ। यो सामान्य शैक्षिक tool हो — लगानी सल्लाह होइन, र प्रतिफलको ग्यारेन्टी हुँदैन।"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Monthly investment (Rs.)" : "मासिक लगानी (रु.)"}
            <input
              type="number"
              min={100}
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Investment period (years)" : "लगानी अवधि (वर्ष)"}
            <input
              type="number"
              min={1}
              max={60}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className={inputCls}
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
              className="mt-2 w-full accent-primary-600"
            />
            <span className="text-xs font-normal text-gray-500">
              {isEn
                ? "Bank FD ~7–9%, mutual funds/shares vary and carry risk"
                : "बैंक FD ~७–९%, mutual fund/शेयर फरक र जोखिमयुक्त"}
            </span>
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Annual step-up (optional)" : "वार्षिक वृद्धि (वैकल्पिक)"}: {stepUp}%
            <input
              type="range"
              min={0}
              max={20}
              step={1}
              value={stepUp}
              onChange={(e) => setStepUp(Number(e.target.value))}
              className="mt-2 w-full accent-action-500"
            />
            <span className="text-xs font-normal text-gray-500">
              {isEn
                ? "Increase the monthly amount each year as income grows"
                : "आम्दानी बढ्दै जाँदा मासिक रकम हरेक वर्ष बढाउने"}
            </span>
          </label>
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
              <p className="text-xs text-primary-100">
                {isEn ? `Value after ${years} years` : `${years} वर्षपछिको मूल्य`}
              </p>
              <p className="mt-1 text-2xl font-bold">{npr(result.maturityValue)}</p>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-500">
                {isEn ? "Total invested" : "जम्मा लगानी"}
              </p>
              <p className="mt-1 text-2xl font-bold text-primary-800">
                {npr(result.totalInvested)}
              </p>
            </div>
            <div className="rounded-2xl border border-action-500/30 bg-action-50 p-5 shadow-sm">
              <p className="text-xs text-gray-600">
                {isEn ? "Returns earned" : "प्रतिफलबाट थपिएको"}
              </p>
              <p className="mt-1 text-2xl font-bold text-action-700">
                +{npr(result.totalReturns)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">
              {isEn
                ? "Growth over time (invested vs. total value)"
                : "समयसँगै वृद्धि (लगानी vs कुल मूल्य)"}
            </p>
            <div className="mt-4 flex h-32 items-end gap-[3px]">
              {result.timeline.map((t) => (
                <div key={t.year} className="relative flex flex-1 flex-col justify-end">
                  <div
                    className="rounded-t bg-primary-500"
                    style={{ height: `${(t.value / maxVal) * 100}%` }}
                    title={`${isEn ? "Year" : "वर्ष"} ${t.year}: ${npr(t.value)}`}
                  />
                  <div
                    className="rounded-t bg-action-400/70"
                    style={{
                      height: `${(t.invested / maxVal) * 100}%`,
                      marginTop: "-2px",
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>{isEn ? "Year 1" : "वर्ष १"}</span>
              <span>{isEn ? `Year ${years}` : `वर्ष ${years}`}</span>
            </div>
            <div className="mt-3 flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-primary-500" />
                {isEn ? "Total value" : "कुल मूल्य"}
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-action-400/70" />
                {isEn ? "Amount invested" : "लगानी रकम"}
              </span>
            </div>
          </div>

          <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
            ⚠️{" "}
            {isEn
              ? "This is a preliminary educational estimate assuming a constant return. Real returns vary, carry risk, and this is not investment advice. SSF's pension is separate — compare with the SSF Financial Planner."
              : "यो स्थिर प्रतिफल मानेर गरिएको प्रारम्भिक शैक्षिक अनुमान हो। वास्तविक प्रतिफल फरक र जोखिमयुक्त हुन्छ; यो लगानी सल्लाह होइन। SSF को pension छुट्टै हो — SSF Financial Planner सँग तुलना गर्नुहोस्।"}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/calculators/financial-planner"
              className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
            >
              💰 {isEn ? "Compare with the SSF Financial Planner" : "SSF Financial Planner सँग तुलना गर्नुहोस्"}
            </Link>
            <Link
              href="/request?service=registration"
              className="rounded-xl bg-action-500 p-4 text-center text-sm font-semibold text-white hover:bg-action-600"
            >
              🤝 {isEn ? "Get help starting SSF" : "SSF सुरु गर्न सहायता लिनुहोस्"}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
