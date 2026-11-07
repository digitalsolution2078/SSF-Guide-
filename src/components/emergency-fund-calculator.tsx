"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  calculateEmergencyFund,
  type EmergencyFundResult,
} from "@/lib/calculation/finance";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";
import { Callout } from "./ui";
import { Icon } from "./icons";

const labelCls = "block text-sm font-medium text-ink-700";

export function EmergencyFundCalculator() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [expense, setExpense] = useState(30_000);
  const [months, setMonths] = useState(6);
  const [savings, setSavings] = useState(50_000);

  const result: EmergencyFundResult | null = useMemo(() => {
    try {
      return calculateEmergencyFund(expense, months, savings);
    } catch {
      return null;
    }
  }, [expense, months, savings]);

  const covered = result ? result.gap === 0 : false;

  return (
    <div>
      <div className="card p-5 md:p-6">
        <div className="mb-5">
          <Callout tone="info">
            {isEn
              ? "An emergency fund covers job loss, medical copayments, and shocks that even SSF and insurance don't fully cover. A common target is 3–6 months of expenses."
              : "आकस्मिक कोषले जागिर गुम्ने, medical copayment र SSF/बीमाले पूर्ण नढाक्ने झट्का धान्छ। सामान्य लक्ष्य ३–६ महिनाको खर्च।"}
          </Callout>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            {isEn ? "Monthly expense (Rs.)" : "मासिक खर्च (रु.)"}
            <input
              type="number"
              min={1000}
              value={expense}
              onChange={(e) => setExpense(Number(e.target.value))}
              className="input mt-1"
            />
          </label>
          <label className={labelCls}>
            {isEn ? "Current savings (Rs.)" : "हालको बचत (रु.)"}
            <input
              type="number"
              min={0}
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
              className="input mt-1"
            />
          </label>
          <label className={`${labelCls} sm:col-span-2`}>
            {isEn ? "Months of cover you want" : "कति महिनाको cover चाहनुहुन्छ"}: {months}
            <input
              type="range"
              min={1}
              max={12}
              step={1}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="mt-2 w-full accent-primary-600"
            />
          </label>
        </div>
      </div>

      {result && (
        <section className="surface mt-6 p-5 md:p-6">
          <p className="text-sm text-ink-500">
            {isEn ? "Recommended fund" : "सिफारिस गरिएको कोष"}
          </p>
          <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">
            {npr(result.recommended)}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-ink-200 bg-white p-3">
              <p className="text-xs text-ink-500">
                {isEn ? "You currently cover" : "हाल तपाईं ढाक्नुहुन्छ"}
              </p>
              <p className="font-semibold text-ink-900">
                {result.monthsCovered} {isEn ? "months" : "महिना"}
              </p>
            </div>
            <div
              className={`rounded-xl border p-3 ${
                covered ? "border-emerald-200 bg-emerald-50" : "border-ink-200 bg-white"
              }`}
            >
              <p className="text-xs text-ink-500">
                {covered
                  ? isEn
                    ? "Status"
                    : "अवस्था"
                  : isEn
                    ? "Still to save"
                    : "अझै बचाउनुपर्ने"}
              </p>
              <p className={`font-semibold ${covered ? "text-emerald-700" : "text-ink-900"}`}>
                {covered
                  ? isEn
                    ? "✓ Covered"
                    : "✓ पुग्यो"
                  : npr(result.gap)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Callout tone="info">
              {isEn
                ? "Keep this fund somewhere safe and easy to access (savings account, FD you can break). It is the layer that protects you when SSF/insurance limits or copayments fall short."
                : "यो कोष सुरक्षित र सजिलै झिक्न मिल्ने ठाउँमा राख्नुहोस् (बचत खाता, तोड्न मिल्ने FD)। SSF/बीमाको Limit वा copayment नपुग्दा यही Layer ले जोगाउँछ।"}
            </Callout>
          </div>

          <div className="mt-5">
            <Link
              href="/school/medical-maternity-accident-dependent/swasthya-bima-ki-ssf-medical"
              className="btn-ghost -ml-2"
            >
              <Icon name="book" size={16} />
              {isEn ? "Read: layered health protection →" : "पढ्नुहोस्: Layered स्वास्थ्य सुरक्षा →"}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
