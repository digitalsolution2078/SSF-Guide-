"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { rebateOptimizer } from "@/lib/calculation/salary-tools";
import { formatNpr } from "@/lib/money";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

export function RebateOptimizer() {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);

  const [income, setIncome] = useState(1_200_000);
  const [retire, setRetire] = useState(100_000);
  const [life, setLife] = useState(0);
  const [health, setHealth] = useState(0);

  const r = useMemo(
    () =>
      rebateOptimizer({
        annualIncome: income,
        currentRetirement: retire,
        currentLife: life,
        currentHealth: health,
      }),
    [income, retire, life, health],
  );

  const rows = [
    {
      label: isEn ? "Retirement (SSF / EPF / CIT)" : "अवकाश (SSF / EPF / CIT)",
      cap: isEn ? `cap ${npr(r.retirementCap)} (⅓ income or Rs 5L)` : `सीमा ${npr(r.retirementCap)} (⅓ आम्दानी वा रु. ५ लाख)`,
      room: r.retirementRoom,
    },
    {
      label: isEn ? "Life insurance premium" : "जीवन बीमा प्रिमियम",
      cap: isEn ? "cap Rs 40,000" : "सीमा रु. ४०,०००",
      room: r.lifeRoom,
    },
    {
      label: isEn ? "Health insurance premium" : "स्वास्थ्य बीमा प्रिमियम",
      cap: isEn ? "cap Rs 20,000" : "सीमा रु. २०,०००",
      room: r.healthRoom,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-primary-100 bg-white p-6 shadow-sm">
        <p className="mb-4 rounded-lg bg-primary-50 px-3 py-2 text-xs text-gray-600">
          💡{" "}
          {isEn
            ? "Before the fiscal year ends (Ashadh), max out your legal tax deductions. Enter what you've contributed so far and see how much more room you have."
            : "आर्थिक वर्ष सकिनुअघि (असार) कानुनी कर छुट पूरा प्रयोग गर्नुहोस्। अहिलेसम्म कति योगदान गर्नुभयो राख्नुहोस् — अझै कति ठाउँ बाँकी छ हेर्नुहोस्।"}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800 sm:col-span-2">
            {isEn ? "Annual income (Rs.)" : "वार्षिक आम्दानी (रु.)"}
            <input type="number" min={0} value={income} onChange={(e) => setIncome(Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Retirement so far (Rs./yr)" : "अवकाश अहिलेसम्म (रु./वर्ष)"}
            <input type="number" min={0} value={retire} onChange={(e) => setRetire(Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Life insurance so far" : "जीवन बीमा अहिलेसम्म"}
            <input type="number" min={0} value={life} onChange={(e) => setLife(Number(e.target.value))} className={inputCls} />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            {isEn ? "Health insurance so far" : "स्वास्थ्य बीमा अहिलेसम्म"}
            <input type="number" min={0} value={health} onChange={(e) => setHealth(Number(e.target.value))} className={inputCls} />
          </label>
        </div>
      </div>

      <div className="rounded-2xl bg-primary-600 p-5 text-white shadow">
        <p className="text-xs text-primary-100">
          {isEn ? "You can still invest (to maximize deductions)" : "अझै लगानी गर्न सक्नुहुन्छ (छुट अधिकतम गर्न)"}
        </p>
        <p className="mt-1 text-3xl font-extrabold">{npr(r.totalRoom)}</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2">{isEn ? "Deduction" : "छुट"}</th>
              <th className="pb-2">{isEn ? "Limit" : "सीमा"}</th>
              <th className="pb-2 text-right">{isEn ? "Room left" : "बाँकी ठाउँ"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-50">
                <td className="py-2 font-medium text-gray-800">{row.label}</td>
                <td className="py-2 text-xs text-gray-500">{row.cap}</td>
                <td className="py-2 text-right font-bold text-primary-800">
                  {row.room > 0 ? npr(row.room) : <span className="text-green-600">✓ {isEn ? "maxed" : "पूरा"}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
        ⚠️{" "}
        {isEn
          ? "Investing this room reduces your taxable income (within the caps). SSF contributions already count toward the retirement cap. Confirm eligibility with a tax professional."
          : "यो ठाउँमा लगानी गरे करयोग्य आम्दानी घट्छ (सीमाभित्र)। SSF योगदान अवकाश सीमामा पहिल्यै गनिन्छ। योग्यता कर विशेषज्ञसँग पुष्टि गर्नुहोस्।"}
      </p>
    </div>
  );
}
