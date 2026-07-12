"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { dailyWageOvertime } from "@/lib/calculation/salary-tools";
import { formatNpr } from "@/lib/money";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

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
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
          💡{" "}
          {isEn
            ? "Under Nepal's Labour Act 2074, overtime is paid at 1.5× the normal hourly rate. Enter your salary and OT hours to find your daily rate and OT pay."
            : "श्रम ऐन २०७४ अनुसार ओभरटाइम सामान्य घण्टा दरको १.५ गुणा हुन्छ। तलब र OT घण्टा राखेर दैनिक दर र OT रकम पत्ता लगाउनुहोस्।"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Monthly salary (Rs.)" : "मासिक तलब (रु.)"}
            <input type="number" min={0} value={salary} onChange={(e) => setSalary(Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "OT hours (this month)" : "OT घण्टा (यो महिना)"}
            <input type="number" min={0} value={ot} onChange={(e) => setOt(Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Working days / month" : "कामका दिन / महिना"}: {days}
            <input type="range" min={20} max={31} value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-2 w-full accent-primary-600" />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Hours / day" : "घण्टा / दिन"}: {hours}
            <input type="range" min={4} max={12} value={hours} onChange={(e) => setHours(Number(e.target.value))} className="mt-2 w-full accent-action-500" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">{isEn ? "Daily rate" : "दैनिक दर"}</p>
          <p className="mt-1 text-xl font-bold text-primary-800">{npr(r.dailyRate)}</p>
        </div>
        <div className="rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">{isEn ? "Hourly rate" : "घण्टा दर"}</p>
          <p className="mt-1 text-xl font-bold text-primary-800">{npr(r.hourlyRate)}</p>
        </div>
        <div className="rounded-2xl border border-action-500/30 bg-action-50 p-4 shadow-sm">
          <p className="text-xs text-gray-600">{isEn ? "OT rate (1.5×)" : "OT दर (१.५×)"}</p>
          <p className="mt-1 text-xl font-bold text-action-700">{npr(r.otRate)}</p>
        </div>
        <div className="rounded-2xl bg-primary-600 p-4 text-white shadow">
          <p className="text-xs text-primary-100">{isEn ? "OT pay" : "OT रकम"}</p>
          <p className="mt-1 text-xl font-bold">{npr(r.otPay)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-primary-100 bg-white p-5 text-sm shadow-sm">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-900">{isEn ? "Total this month (salary + OT)" : "यो महिना जम्मा (तलब + OT)"}</span>
          <span className="text-lg font-bold text-primary-700">{npr(r.totalWithOt)}</span>
        </div>
      </div>

      <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
        ⚠️{" "}
        {isEn
          ? "Preliminary estimate. The Labour Act caps overtime (generally 4 hrs/day, 24 hrs/week). This shows gross OT before tax/SSF. Confirm with your employer/payroll."
          : "प्रारम्भिक अनुमान। श्रम ऐनले OT सीमा तोक्छ (सामान्यतः ४ घण्टा/दिन, २४ घण्टा/हप्ता)। यो कर/SSF अघिको OT हो। रोजगारदाता/payroll सँग पुष्टि गर्नुहोस्।"}
      </p>
    </div>
  );
}
