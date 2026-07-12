"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { fdMonthlyIncome } from "@/lib/calculation/salary-tools";
import { formatNpr } from "@/lib/money";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

export function FdIncomeCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [principal, setPrincipal] = useState(2_000_000);
  const [rate, setRate] = useState(9);
  const [taxPct, setTaxPct] = useState(5);

  const r = useMemo(
    () => fdMonthlyIncome({ principal, annualRatePct: rate, interestTaxPct: taxPct }),
    [principal, rate, taxPct],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
          💡{" "}
          {isEn
            ? "Many retirees live off Fixed Deposit interest. See your monthly/quarterly payout after interest tax — the principal stays intact."
            : "धेरै अवकाशप्राप्तहरू Fixed Deposit को ब्याजमा जीविका चलाउँछन्। ब्याज कर कटाएपछि मासिक/त्रैमासिक कति आउँछ हेर्नुहोस् — साँवा जस्ताको तस्तै रहन्छ।"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
            {isEn ? "FD amount (Rs.)" : "FD रकम (रु.)"}
            <input type="number" min={0} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Annual interest rate" : "वार्षिक ब्याज दर"}: {rate}%
            <input type="range" min={1} max={15} step={0.25} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-2 w-full accent-primary-600" />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Interest tax (TDS)" : "ब्याज कर (TDS)"}: {taxPct}%
            <input type="range" min={0} max={15} step={0.5} value={taxPct} onChange={(e) => setTaxPct(Number(e.target.value))} className="mt-2 w-full accent-action-500" />
            <span className="text-xs font-normal text-gray-500">
              {isEn ? "Individuals: commonly ~5% — confirm current rate" : "व्यक्ति: सामान्यतः ~५% — हालको दर पुष्टि गर्नुहोस्"}
            </span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
          <p className="text-xs text-primary-100">{isEn ? "Net monthly income" : "मासिक आम्दानी (कर कटी)"}</p>
          <p className="mt-1 text-2xl font-bold">{npr(r.netMonthly)}</p>
        </div>
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">{isEn ? "Net quarterly" : "त्रैमासिक (कर कटी)"}</p>
          <p className="mt-1 text-2xl font-bold text-primary-800">{npr(r.netQuarterly)}</p>
        </div>
        <div className="rounded-2xl border border-action-500/30 bg-action-50 p-5 shadow-sm">
          <p className="text-xs text-gray-600">{isEn ? "Interest tax / month" : "ब्याज कर / महिना"}</p>
          <p className="mt-1 text-2xl font-bold text-action-700">{npr(r.taxMonthly)}</p>
        </div>
      </div>

      <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
        ⚠️{" "}
        {isEn
          ? `Assumes interest is paid out (principal untouched) and simple annual interest. Gross ${npr(r.grossMonthly)}/month, net ${npr(r.netMonthly)}/month after ${taxPct}% tax. Bank rates and tax rules vary — not financial advice.`
          : `ब्याज भुक्तानी हुने (साँवा नछोइने) र साधारण वार्षिक ब्याज मानेको। कुल ${npr(r.grossMonthly)}/महिना, ${taxPct}% कर कटी ${npr(r.netMonthly)}/महिना। बैंक दर र कर नियम फरक हुन्छन् — वित्तीय सल्लाह होइन।`}
      </p>
    </div>
  );
}
