"use client";

import { useActionState } from "react";
import { useLocale } from "next-intl";
import {
  calculateAllocationAction,
  type AllocationActionState,
} from "@/app/actions/calculate-other";
import { Link } from "@/i18n/navigation";
import { Callout } from "./ui";
import { Icon } from "./icons";

const initialState: AllocationActionState = { status: "idle" };
const COLORS = ["#F97316", "#b591d9", "#9666c7", "#5B2D8E"];

const SCHEME_EXPLAINER: Record<string, string> = {
  medical: "उपचार, OPD र प्रसूति सुविधाका लागि — बीमा-जस्तो सुरक्षा।",
  accident: "दुर्घटना उपचार र अशक्तता निवृत्तभरणका लागि।",
  dependent: "मृत्यु भएमा परिवारको निवृत्तभरण र शैक्षिक वृत्तिका लागि।",
  old_age:
    "तपाईंकै बचत — निवृत्तभरण योजना (२०%, ६० वर्षपछि मासिक pension) + अवकाश सुविधा (८.३३%, रोजगारी अन्त्यमा एकमुष्ट)।",
};

const SCHEME_EXPLAINER_EN: Record<string, string> = {
  medical: "For treatment, OPD, and maternity benefits — insurance-like protection.",
  accident: "For accident treatment and the disability pension.",
  dependent: "For the family's pension and education stipend in case of death.",
  old_age:
    "Your own savings — the Pension Scheme (20%, monthly pension after 60) + Retirement Benefit (8.33%, lump sum when employment ends).",
};

export function AllocationCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number): string =>
    `${isEn ? "Rs." : "रु."} ${n.toLocaleString("en-IN")}`;
  const [state, formAction, pending] = useActionState(
    calculateAllocationAction,
    initialState,
  );

  return (
    <div>
      <form action={formAction} className="card p-5 md:p-6">
        <label htmlFor="basicSalary" className="mb-1 block text-sm font-medium text-ink-700">
          {isEn ? "Monthly basic salary (Rs.)" : "मासिक आधारभूत पारिश्रमिक (रु.)"}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="basicSalary"
            name="basicSalary"
            type="number"
            inputMode="numeric"
            min={1}
            required
            placeholder="30000"
            className="input"
          />
          <button
            type="submit"
            disabled={pending}
            className="btn-primary btn-lg w-full shrink-0 sm:w-auto"
          >
            {isEn ? "See" : "हेर्नुहोस्"}
          </button>
        </div>
        {state.status === "error" && (
          <p className="mt-3 text-sm text-red-600">
            {state.errorCode === "BELOW_MIN_BASE"
              ? isEn
                ? "The basic salary cannot be below the minimum wage."
                : "आधारभूत पारिश्रमिक न्यूनतम पारिश्रमिकभन्दा कम हुन सक्दैन।"
              : isEn
                ? "Please enter a valid amount."
                : "कृपया मान्य रकम राख्नुहोस्।"}
          </p>
        )}
      </form>

      {state.status === "ok" && state.result && state.meta && (
        <section className="surface mt-6 p-5 md:p-6">
          <p className="text-sm text-ink-500">
            {isEn ? "Total monthly contribution (31%):" : "कुल मासिक योगदान (३१%):"}
          </p>
          <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">
            {npr(state.result.total)}
          </p>

          <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full">
            {state.result.schemes.map((s, i) => (
              <div
                key={s.key}
                title={`${isEn ? s.labelEn : s.labelNe} — ${s.pct}%`}
                style={{
                  width: `${(s.amount / state.result!.total) * 100}%`,
                  backgroundColor: COLORS[i % 4],
                }}
              />
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {state.result.schemes.map((s, i) => (
              <div key={s.key} className="rounded-xl border border-ink-200 bg-white p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold text-ink-900">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[i % 4] }}
                    />
                    {isEn ? s.labelEn : s.labelNe} ({s.pct}%)
                  </span>
                  <span className="font-semibold text-ink-900">
                    {npr(s.amount)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-500">
                  {(isEn ? SCHEME_EXPLAINER_EN : SCHEME_EXPLAINER)[s.key]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn ? "Pension Scheme (20%)" : "निवृत्तभरण योजना (२०%)"}
              </p>
              <p className="font-semibold text-ink-900">
                {npr(state.result.oldAgeSplit.pension.amount)}
              </p>
              <p className="mt-1 text-xs text-ink-500">
                {isEn ? "Locked until age 60" : "६० वर्षसम्म झिक्न नमिल्ने"}
              </p>
            </div>
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn ? "Retirement Benefit (8.33%)" : "अवकाश सुविधा (८.३३%)"}
              </p>
              <p className="font-semibold text-ink-900">
                {npr(state.result.oldAgeSplit.retirement.amount)}
              </p>
              <p className="mt-1 text-xs text-ink-500">
                {isEn ? "Lump sum when employment ends" : "रोजगारी अन्त्यमा एकमुष्ट"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Callout tone="info">
              {isEn ? "Rule" : "नियम"} v{state.meta.version} · {isEn ? "effective" : "लागू"} {state.meta.effectiveFrom} ·{" "}
              {state.meta.sourceTitle}
            </Callout>
          </div>

          <div className="mt-5">
            <Link
              href="/school/yogdan-ra-badfad/31-pratishat-kaha-jancha"
              className="btn-ghost -ml-2"
            >
              <Icon name="book" size={16} />
              {isEn
                ? "Detailed guide: Where does SSF's 31% go? →"
                : "विस्तृत guide: SSF को 31% रकम कहाँ जान्छ? →"}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
