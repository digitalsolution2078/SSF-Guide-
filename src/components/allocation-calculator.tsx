"use client";

import { useActionState } from "react";
import {
  calculateAllocationAction,
  type AllocationActionState,
} from "@/app/actions/calculate-other";
import { Link } from "@/i18n/navigation";

const initialState: AllocationActionState = { status: "idle" };
const COLORS = ["#F97316", "#b591d9", "#9666c7", "#5B2D8E"];

function npr(n: number): string {
  return `रु. ${n.toLocaleString("en-IN")}`;
}

const SCHEME_EXPLAINER: Record<string, string> = {
  medical: "उपचार, OPD र प्रसूति सुविधाका लागि — बीमा-जस्तो सुरक्षा।",
  accident: "दुर्घटना उपचार र अशक्तता निवृत्तभरणका लागि।",
  dependent: "मृत्यु भएमा परिवारको निवृत्तभरण र शैक्षिक वृत्तिका लागि।",
  old_age:
    "तपाईंकै बचत — निवृत्तभरण योजना (२०%, ६० वर्षपछि मासिक pension) + अवकाश सुविधा (८.३३%, रोजगारी अन्त्यमा एकमुष्ट)।",
};

export function AllocationCalculator() {
  const [state, formAction, pending] = useActionState(
    calculateAllocationAction,
    initialState,
  );

  return (
    <div className="space-y-6">
      <form
        action={formAction}
        className="rounded-xl border border-primary-100 bg-white p-6 shadow-sm"
      >
        <label htmlFor="basicSalary" className="block text-sm font-semibold text-gray-800">
          मासिक आधारभूत पारिश्रमिक (रु.)
        </label>
        <div className="mt-2 flex gap-3">
          <input
            id="basicSalary"
            name="basicSalary"
            type="number"
            inputMode="numeric"
            min={1}
            required
            placeholder="30000"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          <button
            type="submit"
            disabled={pending}
            className="whitespace-nowrap rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            हेर्नुहोस्
          </button>
        </div>
        {state.status === "error" && (
          <p className="mt-3 rounded-lg bg-action-50 px-4 py-2 text-sm text-action-700">
            {state.errorCode === "BELOW_MIN_BASE"
              ? "आधारभूत पारिश्रमिक न्यूनतम पारिश्रमिकभन्दा कम हुन सक्दैन।"
              : "कृपया मान्य रकम राख्नुहोस्।"}
          </p>
        )}
      </form>

      {state.status === "ok" && state.result && state.meta && (
        <div className="space-y-4">
          <div className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              कुल मासिक योगदान (३१%):{" "}
              <span className="text-lg font-bold text-primary-800">
                {npr(state.result.total)}
              </span>
            </p>

            <div className="mt-4 flex h-6 w-full overflow-hidden rounded-full">
              {state.result.schemes.map((s, i) => (
                <div
                  key={s.key}
                  title={`${s.labelNe} — ${s.pct}%`}
                  style={{
                    width: `${(s.amount / state.result!.total) * 100}%`,
                    backgroundColor: COLORS[i % 4],
                  }}
                />
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {state.result.schemes.map((s, i) => (
                <div
                  key={s.key}
                  className="rounded-lg border border-gray-100 p-3"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold text-gray-800">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % 4] }}
                      />
                      {s.labelNe} ({s.pct}%)
                    </span>
                    <span className="font-bold text-primary-800">
                      {npr(s.amount)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {SCHEME_EXPLAINER[s.key]}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-primary-50 p-3">
                <p className="text-xs text-gray-500">निवृत्तभरण योजना (२०%)</p>
                <p className="font-bold text-primary-800">
                  {npr(state.result.oldAgeSplit.pension.amount)}
                </p>
                <p className="text-xs text-gray-500">६० वर्षसम्म झिक्न नमिल्ने</p>
              </div>
              <div className="rounded-lg bg-action-50 p-3">
                <p className="text-xs text-gray-500">अवकाश सुविधा (८.३३%)</p>
                <p className="font-bold text-action-700">
                  {npr(state.result.oldAgeSplit.retirement.amount)}
                </p>
                <p className="text-xs text-gray-500">रोजगारी अन्त्यमा एकमुष्ट</p>
              </div>
            </div>

            <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
              नियम v{state.meta.version} · लागू {state.meta.effectiveFrom} ·{" "}
              {state.meta.sourceTitle}
            </p>
          </div>

          <Link
            href="/school/yogdan-ra-badfad/31-pratishat-kaha-jancha"
            className="block rounded-xl border-2 border-primary-200 bg-white p-4 text-sm font-semibold text-primary-800 hover:border-primary-400"
          >
            📖 विस्तृत guide: SSF को 31% रकम कहाँ जान्छ? →
          </Link>
        </div>
      )}
    </div>
  );
}
