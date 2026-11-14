"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { monthlyEmi, HOME_BUILD_RATE, HOME_LAND_RATE, HOME_LOAN_MAX_TERM } from "@/lib/calculation/loan-eligibility";
import { formatNpr } from "@/lib/money";
import { toNe } from "@/content/ssf-stats";
import { trackEvent, bucketNpr } from "@/lib/analytics";
import { waContext } from "@/lib/whatsapp";
import { Callout } from "./ui";
import { Icon } from "./icons";

const labelCls = "block text-sm font-medium text-ink-700";

const SSF_PRESETS = [
  { key: "home", rate: HOME_BUILD_RATE, ne: "घर खरिद / निर्माण", en: "Buy / build a house" },
  { key: "land", rate: HOME_LAND_RATE, ne: "जग्गा खरिद", en: "Land purchase" },
];

const BANK_MIN = 7;
const BANK_MAX = 14;

/**
 * "Bank or SSF?" — compares the Fund's published home-loan rate with the rate
 * the user's own bank quoted them. We deliberately do not publish bank rates.
 */
export function LoanSavingsComparison() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => (isEn ? formatNpr(n, true) : toNe(formatNpr(n, false)));
  const nd = (s: string | number) => (isEn ? String(s) : toNe(String(s)));

  const [amount, setAmount] = useState(5_000_000);
  const [years, setYears] = useState(HOME_LOAN_MAX_TERM);
  const [ssfRate, setSsfRate] = useState(HOME_BUILD_RATE);
  const [bankRate, setBankRate] = useState(9.5);

  const result = useMemo(() => {
    const a = Math.max(0, amount || 0);
    const y = Math.min(30, Math.max(1, years || 1));
    const months = y * 12;
    const ssfEmi = monthlyEmi(a, ssfRate, y);
    const bankEmi = monthlyEmi(a, bankRate, y);
    const ssfInterest = ssfEmi * months - a;
    const bankInterest = bankEmi * months - a;
    return {
      years: y,
      ssfEmi,
      bankEmi,
      ssfInterest,
      bankInterest,
      saving: bankInterest - ssfInterest,
      monthlySaving: bankEmi - ssfEmi,
      ssfTotal: ssfEmi * months,
      bankTotal: bankEmi * months,
    };
  }, [amount, years, ssfRate, bankRate]);

  const maxTotal = Math.max(result.ssfTotal, result.bankTotal, 1);
  const ssfPct = (result.ssfTotal / maxTotal) * 100;
  const bankPct = (result.bankTotal / maxTotal) * 100;
  const ssfInterestPct = (result.ssfInterest / maxTotal) * 100;
  const bankInterestPct = (result.bankInterest / maxTotal) * 100;

  const track = () =>
    trackEvent("calculator_result", {
      tool: "loan_compare",
      amount: bucketNpr(amount),
      years: result.years,
      ssfRate,
      bankRate,
      saving: bucketNpr(result.saving),
    });

  const yearsLabel = isEn ? `${result.years} years` : `${toNe(String(result.years))} वर्ष`;
  const waHref = waContext(
    isEn ? "home loan comparison (SSF vs bank)" : "घर सापटी तुलना",
    isEn
      ? [
          `Loan: ${formatNpr(amount, true)} over ${result.years} years`,
          `SSF ${ssfRate}% → EMI ${formatNpr(result.ssfEmi, true)}`,
          `My bank ${bankRate}% → EMI ${formatNpr(result.bankEmi, true)}`,
          `Saving with SSF: ${formatNpr(result.saving, true)} in ${result.years} years`,
        ]
      : [
          `सापटी: ${toNe(formatNpr(amount, false))}, ${toNe(String(result.years))} वर्ष`,
          `SSF ${toNe(String(ssfRate))}% → EMI ${toNe(formatNpr(result.ssfEmi, false))}`,
          `मेरो बैंक ${toNe(String(bankRate))}% → EMI ${toNe(formatNpr(result.bankEmi, false))}`,
          `SSF बाट बचत: ${toNe(String(result.years))} वर्षमा ${toNe(formatNpr(result.saving, false))}`,
        ],
    isEn,
  );

  const savingPositive = result.saving > 0;

  return (
    <div>
      <div className="card p-5 md:p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Amount + term */}
          <div className="space-y-4">
            <label className={labelCls}>
              {isEn ? "Loan amount (Rs.)" : "सापटी रकम (रु.)"}
              <input
                type="number"
                min={100_000}
                step={100_000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                onBlur={track}
                className="input mt-1.5"
              />
              <span className="mt-1 block text-xs text-ink-400">= {npr(amount)}</span>
            </label>
            <label className={labelCls}>
              {isEn ? "Term" : "अवधि"}: {yearsLabel}
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                onBlur={track}
                onPointerUp={track}
                className="mt-2 w-full accent-primary-600"
              />
            </label>
          </div>

          {/* Rates */}
          <div className="space-y-4">
            <div>
              <p className={labelCls}>
                {isEn ? "SSF rate (Fund's published)" : "SSF ब्याजदर (कोषले प्रकाशित)"}: {nd(ssfRate)}%
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {SSF_PRESETS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      setSsfRate(p.rate);
                      track();
                    }}
                    className={`chip ${ssfRate === p.rate ? "chip-active" : ""}`}
                  >
                    {nd(p.rate)}% · {isEn ? p.en : p.ne}
                  </button>
                ))}
              </div>
            </div>
            <label className={labelCls}>
              {isEn ? "Your bank's quoted rate" : "तपाईंको बैंकले भनेको दर"}: <span className="text-action-700">{nd(bankRate)}%</span>
              <input
                type="range"
                min={BANK_MIN}
                max={BANK_MAX}
                step={0.25}
                value={bankRate}
                onChange={(e) => setBankRate(Number(e.target.value))}
                onBlur={track}
                onPointerUp={track}
                className="mt-2 w-full accent-action-500"
              />
              <span className="mt-1 block text-xs leading-relaxed text-ink-400">
                {isEn
                  ? "Enter the rate your own bank quoted you — we do not publish bank rates. Bank home-loan rates change quarterly and vary by bank and borrower."
                  : "तपाईंको बैंकले भनेको दर — हामी बैंकका दर प्रकाशित गर्दैनौँ। बैंकको घर कर्जा दर त्रैमासिक रूपमा फेरिन्छ र बैंक/ग्राहक अनुसार फरक हुन्छ।"}
              </span>
            </label>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button type="button" onClick={track} className="btn-primary">
            <Icon name="calculator" size={16} />
            {isEn ? "Compare" : "तुलना गर्नुहोस्"}
          </button>
        </div>
      </div>

      {/* Result */}
      <section className="surface mt-6 p-5 md:p-6" aria-live="polite">
        <p className="text-sm text-ink-500">
          {isEn ? `Saving with SSF over ${yearsLabel}` : `${yearsLabel}मा बचत`}
        </p>
        <p className={`font-display text-3xl font-bold tracking-tight md:text-4xl ${savingPositive ? "text-health-700" : "text-ink-900"}`}>
          {savingPositive ? npr(result.saving) : npr(Math.abs(result.saving))}
          {!savingPositive && result.saving !== 0 && (
            <span className="ml-2 text-base font-medium text-ink-500">{isEn ? "more with SSF" : "SSF मा बढी"}</span>
          )}
        </p>
        <p className="mt-1 text-sm text-ink-600">
          {isEn
            ? `${npr(Math.abs(result.monthlySaving))} ${savingPositive ? "less" : "more"} every month at ${ssfRate}% instead of ${bankRate}%.`
            : `${nd(bankRate)}% को सट्टा ${nd(ssfRate)}% मा हरेक महिना ${npr(Math.abs(result.monthlySaving))} ${savingPositive ? "कम" : "बढी"}।`}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-health-200 bg-white p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-health-700">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-health-600" />
              SSF · {nd(ssfRate)}%
            </p>
            <p className="mt-1 text-xs text-ink-500">{isEn ? "Monthly EMI" : "मासिक किस्ता"}</p>
            <p className="font-display text-xl font-bold text-ink-900">{npr(result.ssfEmi)}</p>
            <p className="mt-2 text-xs text-ink-500">{isEn ? "Total interest" : "कुल ब्याज"}</p>
            <p className="font-semibold text-ink-900">{npr(result.ssfInterest)}</p>
          </div>
          <div className="rounded-xl border border-ink-200 bg-white p-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-action-700">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-action-500" />
              {isEn ? "Your bank" : "तपाईंको बैंक"} · {nd(bankRate)}%
            </p>
            <p className="mt-1 text-xs text-ink-500">{isEn ? "Monthly EMI" : "मासिक किस्ता"}</p>
            <p className="font-display text-xl font-bold text-ink-900">{npr(result.bankEmi)}</p>
            <p className="mt-2 text-xs text-ink-500">{isEn ? "Total interest" : "कुल ब्याज"}</p>
            <p className="font-semibold text-ink-900">{npr(result.bankInterest)}</p>
          </div>
        </div>

        {/* Two-bar comparison: principal + interest, same scale */}
        <div className="mt-5 rounded-xl border border-ink-200 bg-white p-4">
          <p className="text-sm font-medium text-ink-700">
            {isEn ? `Total repaid over ${yearsLabel}` : `${yearsLabel}मा कुल भुक्तानी`}
          </p>
          <div className="mt-3 space-y-3">
            {[
              { label: "SSF", total: result.ssfTotal, pct: ssfPct, interestPct: ssfInterestPct, bar: "bg-health-600", light: "bg-health-200" },
              { label: isEn ? "Bank" : "बैंक", total: result.bankTotal, pct: bankPct, interestPct: bankInterestPct, bar: "bg-action-500", light: "bg-action-50" },
            ].map((b) => (
              <div key={b.label} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 text-xs">
                <span className="font-semibold text-ink-700">{b.label}</span>
                <div className="h-5 w-full overflow-hidden rounded-full bg-ink-100">
                  <div className="flex h-full" style={{ width: `${b.pct}%` }}>
                    <div className={`${b.light} h-full`} style={{ width: `${((b.pct - b.interestPct) / b.pct) * 100}%` }} />
                    <div className={`${b.bar} h-full flex-1`} />
                  </div>
                </div>
                <span className="whitespace-nowrap font-semibold text-ink-900">{npr(b.total)}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-500">
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded bg-ink-200" />
              {isEn ? "Principal" : "साँवा"} ({npr(amount)})
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded bg-health-600" />
              <span className="inline-block h-3 w-3 rounded bg-action-500" />
              {isEn ? "Interest" : "ब्याज"}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <Callout tone="warn" title={isEn ? "SSF limits still apply" : "SSF का सीमा लागू हुन्छन्"}>
            {isEn
              ? "The Fund lends at most Rs 1.5 crore, 15 years' basic salary, or what keeps your EMI under 60% of household income — whichever is lowest — and needs collateral plus 18 months of contribution. Both SSF and bank rates can change; this is an estimate on fixed rates, not an offer."
              : "कोषले बढीमा रु. १.५ करोड, १५ वर्षको आधारभूत तलब, वा घरायसी आयको ६०% भित्र किस्ता रहने रकम — जुन कम — मात्र दिन्छ; धितो र १८ महिनाको योगदान चाहिन्छ। SSF र बैंक दुवैको दर फेरिन सक्छ — यो स्थिर दरमा अनुमान हो, offer होइन।"}
          </Callout>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/loans#check" className="btn-primary" onClick={() => trackEvent("cta_click", { cta: "loan_check", location: "loan_compare" })}>
            <Icon name="checkCircle" size={16} />
            {isEn ? "Check how much SSF will lend me" : "SSF ले मलाई कति दिन्छ? जाँच्नुहोस्"}
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            onClick={() => trackEvent("cta_click", { cta: "whatsapp", location: "loan_compare" })}
          >
            <Icon name="chat" size={16} />
            {isEn ? "Ask on WhatsApp" : "WhatsApp मा सोध्नुहोस्"}
          </a>
        </div>
      </section>
    </div>
  );
}
