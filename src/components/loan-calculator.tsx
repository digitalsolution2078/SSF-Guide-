"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateEmi, type EmiResult } from "@/lib/calculation/finance";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

const PRESETS = [
  { key: "home", ne: "घर सापटी", en: "Home loan", amount: 5_000_000, rate: 9, years: 20 },
  { key: "edu", ne: "शैक्षिक सापटी", en: "Education loan", amount: 2_000_000, rate: 9, years: 15 },
  { key: "special", ne: "विशेष सापटी", en: "Special loan", amount: 500_000, rate: 10, years: 5 },
];

export function LoanCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [amount, setAmount] = useState(2_000_000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(15);

  const result: EmiResult | null = useMemo(() => {
    try {
      return calculateEmi(amount, rate, years);
    } catch {
      return null;
    }
  }, [amount, rate, years]);

  const principalPct = result
    ? (result.principal / result.totalPayment) * 100
    : 100;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-4 text-xs font-semibold text-gray-500">
          {isEn ? "Quick presets (SSF loans):" : "छिटो presets (SSF सापटी):"}
        </p>
        <div className="mb-5 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => {
                setAmount(p.amount);
                setRate(p.rate);
                setYears(p.years);
              }}
              className="rounded-full border border-primary-200 px-3 py-1.5 text-xs text-primary-800 hover:bg-primary-50"
            >
              {isEn ? p.en : p.ne}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
            {isEn ? "Loan amount (Rs.)" : "सापटी रकम (रु.)"}
            <input
              type="number"
              min={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Annual interest rate" : "वार्षिक ब्याज दर"}: {rate}%
            <input
              type="range"
              min={4}
              max={20}
              step={0.5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mt-2 w-full accent-primary-600"
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Tenure (years)" : "अवधि (वर्ष)"}: {years}
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
        </div>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
              <p className="text-xs text-primary-100">
                {isEn ? "Monthly EMI" : "मासिक किस्ता (EMI)"}
              </p>
              <p className="mt-1 text-2xl font-bold">{npr(result.emi)}</p>
            </div>
            <div className="rounded-2xl border border-action-500/30 bg-action-50 p-5 shadow-sm">
              <p className="text-xs text-gray-600">
                {isEn ? "Total interest" : "कुल ब्याज"}
              </p>
              <p className="mt-1 text-2xl font-bold text-action-700">
                {npr(result.totalInterest)}
              </p>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-500">
                {isEn ? "Total payment" : "कुल भुक्तानी"}
              </p>
              <p className="mt-1 text-2xl font-bold text-primary-800">
                {npr(result.totalPayment)}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-600">
              {isEn ? "Principal vs interest" : "साँवा vs ब्याज"}
            </p>
            <div className="mt-3 flex h-6 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary-500"
                style={{ width: `${principalPct}%` }}
                title={`${isEn ? "Principal" : "साँवा"} ${Math.round(principalPct)}%`}
              />
              <div
                className="bg-action-500"
                style={{ width: `${100 - principalPct}%` }}
                title={`${isEn ? "Interest" : "ब्याज"} ${Math.round(100 - principalPct)}%`}
              />
            </div>
            <div className="mt-2 flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-primary-500" />
                {isEn ? "Principal" : "साँवा"} ({npr(result.principal)})
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded bg-action-500" />
                {isEn ? "Interest" : "ब्याज"} ({npr(result.totalInterest)})
              </span>
            </div>
          </div>

          <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
            ⚠️{" "}
            {isEn
              ? "A preliminary EMI estimate on a fixed rate. SSF loan interest is set by the Board and can change; SSF offers home (up to Rs. 7.5M), education (up to Rs. 3.5M), and collateral-free special loans after 36 months of contribution."
              : "स्थिर दरमा प्रारम्भिक EMI अनुमान। SSF सापटीको ब्याज समितिले तोक्छ र फेरिन सक्छ; ३६ महिना योगदानपछि घर (रु. ७५ लाखसम्म), शैक्षिक (रु. ३५ लाखसम्म) र धितो नचाहिने विशेष सापटी पाइन्छ।"}
          </p>

          <Link
            href="/school/pension-ra-retirement/sapati-loan-guide"
            className="block rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
          >
            📖 {isEn ? "Read the SSF loan guide →" : "SSF सापटी guide पढ्नुहोस् →"}
          </Link>
        </>
      )}
    </div>
  );
}
