"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  computeSectorBreakdown,
  type SectorKey,
} from "@/lib/calculation/sector-breakdown";
import { formatNpr } from "@/lib/money";

const inputCls =
  "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-lg font-semibold focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200";

const BUCKET_STYLE: Record<string, { bar: string; chip: string; emoji: string }> = {
  pension: { bar: "bg-primary-600", chip: "bg-primary-50 text-primary-800", emoji: "💰" },
  gratuity: { bar: "bg-primary-400", chip: "bg-primary-50 text-primary-800", emoji: "🏦" },
  oldage: { bar: "bg-primary-500", chip: "bg-primary-50 text-primary-800", emoji: "👴" },
  insurance: { bar: "bg-action-500", chip: "bg-action-50 text-action-700", emoji: "🛡️" },
};

export function SectorExplorer({
  sector,
  defaultBase,
  baseLabelNe,
  baseLabelEn,
}: {
  sector: SectorKey;
  defaultBase: number;
  baseLabelNe: string;
  baseLabelEn: string;
}) {
  const locale = useLocale();
  const isEn = locale === "en";
  const npr = (n: number) => formatNpr(n, isEn);
  const [base, setBase] = useState(defaultBase);

  const r = useMemo(() => computeSectorBreakdown(sector, base), [sector, base]);

  return (
    <div className="rounded-2xl border-2 border-primary-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary-900">
        🧮 {isEn ? "Your contribution breakdown" : "तपाईंको योगदान breakdown"}
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        {isEn
          ? "Enter your base amount and see exactly how much goes to pension, gratuity, and insurance."
          : "आफ्नो आधार रकम राख्नुहोस् — कति पेन्सन, कति उपदान र कति बीमामा जान्छ ठ्याक्कै हेर्नुहोस्।"}
      </p>

      <label className="mt-4 block text-sm font-semibold text-gray-800">
        {isEn ? baseLabelEn : baseLabelNe}
        <input
          type="number"
          min={0}
          value={base}
          onChange={(e) => setBase(Number(e.target.value))}
          className={inputCls}
        />
      </label>

      {/* headline total */}
      <div className="mt-5 rounded-xl bg-primary-600 p-4 text-white">
        <p className="text-xs text-primary-100">
          {isEn
            ? `Total monthly contribution (${r.totalPct}%)`
            : `कुल मासिक योगदान (${r.totalPct}%)`}
        </p>
        <p className="text-3xl font-extrabold">{npr(r.total)}</p>
        <p className="mt-1 text-xs text-primary-200">
          {r.whoPays
            .map(
              (w) =>
                `${isEn ? w.labelEn : w.labelNe}: ${npr(w.amount)} (${w.pct}%)`,
            )
            .join("  ·  ")}
        </p>
      </div>

      {/* stacked bar */}
      <div className="mt-5 flex h-8 w-full overflow-hidden rounded-full">
        {r.buckets.map((b) => (
          <div
            key={b.key}
            className={BUCKET_STYLE[b.key].bar}
            style={{ width: `${(b.pct / r.totalPct) * 100}%` }}
            title={`${isEn ? b.labelEn : b.labelNe}: ${npr(b.amount)}`}
          />
        ))}
      </div>

      {/* bucket cards */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {r.buckets.map((b) => {
          const st = BUCKET_STYLE[b.key];
          return (
            <div
              key={b.key}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{st.emoji}</span>
                <span className={`rounded px-2 py-0.5 text-xs font-semibold ${st.chip}`}>
                  {b.pct}%
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-primary-900">
                {npr(b.amount)}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-800">
                {isEn ? b.labelEn : b.labelNe}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {isEn ? b.descEn : b.descNe}
              </p>
            </div>
          );
        })}
      </div>

      {/* insurance detail */}
      {r.insuranceDetail.length > 0 && (
        <div className="mt-4 rounded-xl border border-action-500/20 bg-action-50 p-4">
          <p className="text-sm font-semibold text-action-700">
            🛡️ {isEn ? "Insurance portion — what it covers" : "बीमा भाग — के-के समेट्छ"}
          </p>
          <div className="mt-2 grid grid-cols-1 gap-1 text-sm sm:grid-cols-3">
            {r.insuranceDetail.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-2 sm:block">
                <span className="text-gray-700">{isEn ? d.labelEn : d.labelNe}</span>
                <span className="font-semibold text-gray-900">
                  {npr(d.amount)}{" "}
                  <span className="font-normal text-gray-400">({d.pct}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 rounded-lg bg-primary-50 px-4 py-3 text-xs text-gray-600">
        💡 {isEn ? r.noteEn : r.noteNe}
      </p>
      <p className="mt-2 text-xs text-gray-400">
        {isEn
          ? "Preliminary educational estimate; final figures follow official SSF rules."
          : "प्रारम्भिक शैक्षिक अनुमान; अन्तिम रकम आधिकारिक SSF नियमबमोजिम हुन्छ।"}
      </p>
    </div>
  );
}
