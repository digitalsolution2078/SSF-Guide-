"use client";

import { useActionState, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  calculateContributionAction,
  type ContributionActionState,
} from "@/app/actions/calculate-contribution";
import { Link } from "@/i18n/navigation";
import { Callout } from "./ui";
import { Icon } from "./icons";

const initialState: ContributionActionState = { status: "idle" };

const SECTORS = [
  { value: "FORMAL", label: "औपचारिक क्षेत्र (जागिर)", labelEn: "Formal sector (job)", input: "मासिक आधारभूत पारिश्रमिक (रु.)", inputEn: "Monthly basic salary (Rs.)" },
  { value: "SELF_EMPLOYED", label: "स्वरोजगार", labelEn: "Self-employed", input: "रोजेको आधार रकम (रु./महिना)", inputEn: "Chosen base amount (Rs./month)" },
  { value: "FOREIGN", label: "वैदेशिक रोजगारी", labelEn: "Foreign employment", input: "योगदान आधार रकम (रु./महिना)", inputEn: "Contribution base amount (Rs./month)" },
  { value: "INFORMAL", label: "अनौपचारिक क्षेत्र", labelEn: "Informal sector", input: "", inputEn: "" },
] as const;

export function ContributionCalculator() {
  const t = useTranslations("calculator");
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number): string =>
    `${isEn ? "Rs." : "रु."} ${n.toLocaleString("en-IN")}`;
  const [sector, setSector] = useState<(typeof SECTORS)[number]["value"]>("FORMAL");
  const [state, formAction, pending] = useActionState(
    calculateContributionAction,
    initialState,
  );
  const sectorInfo = SECTORS.find((s) => s.value === sector)!;

  return (
    <div>
      <form action={formAction} className="card p-5 md:p-6">
        <input type="hidden" name="locale" value={locale} />
        <label htmlFor="sector" className="mb-1 block text-sm font-medium text-ink-700">
          {isEn
            ? "Your sector — the contribution % differs by sector"
            : "तपाईंको क्षेत्र (sector) — योगदान % क्षेत्रअनुसार फरक हुन्छ"}
        </label>
        <select
          id="sector"
          name="sector"
          value={sector}
          onChange={(e) => setSector(e.target.value as typeof sector)}
          className="select"
        >
          {SECTORS.map((s) => (
            <option key={s.value} value={s.value}>
              {isEn ? s.labelEn : s.label}
            </option>
          ))}
        </select>
        <div className={`mt-4 ${sector === "INFORMAL" ? "hidden" : ""}`}>
          <label htmlFor="basicSalary" className="mb-1 block text-sm font-medium text-ink-700">
            {sector === "FORMAL"
              ? t("basicSalary")
              : isEn
                ? sectorInfo.inputEn
                : sectorInfo.input}
          </label>
          <input
            id="basicSalary"
            name="basicSalary"
            type="number"
            inputMode="numeric"
            min={1}
            required={sector !== "INFORMAL"}
            placeholder="30000"
            className="input"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="btn-primary btn-lg mt-5 w-full sm:w-auto"
        >
          {t("calculate")}
        </button>
        {state.status === "error" && (
          <p className="mt-3 text-sm text-red-600">
            {state.errorMessage ??
              (state.errorCode === "BELOW_MIN_BASE"
                ? t("belowMinError")
                : isEn
                  ? "Please enter a valid amount."
                  : "कृपया मान्य रकम राख्नुहोस्।")}
          </p>
        )}
      </form>

      {/* non-formal sectors: normalized result */}
      {state.status === "ok" && state.generic && state.meta && (
        <section className="surface mt-6 p-5 md:p-6">
          {state.generic.headline
            .filter((h) => h.highlight)
            .map((h) => (
              <div key={h.label}>
                <p className="text-sm text-ink-500">{h.label}</p>
                <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">
                  {npr(h.amount)}
                </p>
              </div>
            ))}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {state.generic.headline
              .filter((h) => !h.highlight)
              .map((h) => (
                <div key={h.label} className="rounded-xl border border-ink-200 bg-white p-3">
                  <p className="text-xs text-ink-500">{h.label}</p>
                  <p className="font-semibold text-ink-900">{npr(h.amount)}</p>
                </div>
              ))}
          </div>

          <ul className="mt-5 divide-y divide-ink-100 rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-700">
            {state.generic.schemes.map((s) => (
              <li key={s.key} className="flex justify-between py-2">
                <span>
                  {isEn ? s.labelEn : s.labelNe} ({s.pct}%)
                </span>
                <span className="font-semibold text-ink-900">{npr(s.amount)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-3">
            <Callout tone="info">
              <p>{state.generic.note}</p>
              <p className="mt-2 text-xs opacity-80">
                {t("ruleVersion")}: v{state.meta.version} · {t("effectiveFrom")}:{" "}
                {state.meta.effectiveFrom} · {t("source")}: {state.meta.sourceTitle}
              </p>
            </Callout>
            <Callout tone="warn">{t("preliminaryNote")}</Callout>
          </div>
        </section>
      )}

      {state.status === "ok" && state.result && state.allocation && state.meta && (
        <section className="surface mt-6 p-5 md:p-6">
          <p className="text-sm text-ink-500">{t("totalMonthly")}</p>
          <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">
            {npr(state.result.total)}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">{t("employeeShare")}</p>
              <p className="font-semibold text-ink-900">{npr(state.result.employee.total)}</p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">{t("employerShare")}</p>
              <p className="font-semibold text-ink-900">{npr(state.result.employer.total)}</p>
            </div>
            <div className="col-span-2 rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">{t("annual")}</p>
              <p className="font-semibold text-ink-900">{npr(state.result.annualProjection)}</p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-ink-200 bg-white p-4">
            {/* Segmented allocation bar */}
            <div className="flex h-4 w-full overflow-hidden rounded-full">
              {state.allocation.schemes.map((s, i) => (
                <div
                  key={s.key}
                  title={`${isEn ? s.labelEn : s.labelNe} — ${s.pct}%`}
                  style={{
                    width: `${(s.amount / state.allocation!.total) * 100}%`,
                    backgroundColor: ["#F97316", "#b591d9", "#9666c7", "#5B2D8E"][i % 4],
                  }}
                />
              ))}
            </div>
            <ul className="mt-3 divide-y divide-ink-100 text-sm text-ink-700">
              {state.allocation.schemes.map((s) => (
                <li key={s.key} className="flex justify-between py-2">
                  <span>
                    {isEn ? s.labelEn : s.labelNe} ({s.pct}%)
                  </span>
                  <span className="font-semibold text-ink-900">{npr(s.amount)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 space-y-3">
            <Callout tone="info">
              <p>
                {t("formulaUsed")}: {state.result.formula}
              </p>
              <p>
                {t("ruleVersion")}: v{state.meta.version} · {t("effectiveFrom")}
                : {state.meta.effectiveFrom}
              </p>
              <p>
                {t("source")}: {state.meta.sourceTitle}
              </p>
            </Callout>
            <Callout tone="warn">{t("preliminaryNote")}</Callout>
          </div>

          <div className="mt-5">
            <Link href="/request?service=registration" className="btn-accent btn-lg w-full sm:w-auto">
              {t("assistCta")}
              <Icon name="arrowRight" size={16} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
