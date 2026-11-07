"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { netToGross } from "@/lib/calculation/salary-tools";
import { calculateTakeHome } from "@/lib/calculation/take-home";
import { TAX_YEARS, type FilingStatus } from "@/lib/calculation/income-tax";
import { formatNpr } from "@/lib/money";
import { Callout } from "./ui";

const labelCls = "block text-sm font-medium text-ink-700";

export function NetToGrossCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [mode, setMode] = useState<"netToGross" | "grossToNet">("netToGross");
  const [amount, setAmount] = useState(45_000);
  const [yearId, setYearId] = useState("2083/84");
  const [status, setStatus] = useState<FilingStatus>("individual");
  const [ssf, setSsf] = useState(true);
  const unified = TAX_YEARS[yearId]?.unified;

  const result = useMemo(() => {
    const opts = { yearId, status, ssfContributor: ssf };
    if (mode === "netToGross") {
      const r = netToGross(amount, opts);
      return { gross: r.gross, net: r.net, employeeSsf: r.employeeSsf, tax: r.monthlyTax };
    }
    const th = calculateTakeHome({ monthlySalary: amount, ...opts });
    return { gross: amount, net: th.netMonthly, employeeSsf: th.employeeSsf, tax: th.monthlyTax };
  }, [mode, amount, yearId, status, ssf]);

  return (
    <div>
      <div className="card p-5 md:p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("netToGross")}
            className={`chip ${mode === "netToGross" ? "chip-active" : ""}`}
          >
            {isEn ? "Net → Gross" : "हातमा → कुल तलब"}
          </button>
          <button
            type="button"
            onClick={() => setMode("grossToNet")}
            className={`chip ${mode === "grossToNet" ? "chip-active" : ""}`}
          >
            {isEn ? "Gross → Net" : "कुल तलब → हातमा"}
          </button>
        </div>

        <label className={labelCls}>
          {mode === "netToGross"
            ? isEn ? "Desired take-home (Rs./month)" : "चाहिएको हातमा तलब (रु./महिना)"
            : isEn ? "Gross salary (Rs./month)" : "कुल तलब (रु./महिना)"}
          <input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="input mt-1 text-lg font-semibold" />
        </label>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            {isEn ? "Fiscal year" : "आर्थिक वर्ष"}
            <select value={yearId} onChange={(e) => setYearId(e.target.value)} className="select mt-1">
              {Object.values(TAX_YEARS).map((y) => (
                <option key={y.id} value={y.id}>{isEn ? y.label : y.labelNe}</option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            {isEn ? "Filing status" : "करदाता स्थिति"}
            <select value={status} onChange={(e) => setStatus(e.target.value as FilingStatus)} disabled={unified} className="select mt-1 disabled:bg-ink-100 disabled:text-ink-400">
              <option value="individual">{isEn ? "Individual" : "एकल"}</option>
              <option value="couple">{isEn ? "Couple" : "दम्पती"}</option>
            </select>
          </label>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm font-medium text-ink-900">
          <input type="checkbox" checked={ssf} onChange={(e) => setSsf(e.target.checked)} className="h-4 w-4 accent-primary-600" />
          {isEn ? "Include SSF (11% deduction)" : "SSF समावेश (११% कट्टी)"}
        </label>
      </div>

      <section className="surface mt-6 p-5 md:p-6">
        <p className="text-sm text-ink-500">
          {mode === "netToGross"
            ? isEn ? "Gross salary to write in contract" : "करारमा लेख्ने कुल तलब"
            : isEn ? "Take-home (cash in hand)" : "हातमा आउने"}
        </p>
        <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">
          {npr(mode === "netToGross" ? result.gross : result.net)}
        </p>

        <div className="mt-5 rounded-xl border border-ink-200 bg-white p-4 text-sm">
          <div className="flex justify-between border-b border-ink-100 py-2"><span className="text-ink-600">{isEn ? "Gross" : "कुल तलब"}</span><span className="font-semibold text-ink-900">{npr(result.gross)}</span></div>
          <div className="flex justify-between border-b border-ink-100 py-2"><span className="text-ink-600">− SSF (11%)</span><span className="font-semibold text-action-600">{npr(result.employeeSsf)}</span></div>
          <div className="flex justify-between border-b border-ink-100 py-2"><span className="text-ink-600">− {isEn ? "Income tax" : "आयकर"}</span><span className="font-semibold text-action-600">{npr(result.tax)}</span></div>
          <div className="flex justify-between pt-2"><span className="font-bold text-ink-900">{isEn ? "Net" : "हातमा"}</span><span className="font-bold text-primary-700">{npr(result.net)}</span></div>
        </div>

        <div className="mt-4">
          <Callout tone="warn">
            {isEn
              ? "Preliminary estimate assuming the salary is the SSF/tax base. Great for HR drafting contracts or job-seekers comparing offers — confirm exact figures with payroll."
              : "तलबलाई SSF/कर आधार मानेको प्रारम्भिक अनुमान। करार बनाउने HR वा offer तुलना गर्ने job-seeker लाई उपयोगी — payroll सँग ठ्याक्कै रकम पुष्टि गर्नुहोस्।"}
          </Callout>
        </div>
      </section>
    </div>
  );
}
