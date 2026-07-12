"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  calculateEmergencyFund,
  type EmergencyFundResult,
} from "@/lib/calculation/finance";
import { formatNpr } from "@/lib/money";
import { Link } from "@/i18n/navigation";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

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
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
          💡{" "}
          {isEn
            ? "An emergency fund covers job loss, medical copayments, and shocks that even SSF and insurance don't fully cover. A common target is 3–6 months of expenses."
            : "आकस्मिक कोषले जागिर गुम्ने, medical copayment र SSF/बीमाले पूर्ण नढाक्ने झट्का धान्छ। सामान्य लक्ष्य ३–६ महिनाको खर्च।"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Monthly expense (Rs.)" : "मासिक खर्च (रु.)"}
            <input
              type="number"
              min={1000}
              value={expense}
              onChange={(e) => setExpense(Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Current savings (Rs.)" : "हालको बचत (रु.)"}
            <input
              type="number"
              min={0}
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
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
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
              <p className="text-xs text-primary-100">
                {isEn ? "Recommended fund" : "सिफारिस गरिएको कोष"}
              </p>
              <p className="mt-1 text-2xl font-bold">{npr(result.recommended)}</p>
            </div>
            <div className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
              <p className="text-xs text-gray-500">
                {isEn ? "You currently cover" : "हाल तपाईं ढाक्नुहुन्छ"}
              </p>
              <p className="mt-1 text-2xl font-bold text-primary-800">
                {result.monthsCovered} {isEn ? "months" : "महिना"}
              </p>
            </div>
            <div
              className={`rounded-2xl border p-5 shadow-sm ${
                covered
                  ? "border-green-300 bg-green-50"
                  : "border-action-500/30 bg-action-50"
              }`}
            >
              <p className="text-xs text-gray-600">
                {covered
                  ? isEn
                    ? "Status"
                    : "अवस्था"
                  : isEn
                    ? "Still to save"
                    : "अझै बचाउनुपर्ने"}
              </p>
              <p
                className={`mt-1 text-2xl font-bold ${
                  covered ? "text-green-700" : "text-action-700"
                }`}
              >
                {covered
                  ? isEn
                    ? "✓ Covered"
                    : "✓ पुग्यो"
                  : npr(result.gap)}
              </p>
            </div>
          </div>

          <p className="rounded-lg bg-primary-50 px-4 py-3 text-sm text-gray-700">
            {isEn
              ? "Keep this fund somewhere safe and easy to access (savings account, FD you can break). It is the layer that protects you when SSF/insurance limits or copayments fall short."
              : "यो कोष सुरक्षित र सजिलै झिक्न मिल्ने ठाउँमा राख्नुहोस् (बचत खाता, तोड्न मिल्ने FD)। SSF/बीमाको Limit वा copayment नपुग्दा यही Layer ले जोगाउँछ।"}
          </p>

          <Link
            href="/school/medical-maternity-accident-dependent/swasthya-bima-ki-ssf-medical"
            className="block rounded-xl border-2 border-primary-200 bg-white p-4 text-center text-sm font-semibold text-primary-800 hover:border-primary-400"
          >
            📖 {isEn ? "Read: layered health protection →" : "पढ्नुहोस्: Layered स्वास्थ्य सुरक्षा →"}
          </Link>
        </>
      )}
    </div>
  );
}
