"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  planSSF,
  planSSFByContribution,
  type PlannerResult,
} from "@/lib/calculation/planner";
import { Link } from "@/i18n/navigation";

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

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

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

  return (
    <div className="space-y-6">
      {/* inputs */}
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        {/* mode toggle — sectors contribute different %, so amount-mode works for everyone */}
        <div className="mb-5 flex rounded-xl bg-gray-100 p-1 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setMode("salary")}
            className={`flex-1 rounded-lg py-2 transition ${mode === "salary" ? "bg-primary-600 text-white shadow" : "text-gray-600"}`}
          >
            {isEn ? "By salary (formal sector)" : "तलबबाट (औपचारिक क्षेत्र)"}
          </button>
          <button
            type="button"
            onClick={() => setMode("amount")}
            className={`flex-1 rounded-lg py-2 transition ${mode === "amount" ? "bg-primary-600 text-white shadow" : "text-gray-600"}`}
          >
            {isEn ? "By contribution amount (all sectors)" : "योगदान रकमबाट (सबै क्षेत्र)"}
          </button>
        </div>
        {mode === "amount" && (
          <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
            {isEn
              ? "Self-employed, foreign employment, and informal-sector contribution percentages differ — enter the actual amount deposited into your account each month (visible in SOSYS). If nothing goes to the retirement fund, enter 0."
              : "स्वरोजगार, वैदेशिक रोजगारी वा अनौपचारिक क्षेत्रमा योगदान % फरक हुन्छ — आफ्नो खातामा महिनैपिच्छे जम्मा हुने वास्तविक रकम राख्नुहोस् (SOSYS मा देखिन्छ)। अवकाश कोषमा नजाने भए ० राख्नुहोस्।"}
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mode === "salary" ? (
            <label className="block text-sm font-semibold text-gray-800">
              {isEn ? "Monthly basic salary (Rs.)" : "मासिक आधारभूत तलब (रु.)"}
              <input
                type="number"
                min={1000}
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className={inputCls}
              />
            </label>
          ) : (
            <>
              <label className="block text-sm font-semibold text-gray-800">
                {isEn
                  ? "Monthly deposit to pension fund (Rs.)"
                  : "Pension कोषमा मासिक जम्मा (रु.)"}
                <input
                  type="number"
                  min={1}
                  value={pensionAmt}
                  onChange={(e) => setPensionAmt(Number(e.target.value))}
                  className={inputCls}
                />
              </label>
              <label className="block text-sm font-semibold text-gray-800">
                {isEn
                  ? "Monthly deposit to retirement fund (Rs.) — 0 if none"
                  : "अवकाश कोषमा मासिक जम्मा (रु.) — नभए ०"}
                <input
                  type="number"
                  min={0}
                  value={retireAmt}
                  onChange={(e) => setRetireAmt(Number(e.target.value))}
                  className={inputCls}
                />
              </label>
            </>
          )}
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Current age" : "हालको उमेर"}
            <input
              type="number"
              min={16}
              max={59}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
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
            <span className="text-xs font-normal text-gray-500">
              {isEn
                ? "SSF's investment return has historically been ~6–8% — adjust it yourself"
                : "SSF को लगानी प्रतिफल ऐतिहासिक रूपमा ~६–८% — आफैँ मिलाउनुहोस्"}
            </span>
          </label>
          <label className="block text-sm font-semibold text-gray-800">
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
              className="mt-2 w-full accent-action-500"
            />
          </label>
        </div>
      </div>

      {result && (
        <>
          {/* headline results */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
              <p className="text-xs text-primary-100">
                {isEn
                  ? "Monthly pension at 60 (for life)"
                  : "६० वर्षमा मासिक Pension (आजीवन)"}
              </p>
              <p className="mt-1 text-2xl font-bold">
                {npr(result.monthlyPensionAt60)}
              </p>
              <p className="mt-1 text-xs text-primary-200">
                {isEn ? "= pension fund ÷ 160" : "= Pension कोष ÷ १६०"}
              </p>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-500">
                {isEn
                  ? "Pension fund (20%) at 60"
                  : "Pension कोष (२०%) ६० वर्षमा"}
              </p>
              <p className="mt-1 text-2xl font-bold text-primary-800">
                {npr(result.pensionFundAt60)}
              </p>
            </div>
            <div className="rounded-2xl border border-action-500/30 bg-action-50 p-5 shadow-sm">
              <p className="text-xs text-gray-600">
                {isEn
                  ? "Retirement fund (8.33%) — lump sum"
                  : "अवकाश कोष (८.३३%) — एकमुष्ट"}
              </p>
              <p className="mt-1 text-2xl font-bold text-action-700">
                {npr(result.retirementLumpSumAt60)}
              </p>
            </div>
          </div>

          {/* contributed vs earned */}
          <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap justify-between gap-3 text-sm">
              <p>
                {isEn
                  ? `Total contributed (${result.contributionYears} years):`
                  : `जम्मा योगदान (${result.contributionYears} वर्ष):`}{" "}
                <strong>{npr(result.totalContributed)}</strong>
              </p>
              <p>
                {isEn ? "Added from investment returns:" : "लगानी प्रतिफलबाट थपिएको:"}{" "}
                <strong className="text-green-700">
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
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>{isEn ? "Age" : "उमेर"} {age + 1}</span>
              <span>{isEn ? "Age 60" : "उमेर ६०"}</span>
            </div>

            {!result.eligibleForPension && (
              <p className="mt-4 rounded-lg border-l-4 border-action-500 bg-action-50 px-4 py-3 text-sm text-gray-800">
                ⚠️{" "}
                {isEn
                  ? `You'd only reach ${result.contributionMonths} months of contributions by 60 — a lifelong pension needs 180 months. Options: take the lump sum, or choose a monthly pension of that amount ÷ 160.`
                  : `६० वर्षसम्म ${result.contributionMonths} महिना मात्र योगदान पुग्छ — आजीवन pension का लागि १८० महिना चाहिन्छ। विकल्प: एकमुष्ट लिने वा सोही रकम ÷ १६० को मासिक pension रोज्ने।`}
              </p>
            )}
          </div>

          <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
            ⚠️{" "}
            {isEn
              ? "This is a preliminary educational projection — actual returns vary with SSF's investment results, and inflation adjustment is not included here. Final amounts follow SSF's official records. (Basis: Scheme Operation Procedure 2075, sections 19–22 — pension 20% + retirement 8.33%, ÷160 formula)"
              : "यो प्रारम्भिक शैक्षिक projection हो — वास्तविक प्रतिफल SSF को लगानी नतिजाअनुसार फरक पर्छ र मुद्रास्फीति समायोजन यहाँ समावेश छैन। अन्तिम रकम SSF को आधिकारिक अभिलेखअनुसार हुन्छ। (आधार: योजना सञ्चालन कार्यविधि २०७५, दफा १९–२२ — निवृत्तभरण २०% + अवकाश ८.३३%, सूत्र ÷१६०)"}
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/school/pension-ra-retirement/pension-ra-retirement-guide"
              className="rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
            >
              📖{" "}
              {isEn
                ? "Understand the pension rules in detail"
                : "Pension नियम विस्तारमा बुझ्नुहोस्"}
            </Link>
            <Link
              href="/request?service=registration"
              className="rounded-xl bg-action-500 p-4 text-center text-sm font-semibold text-white hover:bg-action-600"
            >
              🤝{" "}
              {isEn ? "Get help starting SSF" : "SSF सुरु गर्न सहायता लिनुहोस्"}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
