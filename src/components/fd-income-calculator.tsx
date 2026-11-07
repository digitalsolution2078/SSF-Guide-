"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { fdMonthlyIncome } from "@/lib/calculation/salary-tools";
import { formatNpr } from "@/lib/money";
import { Callout } from "./ui";

const labelCls = "block text-sm font-medium text-ink-700";

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
    <div>
      <div className="card p-5 md:p-6">
        <div className="mb-5">
          <Callout tone="info">
            {isEn
              ? "Many retirees live off Fixed Deposit interest. See your monthly/quarterly payout after interest tax — the principal stays intact."
              : "धेरै अवकाशप्राप्तहरू Fixed Deposit को ब्याजमा जीविका चलाउँछन्। ब्याज कर कटाएपछि मासिक/त्रैमासिक कति आउँछ हेर्नुहोस् — साँवा जस्ताको तस्तै रहन्छ।"}
          </Callout>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`${labelCls} sm:col-span-2`}>
            {isEn ? "FD amount (Rs.)" : "FD रकम (रु.)"}
            <input type="number" min={0} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="input mt-1" />
          </label>
          <label className={labelCls}>
            {isEn ? "Annual interest rate" : "वार्षिक ब्याज दर"}: {rate}%
            <input type="range" min={1} max={15} step={0.25} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-2 w-full accent-primary-600" />
          </label>
          <label className={labelCls}>
            {isEn ? "Interest tax (TDS)" : "ब्याज कर (TDS)"}: {taxPct}%
            <input type="range" min={0} max={15} step={0.5} value={taxPct} onChange={(e) => setTaxPct(Number(e.target.value))} className="mt-2 w-full accent-primary-600" />
            <span className="mt-1 block text-xs font-normal text-ink-500">
              {isEn ? "Individuals: commonly ~5% — confirm current rate" : "व्यक्ति: सामान्यतः ~५% — हालको दर पुष्टि गर्नुहोस्"}
            </span>
          </label>
        </div>
      </div>

      <section className="surface mt-6 p-5 md:p-6">
        <p className="text-sm text-ink-500">{isEn ? "Net monthly income" : "मासिक आम्दानी (कर कटी)"}</p>
        <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">{npr(r.netMonthly)}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-ink-200 bg-white p-3">
            <p className="text-xs text-ink-500">{isEn ? "Net quarterly" : "त्रैमासिक (कर कटी)"}</p>
            <p className="font-semibold text-ink-900">{npr(r.netQuarterly)}</p>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-3">
            <p className="text-xs text-ink-500">{isEn ? "Interest tax / month" : "ब्याज कर / महिना"}</p>
            <p className="font-semibold text-ink-900">{npr(r.taxMonthly)}</p>
          </div>
        </div>

        <div className="mt-4">
          <Callout tone="warn">
            {isEn
              ? `Assumes interest is paid out (principal untouched) and simple annual interest. Gross ${npr(r.grossMonthly)}/month, net ${npr(r.netMonthly)}/month after ${taxPct}% tax. Bank rates and tax rules vary — not financial advice.`
              : `ब्याज भुक्तानी हुने (साँवा नछोइने) र साधारण वार्षिक ब्याज मानेको। कुल ${npr(r.grossMonthly)}/महिना, ${taxPct}% कर कटी ${npr(r.netMonthly)}/महिना। बैंक दर र कर नियम फरक हुन्छन् — वित्तीय सल्लाह होइन।`}
          </Callout>
        </div>
      </section>
    </div>
  );
}
