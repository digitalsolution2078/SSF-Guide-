"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { netToGross } from "@/lib/calculation/salary-tools";
import { calculateTakeHome } from "@/lib/calculation/take-home";
import { TAX_YEARS, type FilingStatus } from "@/lib/calculation/income-tax";
import { formatNpr } from "@/lib/money";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

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
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setMode("netToGross")}
            className={`rounded-lg py-2 ${mode === "netToGross" ? "bg-primary-600 text-white" : "text-gray-600"}`}
          >
            {isEn ? "Net → Gross" : "हातमा → कुल तलब"}
          </button>
          <button
            type="button"
            onClick={() => setMode("grossToNet")}
            className={`rounded-lg py-2 ${mode === "grossToNet" ? "bg-primary-600 text-white" : "text-gray-600"}`}
          >
            {isEn ? "Gross → Net" : "कुल तलब → हातमा"}
          </button>
        </div>

        <label className="block text-sm font-semibold text-gray-800">
          {mode === "netToGross"
            ? isEn ? "Desired take-home (Rs./month)" : "चाहिएको हातमा तलब (रु./महिना)"
            : isEn ? "Gross salary (Rs./month)" : "कुल तलब (रु./महिना)"}
          <input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className={inputCls} />
        </label>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Fiscal year" : "आर्थिक वर्ष"}
            <select value={yearId} onChange={(e) => setYearId(e.target.value)} className={inputCls.replace("text-lg font-semibold", "")}>
              {Object.values(TAX_YEARS).map((y) => (
                <option key={y.id} value={y.id}>{isEn ? y.label : y.labelNe}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Filing status" : "करदाता स्थिति"}
            <select value={status} onChange={(e) => setStatus(e.target.value as FilingStatus)} disabled={unified} className={`${inputCls.replace("text-lg font-semibold", "")} disabled:bg-gray-100 disabled:text-gray-400`}>
              <option value="individual">{isEn ? "Individual" : "एकल"}</option>
              <option value="couple">{isEn ? "Couple" : "दम्पती"}</option>
            </select>
          </label>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-primary-50 p-3 text-sm font-semibold text-primary-900">
          <input type="checkbox" checked={ssf} onChange={(e) => setSsf(e.target.checked)} className="h-4 w-4 accent-primary-600" />
          {isEn ? "Include SSF (11% deduction)" : "SSF समावेश (११% कट्टी)"}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
          <p className="text-xs text-primary-100">
            {mode === "netToGross"
              ? isEn ? "Gross salary to write in contract" : "करारमा लेख्ने कुल तलब"
              : isEn ? "Take-home (cash in hand)" : "हातमा आउने"}
          </p>
          <p className="mt-1 text-3xl font-extrabold">
            {npr(mode === "netToGross" ? result.gross : result.net)}
          </p>
        </div>
        <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm text-sm">
          <div className="flex justify-between py-1"><span className="text-gray-600">{isEn ? "Gross" : "कुल तलब"}</span><span className="font-semibold">{npr(result.gross)}</span></div>
          <div className="flex justify-between py-1"><span className="text-gray-600">− SSF (11%)</span><span className="font-semibold text-action-600">{npr(result.employeeSsf)}</span></div>
          <div className="flex justify-between py-1"><span className="text-gray-600">− {isEn ? "Income tax" : "आयकर"}</span><span className="font-semibold text-action-600">{npr(result.tax)}</span></div>
          <div className="mt-1 flex justify-between border-t pt-2"><span className="font-semibold text-gray-900">{isEn ? "Net" : "हातमा"}</span><span className="font-bold text-primary-700">{npr(result.net)}</span></div>
        </div>
      </div>

      <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
        ⚠️{" "}
        {isEn
          ? "Preliminary estimate assuming the salary is the SSF/tax base. Great for HR drafting contracts or job-seekers comparing offers — confirm exact figures with payroll."
          : "तलबलाई SSF/कर आधार मानेको प्रारम्भिक अनुमान। करार बनाउने HR वा offer तुलना गर्ने job-seeker लाई उपयोगी — payroll सँग ठ्याक्कै रकम पुष्टि गर्नुहोस्।"}
      </p>
    </div>
  );
}
