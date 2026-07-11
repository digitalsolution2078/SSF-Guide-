"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import {
  calculateContributionAction,
  type ContributionActionState,
} from "@/app/actions/calculate-contribution";
import { Link } from "@/i18n/navigation";

const initialState: ContributionActionState = { status: "idle" };

function npr(n: number): string {
  return `रु. ${n.toLocaleString("en-IN")}`;
}

const SECTORS = [
  { value: "FORMAL", label: "औपचारिक क्षेत्र (जागिर)", input: "मासिक आधारभूत पारिश्रमिक (रु.)" },
  { value: "SELF_EMPLOYED", label: "स्वरोजगार", input: "रोजेको आधार रकम (रु./महिना)" },
  { value: "FOREIGN", label: "वैदेशिक रोजगारी", input: "योगदान आधार रकम (रु./महिना)" },
  { value: "INFORMAL", label: "अनौपचारिक क्षेत्र", input: "" },
] as const;

export function ContributionCalculator() {
  const t = useTranslations("calculator");
  const [sector, setSector] = useState<(typeof SECTORS)[number]["value"]>("FORMAL");
  const [state, formAction, pending] = useActionState(
    calculateContributionAction,
    initialState,
  );
  const sectorInfo = SECTORS.find((s) => s.value === sector)!;

  return (
    <div className="space-y-6">
      <form
        action={formAction}
        className="rounded-xl border border-primary-100 bg-white p-6 shadow-sm"
      >
        <label className="block text-sm font-semibold text-gray-800">
          तपाईंको क्षेत्र (sector) — योगदान % क्षेत्रअनुसार फरक हुन्छ
          <select
            name="sector"
            value={sector}
            onChange={(e) => setSector(e.target.value as typeof sector)}
            className="mb-4 mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {SECTORS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label
          htmlFor="basicSalary"
          className={`block text-sm font-semibold text-gray-800 ${sector === "INFORMAL" ? "hidden" : ""}`}
        >
          {sector === "FORMAL" ? t("basicSalary") : sectorInfo.input}
        </label>
        <div className="mt-2 flex gap-3">
          <input
            id="basicSalary"
            name="basicSalary"
            type="number"
            inputMode="numeric"
            min={1}
            required={sector !== "INFORMAL"}
            placeholder="30000"
            className={`w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 ${sector === "INFORMAL" ? "hidden" : ""}`}
          />
          <button
            type="submit"
            disabled={pending}
            className="whitespace-nowrap rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {t("calculate")}
          </button>
        </div>
        {state.status === "error" && (
          <p className="mt-3 rounded-lg bg-action-50 px-4 py-2 text-sm text-action-700">
            {state.errorMessage ??
              (state.errorCode === "BELOW_MIN_BASE"
                ? t("belowMinError")
                : "कृपया मान्य रकम राख्नुहोस्।")}
          </p>
        )}
      </form>

      {/* non-formal sectors: normalized result */}
      {state.status === "ok" && state.generic && state.meta && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {state.generic.headline.map((h) => (
              <ResultCard
                key={h.label}
                label={h.label}
                value={npr(h.amount)}
                highlight={h.highlight}
              />
            ))}
          </div>
          <div className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm">
            <ul className="space-y-1 text-sm text-gray-700">
              {state.generic.schemes.map((s) => (
                <li key={s.key} className="flex justify-between">
                  <span>
                    {s.labelNe} ({s.pct}%)
                  </span>
                  <span className="font-medium">{npr(s.amount)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-gray-100 pt-3 text-sm text-gray-600">
              💡 {state.generic.note}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              {t("ruleVersion")}: v{state.meta.version} · {t("effectiveFrom")}:{" "}
              {state.meta.effectiveFrom} · {t("source")}: {state.meta.sourceTitle}
            </p>
          </div>
          <p className="rounded-lg bg-primary-50 px-4 py-3 text-sm text-gray-700">
            ⚠️ {t("preliminaryNote")}
          </p>
        </div>
      )}

      {state.status === "ok" && state.result && state.allocation && state.meta && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ResultCard
              label={t("employeeShare")}
              value={npr(state.result.employee.total)}
            />
            <ResultCard
              label={t("employerShare")}
              value={npr(state.result.employer.total)}
            />
            <ResultCard
              label={t("totalMonthly")}
              value={npr(state.result.total)}
              highlight
            />
          </div>

          <div className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-800">
              {t("annual")}:{" "}
              <span className="text-primary-700">
                {npr(state.result.annualProjection)}
              </span>
            </p>

            {/* Segmented allocation bar */}
            <div className="mt-4 flex h-5 w-full overflow-hidden rounded-full">
              {state.allocation.schemes.map((s, i) => (
                <div
                  key={s.key}
                  title={`${s.labelNe} — ${s.pct}%`}
                  style={{
                    width: `${(s.amount / state.allocation!.total) * 100}%`,
                    backgroundColor: ["#F97316", "#b591d9", "#9666c7", "#5B2D8E"][i % 4],
                  }}
                />
              ))}
            </div>
            <ul className="mt-3 space-y-1 text-sm text-gray-700">
              {state.allocation.schemes.map((s) => (
                <li key={s.key} className="flex justify-between">
                  <span>
                    {s.labelNe} ({s.pct}%)
                  </span>
                  <span className="font-medium">{npr(s.amount)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
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
            </div>
          </div>

          <p className="rounded-lg bg-primary-50 px-4 py-3 text-sm text-gray-700">
            ⚠️ {t("preliminaryNote")}
          </p>

          <Link
            href="/request?service=registration"
            className="block rounded-xl bg-action-500 px-5 py-3 text-center font-semibold text-white shadow hover:bg-action-600"
          >
            {t("assistCta")} →
          </Link>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        highlight
          ? "border-primary-400 bg-primary-600 text-white"
          : "border-primary-100 bg-white"
      }`}
    >
      <p
        className={`text-xs font-medium ${highlight ? "text-primary-100" : "text-gray-500"}`}
      >
        {label}
      </p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}
