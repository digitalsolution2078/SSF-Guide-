"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { dailyWageOvertime } from "@/lib/calculation/salary-tools";
import { formatNpr } from "@/lib/money";
import { Callout } from "./ui";

const labelCls = "block text-sm font-medium text-ink-700";

export function WageOvertimeCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [salary, setSalary] = useState(20_000);
  const [days, setDays] = useState(26);
  const [hours, setHours] = useState(8);
  const [ot, setOt] = useState(10);

  const r = useMemo(
    () => dailyWageOvertime({ monthlySalary: salary, workingDaysPerMonth: days, hoursPerDay: hours, otHours: ot }),
    [salary, days, hours, ot],
  );

  return (
    <div>
      <div className="card p-5 md:p-6">
        <div className="mb-5">
          <Callout tone="info">
            {isEn
              ? "Under Nepal's Labour Act 2074, overtime is paid at 1.5× the normal hourly rate. Enter your salary and OT hours to find your daily rate and OT pay."
              : "श्रम ऐन २०७४ अनुसार ओभरटाइम सामान्य घण्टा दरको १.५ गुणा हुन्छ। तलब र OT घण्टा राखेर दैनिक दर र OT रकम पत्ता लगाउनुहोस्।"}
          </Callout>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            {isEn ? "Monthly salary (Rs.)" : "मासिक तलब (रु.)"}
            <input type="number" min={0} value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="input mt-1" />
          </label>
          <label className={labelCls}>
            {isEn ? "OT hours (this month)" : "OT घण्टा (यो महिना)"}
            <input type="number" min={0} value={ot} onChange={(e) => setOt(Number(e.target.value))} className="input mt-1" />
          </label>
          <label className={labelCls}>
            {isEn ? "Working days / month" : "कामका दिन / महिना"}: {days}
            <input type="range" min={20} max={31} value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-2 w-full accent-primary-600" />
          </label>
          <label className={labelCls}>
            {isEn ? "Hours / day" : "घण्टा / दिन"}: {hours}
            <input type="range" min={4} max={12} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="mt-2 w-full accent-primary-600" />
          </label>
        </div>
      </div>

      <section className="surface mt-6 p-5 md:p-6">
        <p className="text-sm text-ink-500">{isEn ? "OT pay" : "OT रकम"}</p>
        <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">{npr(r.otPay)}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-ink-200 bg-white p-3">
            <p className="text-xs text-ink-500">{isEn ? "Daily rate" : "दैनिक दर"}</p>
            <p className="font-semibold text-ink-900">{npr(r.dailyRate)}</p>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-3">
            <p className="text-xs text-ink-500">{isEn ? "Hourly rate" : "घण्टा दर"}</p>
            <p className="font-semibold text-ink-900">{npr(r.hourlyRate)}</p>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-3">
            <p className="text-xs text-ink-500">{isEn ? "OT rate (1.5×)" : "OT दर (१.५×)"}</p>
            <p className="font-semibold text-ink-900">{npr(r.otRate)}</p>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-3">
            <p className="text-xs text-ink-500">{isEn ? "Total this month (salary + OT)" : "यो महिना जम्मा (तलब + OT)"}</p>
            <p className="font-bold text-primary-700">{npr(r.totalWithOt)}</p>
          </div>
        </div>

        <div className="mt-4">
          <Callout tone="warn">
            {isEn
              ? "Preliminary estimate. The Labour Act caps overtime (generally 4 hrs/day, 24 hrs/week). This shows gross OT before tax/SSF. Confirm with your employer/payroll."
              : "प्रारम्भिक अनुमान। श्रम ऐनले OT सीमा तोक्छ (सामान्यतः ४ घण्टा/दिन, २४ घण्टा/हप्ता)। यो कर/SSF अघिको OT हो। रोजगारदाता/payroll सँग पुष्टि गर्नुहोस्।"}
          </Callout>
        </div>
      </section>
    </div>
  );
}
