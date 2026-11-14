"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  planSSF,
  planSSFByContribution,
  type PlannerResult,
} from "@/lib/calculation/planner";
import { Link } from "@/i18n/navigation";
import { useSsfProfile } from "@/lib/profile";
import { trackEvent, bucketNpr } from "@/lib/analytics";
import { waContext } from "@/lib/whatsapp";
import { Callout } from "./ui";
import { Icon } from "./icons";

function nprNe(n: number): string {
  if (n >= 10_000_000) return `रु. ${(n / 10_000_000).toFixed(2)} करोड`;
  if (n >= 100_000) return `रु. ${(n / 100_000).toFixed(1)} लाख`;
  return `रु. ${n.toLocaleString("en-IN")}`;
}

function nprEn(n: number): string {
  if (n >= 10_000_000) return `Rs. ${(n / 10_000_000).toFixed(2)} crore`;
  if (n >= 100_000) return `Rs. ${(n / 100_000).toFixed(1)} lakh`;
  return `Rs. ${n.toLocaleString("en-IN")}`;
}

const labelCls = "block text-sm font-medium text-ink-700";
const helpCls = "mt-1 block text-xs font-normal text-ink-500";

export function FinancialPlanner() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = isEn ? nprEn : nprNe;
  const [mode, setMode] = useState<"salary" | "amount">("salary");
  const [salary, setSalary] = useState(30_000);
  const [pensionAmt, setPensionAmt] = useState(6_000);
  const [retireAmt, setRetireAmt] = useState(2_500);
  const [age, setAge] = useState(30);
  const [returnPct, setReturnPct] = useState(7);
  const [growthPct, setGrowthPct] = useState(5);

  // Pre-fill from My SSF (browser-only profile) once it has hydrated.
  const { profile, ready } = useSsfProfile();
  useEffect(() => {
    if (!ready) return;
    if (profile.basicSalary) setSalary(profile.basicSalary);
    if (profile.age && profile.age < 60) setAge(profile.age);
  }, [ready, profile.basicSalary, profile.age]);

  const result: PlannerResult | null = useMemo(() => {
    try {
      return mode === "salary"
        ? planSSF({
            monthlyBasicSalary: salary,
            currentAge: age,
            annualReturnPct: returnPct,
            annualSalaryGrowthPct: growthPct,
          })
        : planSSFByContribution({
            monthlyPensionContribution: pensionAmt,
            monthlyRetirementContribution: retireAmt,
            currentAge: age,
            annualReturnPct: returnPct,
            annualContributionGrowthPct: growthPct,
          });
    } catch {
      return null;
    }
  }, [mode, salary, pensionAmt, retireAmt, age, returnPct, growthPct]);

  const maxFund = result
    ? Math.max(...result.timeline.map((t) => t.pensionFund + t.retirementFund))
    : 1;

  // One analytics event per settled input change (debounced).
  useEffect(() => {
    if (!result) return;
    const t = setTimeout(
      () => trackEvent("calculator_result", { tool: "financial_planner", mode, salary: bucketNpr(salary), age }),
      900,
    );
    return () => clearTimeout(t);
  }, [result, mode, salary, age]);

  return (
    <div>
      {/* inputs */}
      <div className="card p-5 md:p-6">
        {/* mode toggle — sectors contribute different %, so amount-mode works for everyone */}
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("salary")}
            className={`chip ${mode === "salary" ? "chip-active" : ""}`}
          >
            {isEn ? "By salary (formal sector)" : "तलबबाट (औपचारिक क्षेत्र)"}
          </button>
          <button
            type="button"
            onClick={() => setMode("amount")}
            className={`chip ${mode === "amount" ? "chip-active" : ""}`}
          >
            {isEn ? "By contribution amount (all sectors)" : "योगदान रकमबाट (सबै क्षेत्र)"}
          </button>
        </div>
        {mode === "amount" && (
          <div className="mb-5">
            <Callout tone="info">
              {isEn
                ? "Self-employed, foreign employment, and informal-sector contribution percentages differ — enter the actual amount deposited into your account each month (visible in SOSYS). If nothing goes to the retirement fund, enter 0."
                : "स्वरोजगार, वैदेशिक रोजगारी वा अनौपचारिक क्षेत्रमा योगदान % फरक हुन्छ — आफ्नो खातामा महिनैपिच्छे जम्मा हुने वास्तविक रकम राख्नुहोस् (SOSYS मा देखिन्छ)। अवकाश कोषमा नजाने भए ० राख्नुहोस्।"}
            </Callout>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mode === "salary" ? (
            <label className={labelCls}>
              {isEn ? "Monthly basic salary (Rs.)" : "मासिक आधारभूत तलब (रु.)"}
              <input
                type="number"
                min={1000}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="input mt-1"
              />
            </label>
          ) : (
            <>
              <label className={labelCls}>
                {isEn
                  ? "Monthly deposit to pension fund (Rs.)"
                  : "Pension कोषमा मासिक जम्मा (रु.)"}
                <input
                  type="number"
                  min={1}
                  value={pensionAmt}
                  onChange={(e) => setPensionAmt(Number(e.target.value))}
                  className="input mt-1"
                />
              </label>
              <label className={labelCls}>
                {isEn
                  ? "Monthly deposit to retirement fund (Rs.) — 0 if none"
                  : "अवकाश कोषमा मासिक जम्मा (रु.) — नभए ०"}
                <input
                  type="number"
                  min={0}
                  value={retireAmt}
                  onChange={(e) => setRetireAmt(Number(e.target.value))}
                  className="input mt-1"
                />
              </label>
            </>
          )}
          <label className={labelCls}>
            {isEn ? "Current age" : "हालको उमेर"}
            <input
              type="number"
              min={16}
              max={59}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="input mt-1"
            />
          </label>
          <label className={labelCls}>
            {isEn ? "Annual return" : "वार्षिक प्रतिफल (return)"}: {returnPct}%
            <input
              type="range"
              min={4}
              max={12}
              step={0.5}
              value={returnPct}
              onChange={(e) => setReturnPct(Number(e.target.value))}
              className="mt-2 w-full accent-primary-600"
            />
            <span className={helpCls}>
              {isEn
                ? "SSF's investment return has historically been ~6–8% — adjust it yourself"
                : "SSF को लगानी प्रतिफल ऐतिहासिक रूपमा ~६–८% — आफैँ मिलाउनुहोस्"}
            </span>
          </label>
          <label className={labelCls}>
            {isEn
              ? `Annual ${mode === "salary" ? "salary" : "contribution"} growth`
              : `वार्षिक ${mode === "salary" ? "तलब" : "योगदान"} वृद्धि`}
            : {growthPct}%
            <input
              type="range"
              min={0}
              max={15}
              step={0.5}
              value={growthPct}
              onChange={(e) => setGrowthPct(Number(e.target.value))}
              className="mt-2 w-full accent-primary-600"
            />
          </label>
        </div>
      </div>

      {result && (
        <section className="surface mt-6 p-5 md:p-6">
          {/* headline results */}
          <p className="text-sm text-ink-500">
            {isEn
              ? "Monthly pension at 60 (for life)"
              : "६० वर्षमा मासिक Pension (आजीवन)"}
          </p>
          <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">
            {npr(result.monthlyPensionAt60)}
          </p>
          <p className="mt-1 text-xs text-ink-500">
            {isEn ? "= pension fund ÷ 160" : "= Pension कोष ÷ १६०"}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn
                  ? "Pension fund (20%) at 60"
                  : "Pension कोष (२०%) ६० वर्षमा"}
              </p>
              <p className="font-semibold text-ink-900">
                {npr(result.pensionFundAt60)}
              </p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn
                  ? "Retirement fund (8.33%) — lump sum"
                  : "अवकाश कोष (८.३३%) — एकमुष्ट"}
              </p>
              <p className="font-semibold text-ink-900">
                {npr(result.retirementLumpSumAt60)}
              </p>
            </div>
          </div>

          {/* contributed vs earned */}
          <div className="mt-5 rounded-xl border border-ink-200 bg-white p-4">
            <div className="flex flex-wrap justify-between gap-3 text-sm text-ink-700">
              <p>
                {isEn
                  ? `Total contributed (${result.contributionYears} years):`
                  : `जम्मा योगदान (${result.contributionYears} वर्ष):`}{" "}
                <strong className="text-ink-900">{npr(result.totalContributed)}</strong>
              </p>
              <p>
                {isEn ? "Added from investment returns:" : "लगानी प्रतिफलबाट थपिएको:"}{" "}
                <strong className="text-emerald-700">
                  +{npr(result.totalReturnsEarned)}
                </strong>
              </p>
            </div>

            {/* growth chart */}
            <div className="mt-4 flex h-32 items-end gap-[2px]">
              {result.timeline.map((t) => (
                <div
                  key={t.age}
                  className="group relative flex-1 rounded-t bg-primary-500 transition hover:bg-action-500"
                  style={{
                    height: `${((t.pensionFund + t.retirementFund) / maxFund) * 100}%`,
                  }}
                  title={`${isEn ? "Age" : "उमेर"} ${t.age}: ${npr(t.pensionFund + t.retirementFund)}`}
                />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-xs text-ink-400">
              <span>{isEn ? "Age" : "उमेर"} {age + 1}</span>
              <span>{isEn ? "Age 60" : "उमेर ६०"}</span>
            </div>

            {!result.eligibleForPension && (
              <div className="mt-4">
                <Callout tone="warn">
                  {isEn
                    ? `You'd only reach ${result.contributionMonths} months of contributions by 60 — a lifelong pension needs 180 months. Options: take the lump sum, or choose a monthly pension of that amount ÷ 160.`
                    : `६० वर्षसम्म ${result.contributionMonths} महिना मात्र योगदान पुग्छ — आजीवन pension का लागि १८० महिना चाहिन्छ। विकल्प: एकमुष्ट लिने वा सोही रकम ÷ १६० को मासिक pension रोज्ने।`}
                </Callout>
              </div>
            )}
          </div>

          <div className="mt-4">
            <Callout tone="warn">
              {isEn
                ? "This is a preliminary educational projection — actual returns vary with SSF's investment results, and inflation adjustment is not included here. Final amounts follow SSF's official records. (Basis: Scheme Operation Procedure 2075, sections 19–22 — pension 20% + retirement 8.33%, ÷160 formula)"
                : "यो प्रारम्भिक शैक्षिक projection हो — वास्तविक प्रतिफल SSF को लगानी नतिजाअनुसार फरक पर्छ र मुद्रास्फीति समायोजन यहाँ समावेश छैन। अन्तिम रकम SSF को आधिकारिक अभिलेखअनुसार हुन्छ। (आधार: योजना सञ्चालन कार्यविधि २०७५, दफा १९–२२ — निवृत्तभरण २०% + अवकाश ८.३३%, सूत्र ÷१६०)"}
            </Callout>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link href="/request?service=registration" className="btn-accent btn-lg w-full sm:w-auto">
              <Icon name="users" size={16} />
              {isEn ? "Get help starting SSF" : "SSF सुरु गर्न सहायता लिनुहोस्"}
            </Link>
            <a
              href={waContext(
                isEn ? "SSF pension projection" : "SSF पेन्सन projection",
                [
                  `${isEn ? "Age" : "उमेर"}: ${age}`,
                  mode === "salary" ? `${isEn ? "Salary" : "तलब"}: ${npr(salary)}` : `${isEn ? "Monthly pension contribution" : "मासिक पेन्सन योगदान"}: ${npr(pensionAmt)}`,
                  `${isEn ? "Projected pension at 60" : "६० वर्षमा अनुमानित पेन्सन"}: ${npr(result.monthlyPensionAt60)}/${isEn ? "mo" : "महिना"}`,
                ],
                isEn,
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_click", { cta: "whatsapp", location: "financial_planner" })}
              className="btn-outline"
            >
              <Icon name="phone" size={16} />
              WhatsApp
            </a>
            <Link
              href="/school/pension-ra-retirement/pension-ra-retirement-guide"
              className="btn-ghost"
            >
              <Icon name="book" size={16} />
              {isEn
                ? "Understand the pension rules in detail"
                : "Pension नियम विस्तारमा बुझ्नुहोस्"}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
