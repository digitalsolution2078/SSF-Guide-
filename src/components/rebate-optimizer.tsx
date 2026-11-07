"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { rebateOptimizer } from "@/lib/calculation/salary-tools";
import { formatNpr } from "@/lib/money";
import { Callout } from "./ui";
import { Icon } from "./icons";

const labelCls = "block text-sm font-medium text-ink-700";

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
    <div>
      <div className="card p-5 md:p-6">
        <div className="mb-5">
          <Callout tone="info">
            {isEn
              ? "Before the fiscal year ends (Ashadh), max out your legal tax deductions. Enter what you've contributed so far and see how much more room you have."
              : "आर्थिक वर्ष सकिनुअघि (असार) कानुनी कर छुट पूरा प्रयोग गर्नुहोस्। अहिलेसम्म कति योगदान गर्नुभयो राख्नुहोस् — अझै कति ठाउँ बाँकी छ हेर्नुहोस्।"}
          </Callout>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`${labelCls} sm:col-span-2`}>
            {isEn ? "Annual income (Rs.)" : "वार्षिक आम्दानी (रु.)"}
            <input type="number" min={0} value={income} onChange={(e) => setIncome(Number(e.target.value))} className="input mt-1" />
          </label>
          <label className={labelCls}>
            {isEn ? "Retirement so far (Rs./yr)" : "अवकाश अहिलेसम्म (रु./वर्ष)"}
            <input type="number" min={0} value={retire} onChange={(e) => setRetire(Number(e.target.value))} className="input mt-1" />
          </label>
          <label className={labelCls}>
            {isEn ? "Life insurance so far" : "जीवन बीमा अहिलेसम्म"}
            <input type="number" min={0} value={life} onChange={(e) => setLife(Number(e.target.value))} className="input mt-1" />
          </label>
          <label className={labelCls}>
            {isEn ? "Health insurance so far" : "स्वास्थ्य बीमा अहिलेसम्म"}
            <input type="number" min={0} value={health} onChange={(e) => setHealth(Number(e.target.value))} className="input mt-1" />
          </label>
        </div>
      </div>

      <section className="surface mt-6 p-5 md:p-6">
        <p className="text-sm text-ink-500">
          {isEn ? "You can still invest (to maximize deductions)" : "अझै लगानी गर्न सक्नुहुन्छ (छुट अधिकतम गर्न)"}
        </p>
        <p className="font-display text-3xl font-bold text-primary-700 md:text-4xl">{npr(r.totalRoom)}</p>

        <div className="mt-5 overflow-hidden rounded-xl border border-ink-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50">
                <tr className="text-left text-xs text-ink-500">
                  <th className="px-4 py-2 font-medium">{isEn ? "Deduction" : "छुट"}</th>
                  <th className="px-4 py-2 font-medium">{isEn ? "Limit" : "सीमा"}</th>
                  <th className="px-4 py-2 text-right font-medium">{isEn ? "Room left" : "बाँकी ठाउँ"}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-ink-100 last:border-b-0">
                    <td className="px-4 py-2 font-medium text-ink-900">{row.label}</td>
                    <td className="px-4 py-2 text-xs text-ink-500">{row.cap}</td>
                    <td className="px-4 py-2 text-right font-bold text-primary-700">
                      {row.room > 0 ? (
                        npr(row.room)
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-600">
                          <Icon name="check" size={14} />
                          {isEn ? "maxed" : "पूरा"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <Callout tone="warn">
            {isEn
              ? "Investing this room reduces your taxable income (within the caps). SSF contributions already count toward the retirement cap. Confirm eligibility with a tax professional."
              : "यो ठाउँमा लगानी गरे करयोग्य आम्दानी घट्छ (सीमाभित्र)। SSF योगदान अवकाश सीमामा पहिल्यै गनिन्छ। योग्यता कर विशेषज्ञसँग पुष्टि गर्नुहोस्।"}
          </Callout>
        </div>
      </section>
    </div>
  );
}
