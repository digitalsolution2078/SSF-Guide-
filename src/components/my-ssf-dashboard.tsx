"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { effectiveMonths, useSsfProfile, type ProfileProvince, type ProfileRole, type SsfProfile } from "@/lib/profile";
import { calculateFormalContribution } from "@/lib/calculation/engine";
import { FORMAL_RULE_V1, FOREIGN_EMPLOYMENT_RULE_V1, INFORMAL_RULE_V1, MIN_BASIC_REMUNERATION } from "@/lib/calculation/rules";
import { planSSF } from "@/lib/calculation/planner";
import { assessAllLoans } from "@/lib/calculation/loan-eligibility";
import { MILESTONES, dateForMonths, nextMilestone } from "@/lib/milestones";
import { formatNpr } from "@/lib/money";
import { trackEvent, bucketNpr } from "@/lib/analytics";
import { waContext } from "@/lib/whatsapp";
import { PROVINCES, PROVINCE_ORDER, provinceCounts } from "@/content/hospitals";
import { toNe } from "@/content/ssf-stats";
import { AlertsOptIn } from "./alerts-optin";
import { Icon, type IconName } from "./icons";
import { Callout, Stat } from "./ui";

const ROLES: { key: ProfileRole; ne: string; en: string; icon: IconName }[] = [
  { key: "employee", ne: "कर्मचारी (औपचारिक)", en: "Employee (formal)", icon: "user" },
  { key: "foreign", ne: "वैदेशिक रोजगारी", en: "Foreign employment", icon: "plane" },
  { key: "selfEmployed", ne: "स्वरोजगार", en: "Self-employed", icon: "wrench" },
  { key: "informal", ne: "अनौपचारिक", en: "Informal sector", icon: "briefcase" },
  { key: "employer", ne: "रोजगारदाता / HR", en: "Employer / HR", icon: "building" },
];

const labelCls = "block text-sm font-medium text-ink-700";

export function MySsfDashboard() {
  const locale = useLocale();
  const isEn = locale === "en";
  const n = (v: number | string) => (isEn ? String(v) : toNe(String(v)));
  const npr = (v: number) => formatNpr(v, isEn);
  const { profile, ready, update, reset, hasCore } = useSsfProfile();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<SsfProfile>({});

  useEffect(() => {
    if (ready) setDraft({ role: "employee", ...profile });
  }, [ready, profile]);

  const months = effectiveMonths(profile) ?? 0;
  const role = profile.role ?? "employee";
  const salary = profile.basicSalary ?? 0;
  const age = profile.age ?? 0;

  const contribution = useMemo(() => {
    if (!salary) return null;
    try {
      if (role === "employee" || role === "employer") {
        const r = calculateFormalContribution(salary, FORMAL_RULE_V1);
        return { employee: r.employee.total, employer: r.employer.total, total: r.total, pct: 31 };
      }
      if (role === "foreign") {
        const total = Math.round((salary * FOREIGN_EMPLOYMENT_RULE_V1.minPct) / 100);
        return { employee: total, employer: 0, total, pct: FOREIGN_EMPLOYMENT_RULE_V1.minPct };
      }
      if (role === "selfEmployed") {
        const total = Math.round(salary * 0.31);
        return { employee: total, employer: 0, total, pct: 31 };
      }
      const worker = Math.round((MIN_BASIC_REMUNERATION * INFORMAL_RULE_V1.workerPct) / 100);
      const gov = Math.round((MIN_BASIC_REMUNERATION * INFORMAL_RULE_V1.governmentPct) / 100);
      return { employee: worker, employer: gov, total: worker + gov, pct: 20.37 };
    } catch {
      return null;
    }
  }, [salary, role]);

  const pension = useMemo(() => {
    if (!salary || !age || age >= 60 || (role !== "employee" && role !== "employer")) return null;
    try {
      return planSSF({ monthlyBasicSalary: salary, currentAge: age, annualReturnPct: 7, annualSalaryGrowthPct: 5 });
    } catch {
      return null;
    }
  }, [salary, age, role]);

  const loans = useMemo(
    () =>
      hasCore
        ? assessAllLoans({
            basicSalary: salary,
            age,
            monthsContributed: months,
            spouseSalary: profile.spouseSalary,
            retirementBalance: profile.retirementBalance,
          })
        : [],
    [hasCore, salary, age, months, profile.spouseSalary, profile.retirementBalance],
  );
  const eligibleLoans = loans.filter((l) => l.eligible && l.maxAmount > 0);
  const next = nextMilestone(months);
  const counts = provinceCounts();

  const save = () => {
    const clean: SsfProfile = {
      ...draft,
      basicSalary: Number(draft.basicSalary) || undefined,
      age: Number(draft.age) || undefined,
      monthsContributed: Number.isFinite(Number(draft.monthsContributed)) ? Number(draft.monthsContributed) : undefined,
      spouseSalary: Number(draft.spouseSalary) || undefined,
      retirementBalance: Number(draft.retirementBalance) || undefined,
    };
    update(clean);
    setEditing(false);
    trackEvent("profile_saved", { role: clean.role, salary: bucketNpr(clean.basicSalary ?? 0) });
  };

  if (!ready) return <div className="card h-48 animate-pulse bg-ink-50" />;

  const form = (
    <div className="card p-5 md:p-6">
      <p className="eyebrow">{isEn ? "Step 1 of 1" : "एकपटक मात्र"}</p>
      <h2 className="mt-1 text-xl">{isEn ? "Tell us three numbers" : "तीन अङ्क भन्नुहोस्"}</h2>
      <p className="mt-1 text-sm text-ink-500">
        {isEn
          ? "Saved only in this browser — no account, nothing sent to us."
          : "यही browser मा मात्र सेभ हुन्छ — खाता चाहिँदैन, हामीकहाँ केही पठाइँदैन।"}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {ROLES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setDraft((d) => ({ ...d, role: r.key }))}
            className={`chip ${draft.role === r.key ? "chip-active" : ""}`}
          >
            <Icon name={r.icon} size={14} />
            {isEn ? r.en : r.ne}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className={labelCls}>
          {draft.role === "foreign" || draft.role === "selfEmployed"
            ? isEn ? "Monthly contribution base (Rs.)" : "मासिक योगदान आधार (रु.)"
            : isEn ? "Monthly basic salary (Rs.)" : "मासिक आधारभूत तलब (रु.)"}
          <input type="number" min={0} step={500} value={draft.basicSalary ?? ""} onChange={(e) => setDraft((d) => ({ ...d, basicSalary: Number(e.target.value) }))} className="input mt-1" placeholder="30000" />
        </label>
        <label className={labelCls}>
          {isEn ? "Age" : "उमेर"}
          <input type="number" min={16} max={70} value={draft.age ?? ""} onChange={(e) => setDraft((d) => ({ ...d, age: Number(e.target.value) }))} className="input mt-1" placeholder="30" />
        </label>
        <label className={labelCls}>
          {isEn ? "Months contributed so far" : "अहिलेसम्म योगदान गरेको महिना"}
          <input type="number" min={0} max={600} value={draft.monthsContributed ?? ""} onChange={(e) => setDraft((d) => ({ ...d, monthsContributed: Number(e.target.value) }))} className="input mt-1" placeholder="24" />
          <span className="mt-1 block text-xs font-normal text-ink-500">{isEn ? "SOSYS / SSF app → contribution history" : "SOSYS / SSF App → योगदान विवरण"}</span>
        </label>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className={labelCls}>
          {isEn ? "Province" : "प्रदेश"}
          <select value={draft.province ?? ""} onChange={(e) => setDraft((d) => ({ ...d, province: (e.target.value || undefined) as ProfileProvince | undefined }))} className="select mt-1">
            <option value="">{isEn ? "Choose" : "रोज्नुहोस्"}</option>
            {PROVINCE_ORDER.map((p) => (
              <option key={p} value={p}>{isEn ? PROVINCES[p].en : PROVINCES[p].ne}</option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          {isEn ? "Spouse's salary (optional)" : "पति/पत्नीको तलब (ऐच्छिक)"}
          <input type="number" min={0} step={500} value={draft.spouseSalary ?? ""} onChange={(e) => setDraft((d) => ({ ...d, spouseSalary: Number(e.target.value) }))} className="input mt-1" />
        </label>
        <label className={labelCls}>
          {isEn ? "Retirement Amount balance (optional)" : "अवकाश रकम balance (ऐच्छिक)"}
          <input type="number" min={0} step={5000} value={draft.retirementBalance ?? ""} onChange={(e) => setDraft((d) => ({ ...d, retirementBalance: Number(e.target.value) }))} className="input mt-1" />
        </label>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={save} disabled={!draft.basicSalary || !draft.age} className="btn-primary btn-lg">
          <Icon name="sparkles" size={16} />
          {isEn ? "Show my SSF snapshot" : "मेरो SSF snapshot देखाउनुहोस्"}
        </button>
        {hasCore && (
          <button type="button" onClick={() => setEditing(false)} className="btn-ghost">
            {isEn ? "Cancel" : "रद्द"}
          </button>
        )}
      </div>
    </div>
  );

  if (!hasCore || editing) return form;

  const roleMeta = ROLES.find((r) => r.key === role)!;
  const waFacts = [
    `${isEn ? "Role" : "भूमिका"}: ${isEn ? roleMeta.en : roleMeta.ne}`,
    `${isEn ? "Salary" : "तलब"}: ${npr(salary)}`,
    `${isEn ? "Months" : "योगदान"}: ${n(months)} ${isEn ? "months" : "महिना"}`,
    ...(eligibleLoans.length ? [`${isEn ? "Eligible loans" : "योग्य सापटी"}: ${eligibleLoans.map((l) => npr(l.maxAmount)).join(", ")}`] : []),
  ];

  return (
    <div className="space-y-8">
      {/* header strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-600">
          <span className="badge-primary">
            <Icon name={roleMeta.icon} size={12} />
            {isEn ? roleMeta.en : roleMeta.ne}
          </span>
          <span>{npr(salary)}/{isEn ? "mo" : "महिना"}</span>
          <span>· {n(age)} {isEn ? "yrs" : "वर्ष"}</span>
          <span>· {n(months)} {isEn ? "months contributed" : "महिना योगदान"}</span>
          {profile.province && <span>· {isEn ? PROVINCES[profile.province].en : PROVINCES[profile.province].short}</span>}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setEditing(true)} className="btn-outline btn-sm">
            <Icon name="refresh" size={14} />
            {isEn ? "Edit" : "सम्पादन"}
          </button>
          <button type="button" onClick={() => { reset(); setEditing(false); }} className="btn-ghost btn-sm">
            {isEn ? "Clear" : "मेटाउनुहोस्"}
          </button>
        </div>
      </div>

      {/* key numbers */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {contribution && (
          <Stat
            value={npr(contribution.total)}
            label={isEn ? `Monthly contribution (${contribution.pct}%)` : `मासिक योगदान (${n(contribution.pct)}%)`}
            hint={contribution.employer ? (isEn ? `You ${npr(contribution.employee)} + employer ${npr(contribution.employer)}` : `तपाईं ${npr(contribution.employee)} + रोजगारदाता ${npr(contribution.employer)}`) : undefined}
          />
        )}
        {pension && (
          <Stat
            value={npr(pension.monthlyPensionAt60)}
            label={isEn ? "Projected pension / month at 60" : "६० वर्षमा अनुमानित मासिक पेन्सन"}
            hint={isEn ? `Fund ≈ ${formatNpr(pension.pensionFundAt60, true)} · 7% return, 5% growth` : `कोष ≈ ${npr(pension.pensionFundAt60)} · ७% प्रतिफल, ५% वृद्धि`}
            tone="neutral"
          />
        )}
        <Stat
          value={months >= 3 ? (isEn ? "Active" : "सक्रिय") : isEn ? `${3 - months} mo to go` : `${n(3 - months)} महिना बाँकी`}
          label={isEn ? "Medical cover (OPD 20k · IPD 1 lakh)" : "औषधि-उपचार सुविधा (OPD २०k · भर्ना १ लाख)"}
          hint={isEn ? "20% co-pay at affiliated hospitals" : "आबद्ध अस्पतालमा २०% सह-भुक्तानी"}
          tone="health"
        />
        <Stat
          value={eligibleLoans.length ? npr(Math.max(...eligibleLoans.map((l) => l.maxAmount))) : isEn ? "Not yet" : "अहिले होइन"}
          label={isEn ? "Largest loan you qualify for" : "तपाईं योग्य सबैभन्दा ठूलो सापटी"}
          hint={eligibleLoans.length ? (isEn ? `${eligibleLoans.length} loan type(s) open` : `${n(eligibleLoans.length)} प्रकार खुला`) : isEn ? `${Math.max(0, 18 - months)} months to the home loan` : `घर सापटीमा ${n(Math.max(0, 18 - months))} महिना बाँकी`}
        />
      </div>

      {/* milestones */}
      <section className="card p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl">{isEn ? "Your SSF timeline" : "तपाईंको SSF timeline"}</h2>
          {next && (
            <span className="badge-action">
              <Icon name="clock" size={12} />
              {isEn ? `Next: ${next.titleEn} in ${next.months - months} mo` : `अर्को: ${next.titleNe} — ${n(next.months - months)} महिनामा`}
            </span>
          )}
        </div>
        <ol className="mt-5 space-y-3">
          {MILESTONES.map((m) => {
            const done = months >= m.months;
            const when = dateForMonths(months, m.months);
            return (
              <li key={m.key} className={`flex gap-3 rounded-xl border p-3 ${done ? "border-health-200 bg-health-50/60" : "border-ink-200 bg-white"}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? "bg-health-600 text-white" : "bg-ink-100 text-ink-500"}`}>
                  {done ? <Icon name="check" size={16} /> : <span className="font-display text-xs font-bold">{n(m.months)}</span>}
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={m.href} className="font-semibold text-ink-900 hover:text-primary-700">{isEn ? m.titleEn : m.titleNe}</Link>
                  <p className="text-sm text-ink-500">{isEn ? m.descEn : m.descNe}</p>
                  {!done && (
                    <p className="mt-1 text-xs text-ink-400">
                      {isEn ? `≈ ${when.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}` : `≈ ${when.toLocaleDateString("ne-NP", { month: "short", year: "numeric" })}`}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* loans + hospitals */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-lg">{isEn ? "Loans open to you" : "तपाईंलाई खुला सापटी"}</h2>
          {eligibleLoans.length === 0 ? (
            <p className="mt-2 text-sm text-ink-500">
              {isEn ? "None yet — the home loan opens at 18 months, education/special at 36." : "अहिले कुनै छैन — घर सापटी १८ महिनामा, शैक्षिक/विशेष ३६ महिनामा खुल्छ।"}
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {eligibleLoans.map((l) => (
                <li key={l.type} className="flex items-center justify-between rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm">
                  <span className="text-ink-700">
                    {l.type === "home-build" ? (isEn ? "Home (buy/build)" : "घर (खरिद/निर्माण)") : l.type === "home-land" ? (isEn ? "Home (land)" : "घर (जग्गा)") : l.type === "education" ? (isEn ? "Education" : "शैक्षिक") : isEn ? "Special" : "विशेष"}
                  </span>
                  <span className="font-semibold text-primary-700">{npr(l.maxAmount)}</span>
                </li>
              ))}
            </ul>
          )}
          <Link href="/loans#check" className="btn-ghost -ml-2 mt-3">
            {isEn ? "Full loan details" : "पूरा सापटी विवरण"} <Icon name="arrowRight" size={14} />
          </Link>
        </section>
        <section className="card p-5">
          <h2 className="text-lg">{isEn ? "Affiliated hospitals near you" : "तपाईंको नजिकका आबद्ध अस्पताल"}</h2>
          {profile.province ? (
            <p className="mt-2 text-sm text-ink-600">
              {isEn
                ? `${counts[profile.province]} hospitals in ${PROVINCES[profile.province].en} accept SSF.`
                : `${PROVINCES[profile.province].ne}मा ${n(counts[profile.province])} अस्पतालले SSF स्वीकार्छन्।`}
            </p>
          ) : (
            <p className="mt-2 text-sm text-ink-500">{isEn ? "Add your province to see the count." : "प्रदेश थप्नुभयो भने संख्या देखिन्छ।"}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={profile.province ? `/hospitals?province=${profile.province}` : "/hospitals"} className="btn-health btn-sm">
              <Icon name="hospital" size={14} />
              {isEn ? "Open list" : "सूची खोल्नुहोस्"}
            </Link>
            <Link href="/claims" className="btn-outline btn-sm">
              {isEn ? "How to claim" : "दाबी कसरी"}
            </Link>
          </div>
        </section>
      </div>

      {/* alerts + help */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AlertsOptIn defaultTopics={role === "employer" ? ["employer_deadline", "news"] : ["milestones", "news"]} />
        <section className="card p-5">
          <h2 className="text-lg">{isEn ? "Want a human to check this?" : "कसैले जाँचिदिओस् भन्ने लाग्छ?"}</h2>
          <p className="mt-2 text-sm text-ink-500">
            {isEn ? "Send your snapshot to Digital Solution on WhatsApp — we reply within 24 working hours." : "आफ्नो snapshot Digital Solution लाई WhatsApp गर्नुहोस् — २४ कार्य-घण्टाभित्र जवाफ।"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={waContext(isEn ? "my SSF snapshot" : "मेरो SSF snapshot", waFacts, isEn)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("cta_click", { cta: "whatsapp", location: "my_ssf" })}
              className="btn-accent"
            >
              <Icon name="phone" size={16} />
              WhatsApp
            </a>
            <Link href="/request" className="btn-outline" onClick={() => trackEvent("cta_click", { cta: "request", location: "my_ssf" })}>
              {isEn ? "Request assistance" : "सहायता अनुरोध"}
            </Link>
          </div>
        </section>
      </div>

      <Callout tone="warn">
        {isEn
          ? "All figures are preliminary estimates from the Fund's published rules and your own inputs; the Fund's records decide actual entitlements."
          : "सबै आँकडा कोषका प्रकाशित नियम र तपाईंले राखेका अङ्कमा आधारित प्रारम्भिक अनुमान हुन्; वास्तविक सुविधा कोषको अभिलेखअनुसार हुन्छ।"}
      </Callout>
    </div>
  );
}
