"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateTakeHome, type TakeHomeResult } from "@/lib/calculation/take-home";
import { TAX_YEARS, type FilingStatus } from "@/lib/calculation/income-tax";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";
import { Callout } from "./ui";
import { Icon } from "./icons";

const labelCls = "block text-sm font-medium text-ink-700";

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
    <div>
      <div className="card p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`${labelCls} sm:col-span-2`}>
            {isEn ? "Monthly salary (Rs.)" : "मासिक तलब (रु.)"}
            <input
              type="number"
              min={0}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              className="input mt-1"
            />
          </label>
          <label className={labelCls}>
            {isEn ? "Fiscal year" : "आर्थिक वर्ष"}
            <select
              value={yearId}
              onChange={(e) => setYearId(e.target.value)}
              className="select mt-1"
            >
              {Object.values(TAX_YEARS).map((y) => (
                <option key={y.id} value={y.id}>
                  {isEn ? y.label : y.labelNe}
                </option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            {isEn ? "Filing status" : "करदाता स्थिति"}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as FilingStatus)}
              disabled={cfg?.unified}
              className="select mt-1 disabled:bg-ink-100 disabled:text-ink-400"
            >
              <option value="individual">{isEn ? "Individual" : "एकल"}</option>
              <option value="couple">{isEn ? "Couple" : "दम्पती"}</option>
            </select>
          </label>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 rounded-xl border border-ink-200 bg-ink-50 p-3 text-sm font-medium text-ink-900">
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
        <section className="surface mt-6 p-5 md:p-6">
          {/* headline take-home */}
          <p className="text-sm text-ink-500">
            {isEn ? "Cash in hand (per month)" : "हातमा आउने (प्रति महिना)"}
          </p>
          <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">{npr(r.netMonthly)}</p>
          <p className="mt-1 text-xs text-ink-500">
            {isEn
              ? `Annual take-home: ${npr(r.netAnnual)}`
              : `वार्षिक हातमा: ${npr(r.netAnnual)}`}
          </p>

          {/* waterfall */}
          <div className="mt-5 rounded-xl border border-ink-200 bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-ink-900">
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
              <div className="border-t border-ink-200 pt-2">
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
            <div className="mt-4">
              <Callout tone="success" title={isEn ? "Bonus you don't see in cash" : "नगदमा नदेखिने फाइदा"}>
                {isEn
                  ? `Your employer adds ${npr(r.employerSsf)}/month on top of your salary into your SSF account. Together with your share, `
                  : `रोजगारदाताले तलबभन्दा माथि ${npr(r.employerSsf)}/महिना तपाईंकै SSF खातामा थप्छ। तपाईंको भागसहित, `}
                <span className="font-bold">
                  {npr(r.annualSsfToYourAccount)}/{isEn ? "year" : "वर्ष"}
                </span>{" "}
                {isEn
                  ? "goes into your pension, gratuity, and insurance."
                  : "तपाईंको पेन्सन, उपदान र बीमामा जान्छ।"}
              </Callout>
            </div>
          )}

          <div className="mt-4">
            <Callout tone="warn">
              {isEn
                ? "Preliminary estimate assuming the entered salary is the SSF/tax base. Allowances, other deductions, and employer-SSF tax treatment can change the exact figure — use the full Income Tax calculator for details."
                : "प्रवेश गरिएको तलबलाई SSF/कर आधार मानेको प्रारम्भिक अनुमान। भत्ता, अन्य कटौती र रोजगारदाता-SSF को कर व्यवहारले ठ्याक्कै रकम फेर्न सक्छ — विस्तृतका लागि पूरा आयकर calculator प्रयोग गर्नुहोस्।"}
            </Callout>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link href="/calculators/income-tax" className="btn-ghost -ml-2">
              <Icon name="file" size={16} />
              {isEn ? "Full income tax breakdown →" : "पूरा आयकर breakdown →"}
            </Link>
            <Link href="/sector/formal" className="btn-ghost">
              <Icon name="calculator" size={16} />
              {isEn ? "Where your SSF goes →" : "तपाईंको SSF कहाँ जान्छ →"}
            </Link>
          </div>
        </section>
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
      <span className={strong ? "font-semibold text-ink-900" : "text-ink-600"}>
        {label}
      </span>
      <span
        className={`${strong ? "text-lg font-bold" : "font-medium"} ${
          tone === "minus"
            ? "text-action-600"
            : tone === "plus"
              ? "text-primary-700"
              : "text-ink-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
