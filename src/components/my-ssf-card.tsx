"use client";

import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { effectiveMonths, useSsfProfile } from "@/lib/profile";
import { nextMilestone } from "@/lib/milestones";
import { assessAllLoans } from "@/lib/calculation/loan-eligibility";
import { formatNpr } from "@/lib/money";
import { toNe } from "@/content/ssf-stats";
import { Icon } from "./icons";

/** Home-page "My SSF" strip: a mini snapshot when a profile exists, otherwise a 1-line invite. */
export function MySsfCard() {
  const locale = useLocale();
  const isEn = locale === "en";
  const n = (v: number | string) => (isEn ? String(v) : toNe(String(v)));
  const { profile, ready, hasCore } = useSsfProfile();

  if (!ready) return null;

  if (!hasCore) {
    return (
      <Link
        href="/my-ssf"
        className="group mt-6 flex items-center gap-3 rounded-2xl border border-dashed border-primary-300 bg-white/70 px-4 py-3 text-sm transition hover:border-primary-500 hover:bg-white"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <Icon name="user" size={18} />
        </span>
        <span className="flex-1 text-ink-700">
          <strong className="text-ink-900">My SSF:</strong>{" "}
          {isEn
            ? "enter salary, age and months once — every tool here fills itself in."
            : "तलब, उमेर र महिना एकपटक राख्नुहोस् — यहाँका सबै उपकरण आफैँ भरिन्छन्।"}
        </span>
        <Icon name="arrowRight" size={16} className="text-primary-600 transition group-hover:translate-x-0.5" />
      </Link>
    );
  }

  const months = effectiveMonths(profile) ?? 0;
  const next = nextMilestone(months);
  const loans = assessAllLoans({
    basicSalary: profile.basicSalary!,
    age: profile.age!,
    monthsContributed: months,
    spouseSalary: profile.spouseSalary,
    retirementBalance: profile.retirementBalance,
  }).filter((l) => l.eligible && l.maxAmount > 0);
  const best = loans.length ? Math.max(...loans.map((l) => l.maxAmount)) : 0;

  return (
    <Link href="/my-ssf" className="group mt-6 block rounded-2xl border border-primary-200 bg-white/80 p-4 transition hover:border-primary-400 hover:bg-white">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="flex items-center gap-2 font-semibold text-ink-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700">
            <Icon name="user" size={16} />
          </span>
          My SSF
        </span>
        <span className="text-ink-600">
          <strong className="text-ink-900">{n(months)}</strong> {isEn ? "months" : "महिना"}
        </span>
        <span className="text-ink-600">
          {isEn ? "Medical cover: " : "उपचार सुविधा: "}
          <strong className={months >= 3 ? "text-health-700" : "text-amber-700"}>{months >= 3 ? (isEn ? "active" : "सक्रिय") : isEn ? `${3 - months} mo` : `${n(3 - months)} महिना`}</strong>
        </span>
        <span className="text-ink-600">
          {isEn ? "Loan: " : "सापटी: "}
          <strong className="text-primary-700">{best ? formatNpr(best, isEn) : isEn ? "not yet" : "अहिले होइन"}</strong>
        </span>
        {next && (
          <span className="text-ink-600">
            {isEn ? "Next: " : "अर्को: "}
            <strong className="text-ink-900">{isEn ? next.titleEn : next.titleNe}</strong> · {n(next.months - months)} {isEn ? "mo" : "महिना"}
          </span>
        )}
        <span className="ml-auto flex items-center gap-1 font-semibold text-primary-700">
          {isEn ? "Open" : "खोल्नुहोस्"} <Icon name="arrowRight" size={14} className="transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
