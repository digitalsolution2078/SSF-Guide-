"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { pensionTopUp } from "@/lib/calculation/salary-tools";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

export function PensionTopUpCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [target, setTarget] = useState(50_000);
  const [ssfPension, setSsfPension] = useState(20_000);
  const [yearsTo, setYearsTo] = useState(25);
  const [yearsIn, setYearsIn] = useState(20);
  const [ret, setRet] = useState(10);

  const r = useMemo(
    () =>
      pensionTopUp({
        targetMonthly: target,
        ssfPensionMonthly: ssfPension,
        yearsToRetirement: yearsTo,
        yearsInRetirement: yearsIn,
        annualReturnPct: ret,
      }),
    [target, ssfPension, yearsTo, yearsIn, ret],
  );
  const covered = r.deficit === 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
          💡{" "}
          {isEn
            ? "Worried your SSF pension alone won't be enough? Enter your target monthly income at retirement and see how much to invest monthly (SIP) to cover the gap."
            : "SSF पेन्सन मात्र पुग्दैन कि भन्ने चिन्ता? अवकाशमा चाहिने मासिक आम्दानी राख्नुहोस् — बाँकी खाडल पुर्‍याउन मासिक कति लगानी (SIP) चाहिन्छ हेर्नुहोस्।"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Target monthly income at 60 (Rs.)" : "६० वर्षमा चाहिने मासिक आम्दानी (रु.)"}
            <input type="number" min={0} value={target} onChange={(e) => setTarget(Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Expected SSF pension (Rs./month)" : "अपेक्षित SSF पेन्सन (रु./महिना)"}
            <input type="number" min={0} value={ssfPension} onChange={(e) => setSsfPension(Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Years until retirement" : "अवकाशसम्मको वर्ष"}: {yearsTo}
            <input type="range" min={1} max={40} value={yearsTo} onChange={(e) => setYearsTo(Number(e.target.value))} className="mt-2 w-full accent-primary-600" />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Years in retirement" : "अवकाशपछिको वर्ष"}: {yearsIn}
            <input type="range" min={10} max={35} value={yearsIn} onChange={(e) => setYearsIn(Number(e.target.value))} className="mt-2 w-full accent-action-500" />
          </label>
          <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
            {isEn ? "Expected investment return" : "अपेक्षित लगानी प्रतिफल"}: {ret}%
            <input type="range" min={4} max={20} step={0.5} value={ret} onChange={(e) => setRet(Number(e.target.value))} className="mt-2 w-full accent-primary-600" />
          </label>
        </div>
      </div>

      {covered ? (
        <div className="rounded-2xl border border-green-300 bg-green-50 p-5 text-green-800">
          ✓ {isEn ? "Your SSF pension already meets your target — no top-up needed." : "तपाईंको SSF पेन्सनले नै लक्ष्य भेट्छ — थप गर्नु पर्दैन।"}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-action-500/30 bg-action-50 p-5 shadow-sm">
            <p className="text-xs text-gray-600">{isEn ? "Monthly gap" : "मासिक खाडल"}</p>
            <p className="mt-1 text-2xl font-bold text-action-700">{npr(r.deficit)}</p>
          </div>
          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
            <p className="text-xs text-gray-500">{isEn ? "Extra corpus needed" : "थप कोष चाहिने"}</p>
            <p className="mt-1 text-2xl font-bold text-primary-800">{npr(r.corpusNeeded)}</p>
          </div>
          <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
            <p className="text-xs text-primary-100">{isEn ? "Invest per month (SIP)" : "मासिक लगानी (SIP)"}</p>
            <p className="mt-1 text-2xl font-bold">{npr(r.requiredMonthlySip)}</p>
          </div>
        </div>
      )}

      <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
        ⚠️{" "}
        {isEn
          ? "Simplified estimate. Use the SSF Financial Planner to estimate your SSF pension first, then this tool for the top-up. Investment returns vary and carry risk; not financial advice."
          : "सरल अनुमान। पहिले SSF Financial Planner ले आफ्नो SSF पेन्सन अनुमान गर्नुहोस्, अनि यो tool ले थप। लगानी प्रतिफल फरक र जोखिमयुक्त; वित्तीय सल्लाह होइन।"}
      </p>
      <Link href="/calculators/financial-planner" className="block rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400">
        💰 {isEn ? "Estimate my SSF pension first →" : "पहिले SSF पेन्सन अनुमान गर्नुहोस् →"}
      </Link>
    </div>
  );
}
