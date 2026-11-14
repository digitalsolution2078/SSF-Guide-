"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { assessAllLoans, type LoanCap, type LoanLimit, type LoanType } from "@/lib/calculation/loan-eligibility";
import { formatNpr } from "@/lib/money";
import { effectiveMonths, useSsfProfile } from "@/lib/profile";
import { trackEvent, bucketNpr } from "@/lib/analytics";
import { waContext } from "@/lib/whatsapp";
import { Callout } from "./ui";
import { Icon, type IconName } from "./icons";

const labelCls = "block text-sm font-medium text-ink-700";

const TYPE_META: Record<LoanType, { ne: string; en: string; icon: IconName; href: string }> = {
  "home-build": { ne: "घर सापटी — घर खरिद/निर्माण", en: "Home loan — buy / build", icon: "home", href: "#home" },
  "home-land": { ne: "घर सापटी — जग्गा खरिद", en: "Home loan — land purchase", icon: "mapPin", href: "#home" },
  education: { ne: "शैक्षिक सापटी", en: "Education loan", icon: "grad", href: "#education" },
  special: { ne: "विशेष सापटी (धितो नचाहिने)", en: "Special loan (no collateral)", icon: "sparkles", href: "#special" },
};

const CAP_LABEL: Record<LoanCap, { ne: string; en: string }> = {
  ceiling: { ne: "कोषको अधिकतम सीमा", en: "Fund's ceiling" },
  salary15: { ne: "१५ वर्षको तलब", en: "15 years' salary" },
  salaryTo60: { ne: "६० वर्षसम्मको तलब", en: "Salary until age 60" },
  emi: { ne: "किस्ता ≤ आम्दानीको ६०%", en: "EMI ≤ 60% of income" },
  balance: { ne: "अवकाश रकमको ८०%", en: "80% of retirement balance" },
  cost: { ne: "वास्तविक शैक्षिक खर्च", en: "Actual course cost" },
  none: { ne: "", en: "" },
};

export function LoanEligibilityCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [salary, setSalary] = useState(40_000);
  const [age, setAge] = useState(32);
  const [months, setMonths] = useState(30);
  const [spouse, setSpouse] = useState(0);
  const [balance, setBalance] = useState(150_000);
  const [showMore, setShowMore] = useState(false);
  const [savedToProfile, setSavedToProfile] = useState(false);

  // Pre-fill from My SSF once hydrated; let the user push edits back.
  const { profile, ready, update } = useSsfProfile();
  useEffect(() => {
    if (!ready) return;
    if (profile.basicSalary) setSalary(profile.basicSalary);
    if (profile.age) setAge(profile.age);
    const m = effectiveMonths(profile);
    if (m !== undefined) setMonths(m);
    if (profile.spouseSalary) setSpouse(profile.spouseSalary);
    if (profile.retirementBalance) setBalance(profile.retirementBalance);
  }, [ready, profile]);

  const results = useMemo(
    () =>
      assessAllLoans({
        basicSalary: salary,
        age,
        monthsContributed: months,
        spouseSalary: spouse,
        retirementBalance: balance,
      }),
    [salary, age, months, spouse, balance],
  );

  useEffect(() => {
    setSavedToProfile(false);
    const t = setTimeout(
      () =>
        trackEvent("calculator_result", {
          tool: "loan_eligibility",
          salary: bucketNpr(salary),
          months,
          eligible: results.filter((r) => r.eligible).length,
        }),
      900,
    );
    return () => clearTimeout(t);
  }, [results, salary, months]);

  const reasonText = (l: LoanLimit) =>
    l.reasons
      .map((r) =>
        r === "months"
          ? isEn
            ? `${l.monthsShort} more month${l.monthsShort === 1 ? "" : "s"} of contribution needed`
            : `अझै ${l.monthsShort} महिना योगदान चाहिन्छ`
          : r === "retirement"
            ? isEn
              ? "Needs at least 2 years of service left before 60"
              : "६० वर्ष पुग्न कम्तीमा २ वर्ष बाँकी हुनुपर्छ"
            : isEn
              ? "Enter your Retirement Amount balance"
              : "अवकाश रकम (Retirement Amount) को balance राख्नुहोस्",
      )
      .join(" · ");

  return (
    <div>
      <div className="card p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <label className={labelCls}>
            {isEn ? "Monthly basic salary (Rs.)" : "मासिक आधारभूत तलब (रु.)"}
            <input type="number" min={0} step={1000} value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="input mt-1" />
          </label>
          <label className={labelCls}>
            {isEn ? "Your age" : "तपाईंको उमेर"}
            <input type="number" min={18} max={65} value={age} onChange={(e) => setAge(Number(e.target.value))} className="input mt-1" />
          </label>
          <label className={labelCls}>
            {isEn ? "Months contributed" : "योगदान गरेको महिना"}
            <input type="number" min={0} max={600} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="input mt-1" />
          </label>
        </div>

        <button type="button" onClick={() => setShowMore((s) => !s)} className="btn-ghost btn-sm -ml-2 mt-3">
          <Icon name={showMore ? "chevronDown" : "chevronRight"} size={14} />
          {isEn ? "Spouse income & retirement balance (optional)" : "दम्पतीको तलब र अवकाश रकम (ऐच्छिक)"}
        </button>
        {showMore && (
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className={labelCls}>
              {isEn ? "Spouse's monthly salary (Rs.)" : "पति/पत्नीको मासिक तलब (रु.)"}
              <input type="number" min={0} step={1000} value={spouse} onChange={(e) => setSpouse(Number(e.target.value))} className="input mt-1" />
              <span className="mt-1 block text-xs text-ink-500">
                {isEn ? "Counts toward the 60% EMI cap on the home loan." : "घर सापटीको ६०% किस्ता सीमामा जोडिन्छ।"}
              </span>
            </label>
            <label className={labelCls}>
              {isEn ? "Retirement Amount balance (Rs.)" : "अवकाश रकम (Retirement Amount) balance (रु.)"}
              <input type="number" min={0} step={5000} value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="input mt-1" />
              <span className="mt-1 block text-xs text-ink-500">
                {isEn ? "See it in the SSF app / SOSYS — roughly 8.33% of basic salary per month plus returns." : "SSF App / SOSYS मा हेर्नुहोस् — मासिक आधारभूत तलबको ~८.३३% + प्रतिफल।"}
              </span>
            </label>
          </div>
        )}
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {results.map((l) => {
          const meta = TYPE_META[l.type];
          return (
            <li key={l.type} className={`card p-5 ${l.eligible ? "" : "bg-ink-50"}`}>
              <div className="flex items-start gap-3">
                <span className={`icon-tile ${l.eligible ? "" : "bg-ink-100 text-ink-400"}`}>
                  <Icon name={meta.icon} size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink-900">{isEn ? meta.en : meta.ne}</p>
                    <span className={l.eligible ? "badge-health" : "badge-neutral"}>
                      <Icon name={l.eligible ? "check" : "clock"} size={12} />
                      {l.eligible ? (isEn ? "Eligible" : "योग्य") : isEn ? "Not yet" : "अहिले होइन"}
                    </span>
                  </div>
                  {l.eligible ? (
                    <>
                      <p className="mt-2 font-display text-2xl font-bold text-primary-700 md:text-3xl">
                        {isEn ? "up to " : "सम्म "}
                        {npr(l.maxAmount)}
                      </p>
                      <p className="mt-1 text-xs text-ink-500">
                        {isEn ? "Binding limit: " : "सीमा तोक्ने: "}
                        {isEn ? CAP_LABEL[l.cappedBy].en : CAP_LABEL[l.cappedBy].ne}
                      </p>
                      {l.ratePct !== null && l.maxAmount > 0 && (
                        <p className="mt-2 text-sm text-ink-700">
                          {isEn ? "≈ EMI " : "≈ किस्ता "}
                          <strong className="text-ink-900">{npr(l.emi)}</strong>
                          {isEn ? `/mo for ${l.termYears} yrs @ ${l.ratePct}%` : `/महिना, ${l.termYears} वर्ष @ ${l.ratePct}%`}
                          {l.type === "education" && (
                            <span className="text-ink-400"> ({isEn ? "rate assumed" : "ब्याजदर अनुमानित"})</span>
                          )}
                        </p>
                      )}
                      {l.ratePct === null && (
                        <p className="mt-2 text-sm text-ink-600">
                          {isEn ? "Rate set by the Fund — interest due each Asar." : "ब्याजदर कोषले तोक्छ — ब्याज हरेक असारमा।"}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-ink-600">{reasonText(l)}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4">
        <Callout tone="warn">
          {isEn
            ? "Preliminary estimate from the Fund's published rules. The actual limit also depends on collateral valuation, repayment-capacity review and blacklist status; education- and special-loan rates are not published."
            : "कोषका प्रकाशित नियमअनुसारको प्रारम्भिक अनुमान। वास्तविक सीमा धितो मूल्याङ्कन, ऋण तिर्न सक्ने क्षमता र कालो सूचीको अवस्थामा पनि भर पर्छ; शैक्षिक र विशेष सापटीको ब्याजदर प्रकाशित छैन।"}
        </Callout>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={waContext(
            isEn ? "SSF loan" : "SSF सापटी",
            [
              `${isEn ? "Salary" : "तलब"}: ${npr(salary)} · ${isEn ? "age" : "उमेर"} ${age} · ${months} ${isEn ? "months" : "महिना"}`,
              ...results.filter((r) => r.eligible).map((r) => `${isEn ? TYPE_META[r.type].en : TYPE_META[r.type].ne}: ${npr(r.maxAmount)}`),
            ],
            isEn,
          )}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("cta_click", { cta: "whatsapp", location: "loan_eligibility" })}
          className="btn-accent"
        >
          <Icon name="phone" size={16} />
          {isEn ? "Ask on WhatsApp with these numbers" : "यी अङ्कसहित WhatsApp मा सोध्नुहोस्"}
        </a>
        <Link href="/calculators/loan" className="btn-outline">
          <Icon name="calculator" size={16} />
          {isEn ? "Full EMI calculator" : "पूरा EMI क्याल्कुलेटर"}
        </Link>
        <button
          type="button"
          onClick={() => {
            update({ basicSalary: salary, age, monthsContributed: months, spouseSalary: spouse || undefined, retirementBalance: balance || undefined });
            setSavedToProfile(true);
          }}
          className="btn-ghost"
        >
          <Icon name={savedToProfile ? "check" : "user"} size={16} />
          {savedToProfile ? (isEn ? "Saved to My SSF" : "My SSF मा सेभ भयो") : isEn ? "Save to My SSF" : "My SSF मा सेभ"}
        </button>
      </div>
    </div>
  );
}
