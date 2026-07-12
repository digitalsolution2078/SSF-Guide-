"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateTakeHome, type TakeHomeResult } from "@/lib/calculation/take-home";
import { TAX_YEARS, type FilingStatus } from "@/lib/calculation/income-tax";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

export function TakeHomeCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [salary, setSalary] = useState(50_000);
  const [yearId, setYearId] = useState("2083/84");
  const [status, setStatus] = useState<FilingStatus>("individual");
  const [ssf, setSsf] = useState(true);

  const cfg = TAX_YEARS[yearId];
  const r: TakeHomeResult | null = useMemo(() => {
    try {
      return calculateTakeHome({
        monthlySalary: salary,
        yearId,
        status,
        ssfContributor: ssf,
      });
    } catch {
      return null;
    }
  }, [salary, yearId, status, ssf]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
            {isEn ? "Monthly salary (Rs.)" : "मासिक तलब (रु.)"}
            <input
              type="number"
              min={0}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Fiscal year" : "आर्थिक वर्ष"}
            <select
              value={yearId}
              onChange={(e) => setYearId(e.target.value)}
              className={inputCls}
            >
              {Object.values(TAX_YEARS).map((y) => (
                <option key={y.id} value={y.id}>
                  {isEn ? y.label : y.labelNe}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Filing status" : "करदाता स्थिति"}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as FilingStatus)}
              disabled={cfg?.unified}
              className={`${inputCls} disabled:bg-gray-100 disabled:text-gray-400`}
            >
              <option value="individual">{isEn ? "Individual" : "एकल"}</option>
              <option value="couple">{isEn ? "Couple" : "दम्पती"}</option>
            </select>
          </label>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-lg bg-primary-50 p-3 text-sm font-semibold text-primary-900">
          <input
            type="checkbox"
            checked={ssf}
            onChange={(e) => setSsf(e.target.checked)}
            className="h-4 w-4 accent-primary-600"
          />
          {isEn
            ? "I contribute to SSF (11% deducted, employer adds 20%)"
            : "म SSF मा योगदान गर्छु (११% कट्टी, रोजगारदाताले २०% थप्ने)"}
        </label>
      </div>

      {r && (
        <>
          {/* headline take-home */}
          <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
            <p className="text-xs text-primary-100">
              {isEn ? "Cash in hand (per month)" : "हातमा आउने (प्रति महिना)"}
            </p>
            <p className="text-3xl font-extrabold">{npr(r.netMonthly)}</p>
            <p className="mt-1 text-xs text-primary-200">
              {isEn
                ? `Annual take-home: ${npr(r.netAnnual)}`
                : `वार्षिक हातमा: ${npr(r.netAnnual)}`}
            </p>
          </div>

          {/* waterfall */}
          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-primary-900">
              {isEn ? "How it adds up" : "कसरी बन्छ"}
            </p>
            <div className="space-y-2 text-sm">
              <Row label={isEn ? "Gross salary" : "कुल तलब"} value={npr(r.monthlySalary)} strong />
              {ssf && (
                <Row
                  label={isEn ? "− SSF contribution (11%)" : "− SSF योगदान (११%)"}
                  value={`− ${npr(r.employeeSsf)}`}
                  tone="minus"
                />
              )}
              <Row
                label={isEn ? "− Income tax" : "− आयकर"}
                value={`− ${npr(r.monthlyTax)}`}
                tone="minus"
              />
              <div className="border-t pt-2">
                <Row
                  label={isEn ? "= Take-home" : "= हातमा"}
                  value={npr(r.netMonthly)}
                  strong
                  tone="plus"
                />
              </div>
            </div>
          </div>

          {/* employer positive framing */}
          {ssf && (
            <div className="rounded-2xl border border-action-500/30 bg-action-50 p-5">
              <p className="text-sm font-semibold text-action-700">
                🎁 {isEn ? "Bonus you don't see in cash" : "नगदमा नदेखिने फाइदा"}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {isEn
                  ? `Your employer adds ${npr(r.employerSsf)}/month on top of your salary into your SSF account. Together with your share, `
                  : `रोजगारदाताले तलबभन्दा माथि ${npr(r.employerSsf)}/महिना तपाईंकै SSF खातामा थप्छ। तपाईंको भागसहित, `}
                <span className="font-bold text-primary-800">
                  {npr(r.annualSsfToYourAccount)}/{isEn ? "year" : "वर्ष"}
                </span>{" "}
                {isEn
                  ? "goes into your pension, gratuity, and insurance."
                  : "तपाईंको पेन्सन, उपदान र बीमामा जान्छ।"}
              </p>
            </div>
          )}

          <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
            ⚠️{" "}
            {isEn
              ? "Preliminary estimate assuming the entered salary is the SSF/tax base. Allowances, other deductions, and employer-SSF tax treatment can change the exact figure — use the full Income Tax calculator for details."
              : "प्रवेश गरिएको तलबलाई SSF/कर आधार मानेको प्रारम्भिक अनुमान। भत्ता, अन्य कटौती र रोजगारदाता-SSF को कर व्यवहारले ठ्याक्कै रकम फेर्न सक्छ — विस्तृतका लागि पूरा आयकर calculator प्रयोग गर्नुहोस्।"}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/calculators/income-tax"
              className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
            >
              🧾 {isEn ? "Full income tax breakdown →" : "पूरा आयकर breakdown →"}
            </Link>
            <Link
              href="/sector/formal"
              className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
            >
              🧮 {isEn ? "Where your SSF goes →" : "तपाईंको SSF कहाँ जान्छ →"}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "plus" | "minus";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={strong ? "font-semibold text-gray-900" : "text-gray-600"}>
        {label}
      </span>
      <span
        className={`${strong ? "text-lg font-bold" : "font-medium"} ${
          tone === "minus"
            ? "text-action-600"
            : tone === "plus"
              ? "text-primary-700"
              : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
