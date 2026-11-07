"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import {
  computeSectorBreakdown,
  type SectorKey,
} from "@/lib/calculation/sector-breakdown";
import { formatNpr } from "@/lib/money";
import { Icon, type IconName } from "./icons";
import { Callout } from "./ui";

const BUCKET_STYLE: Record<string, { bar: string; chip: string; icon: IconName }> = {
  pension: { bar: "bg-primary-600", chip: "badge-primary", icon: "coins" },
  gratuity: { bar: "bg-primary-400", chip: "badge-primary", icon: "landmark" },
  oldage: { bar: "bg-primary-500", chip: "badge-primary", icon: "user" },
  insurance: { bar: "bg-action-500", chip: "badge-action", icon: "shield" },
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
    <div className="card p-5 md:p-6">
      <div className="flex items-start gap-3.5">
        <span className="icon-tile">
          <Icon name="calculator" size={20} />
        </span>
        <div>
          <h2 className="text-xl md:text-2xl">
            {isEn ? "Your contribution breakdown" : "तपाईंको योगदान breakdown"}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {isEn
              ? "Enter your base amount and see exactly how much goes to pension, gratuity, and insurance."
              : "आफ्नो आधार रकम राख्नुहोस् — कति पेन्सन, कति उपदान र कति बीमामा जान्छ ठ्याक्कै हेर्नुहोस्।"}
          </p>
        </div>
      </div>

      <label className="mt-5 block text-sm font-semibold text-ink-800">
        {isEn ? baseLabelEn : baseLabelNe}
        <input
          type="number"
          min={0}
          value={base}
          onChange={(e) => setBase(Number(e.target.value))}
          className="input mt-1.5 text-lg font-semibold"
        />
      </label>

      {/* headline total */}
      <div className="mt-5 rounded-2xl bg-primary-700 p-5 text-white">
        <p className="text-xs font-medium uppercase tracking-eyebrow text-primary-200">
          {isEn
            ? `Total monthly contribution (${r.totalPct}%)`
            : `कुल मासिक योगदान (${r.totalPct}%)`}
        </p>
        <p className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">{npr(r.total)}</p>
        <p className="mt-2 text-xs text-primary-200">
          {r.whoPays
            .map(
              (w) =>
                `${isEn ? w.labelEn : w.labelNe}: ${npr(w.amount)} (${w.pct}%)`,
            )
            .join("  ·  ")}
        </p>
      </div>

      {/* stacked bar */}
      <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-ink-100">
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
            <div key={b.key} className="surface p-4">
              <div className="flex items-center justify-between">
                <span className="icon-tile h-9 w-9 bg-white">
                  <Icon name={st.icon} size={18} />
                </span>
                <span className={st.chip}>{b.pct}%</span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-900">
                {npr(b.amount)}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink-800">
                {isEn ? b.labelEn : b.labelNe}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">
                {isEn ? b.descEn : b.descNe}
              </p>
            </div>
          );
        })}
      </div>

      {/* insurance detail */}
      {r.insuranceDetail.length > 0 && (
        <div className="mt-4 rounded-2xl border border-action-200 bg-action-50 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-action-700">
            <Icon name="shield" size={16} />
            {isEn ? "Insurance portion — what it covers" : "बीमा भाग — के-के समेट्छ"}
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
            {r.insuranceDetail.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-2 rounded-xl bg-white/70 px-3 py-2 sm:block">
                <span className="text-ink-600">{isEn ? d.labelEn : d.labelNe}</span>
                <span className="font-semibold text-ink-900 sm:mt-0.5 sm:block">
                  {npr(d.amount)}{" "}
                  <span className="font-normal text-ink-400">({d.pct}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <Callout tone="info">{isEn ? r.noteEn : r.noteNe}</Callout>
      </div>
      <p className="mt-3 text-xs text-ink-400">
        {isEn
          ? "Preliminary educational estimate; final figures follow official SSF rules."
          : "प्रारम्भिक शैक्षिक अनुमान; अन्तिम रकम आधिकारिक SSF नियमबमोजिम हुन्छ।"}
      </p>
    </div>
  );
}
