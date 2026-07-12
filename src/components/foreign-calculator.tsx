"use client";

import { useActionState } from "react";
import { useLocale } from "next-intl";
import {
  calculateForeignAction,
  type ForeignActionState,
} from "@/app/actions/calculate-other";
import { Link } from "@/i18n/navigation";

const initialState: ForeignActionState = { status: "idle" };

export function ForeignCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number): string =>
    `${isEn ? "Rs." : "रु."} ${n.toLocaleString("en-IN")}`;
  const [state, formAction, pending] = useActionState(
    calculateForeignAction,
    initialState,
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border-l-4 border-action-500 bg-action-50 px-4 py-3 text-sm text-gray-800">
        💡{" "}
        {isEn
          ? "Current minimum monthly contribution is about Rs. 2,596. If you pay in advance for 7 to 24 months, it works out to about Rs. 2,505 per month (an advance-payment concession). Enter your own base below to estimate your amount; confirm the current figure on the SSF portal."
          : "हाल न्यूनतम मासिक योगदान करिब रु. २,५९६ छ। ७ देखि २४ महिनासम्मको अग्रिम भुक्तानी गर्दा प्रति महिना करिब रु. २,५०५ पर्छ (अग्रिम भुक्तानी सहुलियत)। आफ्नो आधार तल राखेर अनुमान गर्नुहोस्; हालको रकम SSF portal मा पुष्टि गर्नुहोस्।"}
      </div>
      <form
        action={formAction}
        className="rounded-xl border border-primary-100 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="base" className="block text-sm font-semibold text-gray-800">
              {isEn ? "Contribution base amount (Rs./month)" : "योगदान आधार रकम (रु./महिना)"}
            </label>
            <input
              id="base"
              name="base"
              type="number"
              inputMode="numeric"
              min={1}
              required
              placeholder="15000"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              {isEn
                ? "From the industrial minimum wage up to 3× that"
                : "औद्योगिक न्यूनतम पारिश्रमिकदेखि त्यसको ३ गुणासम्म"}
            </p>
          </div>
          <div>
            <label htmlFor="periodMonths" className="block text-sm font-semibold text-gray-800">
              {isEn ? "Contribution period (months)" : "योगदान अवधि (महिना)"}
            </label>
            <input
              id="periodMonths"
              name="periodMonths"
              type="number"
              inputMode="numeric"
              min={1}
              max={600}
              required
              placeholder="12"
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="mt-4 rounded-lg bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {isEn ? "Calculate" : "Calculate गर्नुहोस्"}
        </button>
        {state.status === "error" && (
          <p className="mt-3 rounded-lg bg-action-50 px-4 py-2 text-sm text-action-700">
            {state.errorMessage ??
              (isEn ? "Please enter a valid amount." : "कृपया मान्य रकम राख्नुहोस्।")}
          </p>
        )}
      </form>

      {state.status === "ok" && state.result && state.meta && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-primary-400 bg-primary-600 p-4 text-white shadow-sm">
              <p className="text-xs text-primary-100">
                {isEn ? "Monthly contribution" : "मासिक योगदान"} ({state.result.monthlyPct}%)
              </p>
              <p className="mt-1 text-xl font-bold">
                {npr(state.result.monthlyTotal)}
              </p>
            </div>
            <div className="rounded-xl border border-primary-100 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">
                {isEn
                  ? `Total over ${state.result.periodMonths} months`
                  : `${state.result.periodMonths} महिनाको जम्मा`}
              </p>
              <p className="mt-1 text-xl font-bold text-primary-800">
                {npr(state.result.periodTotal)}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm">
            <ul className="space-y-1 text-sm text-gray-700">
              {state.result.schemes.map((s) => (
                <li key={s.key} className="flex justify-between">
                  <span>
                    {isEn ? s.labelEn : s.labelNe} ({s.pct}%)
                  </span>
                  <span className="font-medium">{npr(s.amount)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
              {state.result.assumptions.map((a, i) => (
                <p key={i}>• {a}</p>
              ))}
              <p className="mt-1">
                {isEn ? "Rule" : "नियम"} v{state.meta.version} · {isEn ? "effective" : "लागू"} {state.meta.effectiveFrom}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/checklists/foreign-employment-registration"
              className="rounded-xl border-2 border-primary-200 bg-white p-4 text-sm font-semibold text-primary-800 hover:border-primary-400"
            >
              📋 {isEn ? "View the Registration/KYC checklist →" : "Registration/KYC checklist हेर्नुहोस् →"}
            </Link>
            <Link
              href="/request?service=registration"
              className="rounded-xl bg-action-500 p-4 text-sm font-semibold text-white hover:bg-action-600"
            >
              🤝 {isEn ? "Get help with registration →" : "Registration मा सहायता लिनुहोस् →"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
