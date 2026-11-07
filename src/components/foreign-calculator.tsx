"use client";

import { useActionState } from "react";
import { useLocale } from "next-intl";
import {
  calculateForeignAction,
  type ForeignActionState,
} from "@/app/actions/calculate-other";
import { Link } from "@/i18n/navigation";
import { Callout } from "./ui";
import { Icon } from "./icons";

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
    <div>
      <div className="mb-6">
        <Callout tone="info">
          {isEn
            ? "Current minimum monthly contribution is about Rs. 2,596. If you pay in advance for 7 to 24 months, it works out to about Rs. 2,505 per month (an advance-payment concession). Enter your own base below to estimate your amount; confirm the current figure on the SSF portal."
            : "हाल न्यूनतम मासिक योगदान करिब रु. २,५९६ छ। ७ देखि २४ महिनासम्मको अग्रिम भुक्तानी गर्दा प्रति महिना करिब रु. २,५०५ पर्छ (अग्रिम भुक्तानी सहुलियत)। आफ्नो आधार तल राखेर अनुमान गर्नुहोस्; हालको रकम SSF portal मा पुष्टि गर्नुहोस्।"}
        </Callout>
      </div>
      <form action={formAction} className="card p-5 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="base" className="mb-1 block text-sm font-medium text-ink-700">
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
              className="input"
            />
            <p className="mt-1 text-xs text-ink-500">
              {isEn
                ? "From the industrial minimum wage up to 3× that"
                : "औद्योगिक न्यूनतम पारिश्रमिकदेखि त्यसको ३ गुणासम्म"}
            </p>
          </div>
          <div>
            <label htmlFor="periodMonths" className="mb-1 block text-sm font-medium text-ink-700">
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
              className="input"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="btn-primary btn-lg mt-5 w-full sm:w-auto"
        >
          {isEn ? "Calculate" : "Calculate गर्नुहोस्"}
        </button>
        {state.status === "error" && (
          <p className="mt-3 text-sm text-red-600">
            {state.errorMessage ??
              (isEn ? "Please enter a valid amount." : "कृपया मान्य रकम राख्नुहोस्।")}
          </p>
        )}
      </form>

      {state.status === "ok" && state.result && state.meta && (
        <section className="surface mt-6 p-5 md:p-6">
          <p className="text-sm text-ink-500">
            {isEn ? "Monthly contribution" : "मासिक योगदान"} ({state.result.monthlyPct}%)
          </p>
          <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">
            {npr(state.result.monthlyTotal)}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn
                  ? `Total over ${state.result.periodMonths} months`
                  : `${state.result.periodMonths} महिनाको जम्मा`}
              </p>
              <p className="font-semibold text-ink-900">
                {npr(state.result.periodTotal)}
              </p>
            </div>
          </div>

          <ul className="mt-5 divide-y divide-ink-100 rounded-xl border border-ink-200 bg-white px-4 text-sm text-ink-700">
            {state.result.schemes.map((s) => (
              <li key={s.key} className="flex justify-between py-2">
                <span>
                  {isEn ? s.labelEn : s.labelNe} ({s.pct}%)
                </span>
                <span className="font-semibold text-ink-900">{npr(s.amount)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <Callout tone="info">
              {state.result.assumptions.map((a, i) => (
                <p key={i}>• {a}</p>
              ))}
              <p className="mt-1">
                {isEn ? "Rule" : "नियम"} v{state.meta.version} · {isEn ? "effective" : "लागू"} {state.meta.effectiveFrom}
              </p>
            </Callout>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <Link href="/request?service=registration" className="btn-accent btn-lg w-full sm:w-auto">
              <Icon name="users" size={16} />
              {isEn ? "Get help with registration →" : "Registration मा सहायता लिनुहोस् →"}
            </Link>
            <Link href="/checklists/foreign-employment-registration" className="btn-ghost">
              <Icon name="list" size={16} />
              {isEn ? "View the Registration/KYC checklist →" : "Registration/KYC checklist हेर्नुहोस् →"}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
