"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { pensionTopUp } from "@/lib/calculation/salary-tools";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";
import { Callout } from "./ui";
import { Icon } from "./icons";

const labelCls = "block text-sm font-medium text-ink-700";

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
    <div>
      <div className="card p-5 md:p-6">
        <div className="mb-5">
          <Callout tone="info">
            {isEn
              ? "Worried your SSF pension alone won't be enough? Enter your target monthly income at retirement and see how much to invest monthly (SIP) to cover the gap."
              : "SSF पेन्सन मात्र पुग्दैन कि भन्ने चिन्ता? अवकाशमा चाहिने मासिक आम्दानी राख्नुहोस् — बाँकी खाडल पुर्‍याउन मासिक कति लगानी (SIP) चाहिन्छ हेर्नुहोस्।"}
          </Callout>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            {isEn ? "Target monthly income at 60 (Rs.)" : "६० वर्षमा चाहिने मासिक आम्दानी (रु.)"}
            <input type="number" min={0} value={target} onChange={(e) => setTarget(Number(e.target.value))} className="input mt-1" />
          </label>
          <label className={labelCls}>
            {isEn ? "Expected SSF pension (Rs./month)" : "अपेक्षित SSF पेन्सन (रु./महिना)"}
            <input type="number" min={0} value={ssfPension} onChange={(e) => setSsfPension(Number(e.target.value))} className="input mt-1" />
          </label>
          <label className={labelCls}>
            {isEn ? "Years until retirement" : "अवकाशसम्मको वर्ष"}: {yearsTo}
            <input type="range" min={1} max={40} value={yearsTo} onChange={(e) => setYearsTo(Number(e.target.value))} className="mt-2 w-full accent-primary-600" />
          </label>
          <label className={labelCls}>
            {isEn ? "Years in retirement" : "अवकाशपछिको वर्ष"}: {yearsIn}
            <input type="range" min={10} max={35} value={yearsIn} onChange={(e) => setYearsIn(Number(e.target.value))} className="mt-2 w-full accent-primary-600" />
          </label>
          <label className={`${labelCls} sm:col-span-2`}>
            {isEn ? "Expected investment return" : "अपेक्षित लगानी प्रतिफल"}: {ret}%
            <input type="range" min={4} max={20} step={0.5} value={ret} onChange={(e) => setRet(Number(e.target.value))} className="mt-2 w-full accent-primary-600" />
          </label>
        </div>
      </div>

      <section className="surface mt-6 p-5 md:p-6">
        {covered ? (
          <Callout tone="success">
            {isEn ? "Your SSF pension already meets your target — no top-up needed." : "तपाईंको SSF पेन्सनले नै लक्ष्य भेट्छ — थप गर्नु पर्दैन।"}
          </Callout>
        ) : (
          <>
            <p className="text-sm text-ink-500">{isEn ? "Invest per month (SIP)" : "मासिक लगानी (SIP)"}</p>
            <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">{npr(r.requiredMonthlySip)}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-ink-200 bg-white p-3">
                <p className="text-xs text-ink-500">{isEn ? "Monthly gap" : "मासिक खाडल"}</p>
                <p className="font-semibold text-ink-900">{npr(r.deficit)}</p>
              </div>
              <div className="rounded-xl border border-ink-200 bg-white p-3">
                <p className="text-xs text-ink-500">{isEn ? "Extra corpus needed" : "थप कोष चाहिने"}</p>
                <p className="font-semibold text-ink-900">{npr(r.corpusNeeded)}</p>
              </div>
            </div>
          </>
        )}

        <div className="mt-4">
          <Callout tone="warn">
            {isEn
              ? "Simplified estimate. Use the SSF Financial Planner to estimate your SSF pension first, then this tool for the top-up. Investment returns vary and carry risk; not financial advice."
              : "सरल अनुमान। पहिले SSF Financial Planner ले आफ्नो SSF पेन्सन अनुमान गर्नुहोस्, अनि यो tool ले थप। लगानी प्रतिफल फरक र जोखिमयुक्त; वित्तीय सल्लाह होइन।"}
          </Callout>
        </div>

        <div className="mt-5">
          <Link href="/calculators/financial-planner" className="btn-ghost -ml-2">
            <Icon name="coins" size={16} />
            {isEn ? "Estimate my SSF pension first →" : "पहिले SSF पेन्सन अनुमान गर्नुहोस् →"}
          </Link>
        </div>
      </section>
    </div>
  );
}
