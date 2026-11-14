"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { calculateForeignEmployment } from "@/lib/calculation/engine";
import { FOREIGN_EMPLOYMENT_RULE_V1, MIN_BASIC_REMUNERATION } from "@/lib/calculation/rules";
import { useSsfProfile } from "@/lib/profile";
import { trackEvent } from "@/lib/analytics";
import { toNeDigits } from "@/lib/nepali-date";
import { Icon } from "@/components/icons";

/**
 * Migrant-worker country panel: pick the destination country once (saved in
 * the browser profile), then see the SSF monthly contribution for a 1×/2×/3×
 * base in that currency, the SSF office hours in local time, and a live
 * Nepal clock. FX rates are INDICATIVE only — the user is told to check
 * their own remittance rate.
 */

/** NPR per 1 unit of foreign currency — indicative, not a quote. */
export const INDICATIVE_FX = {
  AED: 36.3,
  QAR: 36.6,
  SAR: 35.5,
  KWD: 433,
  MYR: 30.2,
  KRW: 0.093,
  JPY: 0.86,
  INR: 1.6,
  USD: 133.5,
} as const;
export const FX_AS_OF = "2026-11-14";

export type FxCode = keyof typeof INDICATIVE_FX;

export interface MigrantCountry {
  /** ISO 3166-1 alpha-2; "XX" = other */
  code: string;
  nameNe: string;
  nameEn: string;
  currency: FxCode;
  /** IANA zone; undefined = use the viewer's own zone */
  zone?: string;
  /** currencies without minor units */
  noDecimals?: boolean;
}

export const MIGRANT_COUNTRIES: MigrantCountry[] = [
  { code: "AE", nameNe: "यूएई (दुबई)", nameEn: "UAE", currency: "AED", zone: "Asia/Dubai" },
  { code: "QA", nameNe: "कतार", nameEn: "Qatar", currency: "QAR", zone: "Asia/Qatar" },
  { code: "SA", nameNe: "साउदी अरब", nameEn: "Saudi Arabia", currency: "SAR", zone: "Asia/Riyadh" },
  { code: "KW", nameNe: "कुवेत", nameEn: "Kuwait", currency: "KWD", zone: "Asia/Kuwait" },
  { code: "MY", nameNe: "मलेसिया", nameEn: "Malaysia", currency: "MYR", zone: "Asia/Kuala_Lumpur" },
  { code: "KR", nameNe: "दक्षिण कोरिया", nameEn: "South Korea", currency: "KRW", zone: "Asia/Seoul", noDecimals: true },
  { code: "JP", nameNe: "जापान", nameEn: "Japan", currency: "JPY", zone: "Asia/Tokyo", noDecimals: true },
  { code: "IN", nameNe: "भारत", nameEn: "India", currency: "INR", zone: "Asia/Kolkata" },
  { code: "XX", nameNe: "अन्य देश", nameEn: "Other", currency: "USD" },
];

export function countryByCode(code?: string): MigrantCountry | undefined {
  return MIGRANT_COUNTRIES.find((c) => c.code === code);
}

const KATHMANDU = "Asia/Kathmandu";
/** SSF head office hours — Nepal time (Sunday to Friday). */
const OFFICE_OPEN = { h: 10, m: 0 };
const OFFICE_CLOSE = { h: 17, m: 0 };
// Government offices close early on Friday (general Nepal office hours — the Fund has not published its own).
const OFFICE_CLOSE_FRIDAY = { h: 15, m: 0 };
/** Nepal has a fixed UTC+05:45 offset and no DST. */
const NPT_OFFSET_MIN = 5 * 60 + 45;

function nptToInstant(now: Date, h: number, m: number): Date {
  // Today's date in Kathmandu, then the chosen wall-clock time there as a UTC instant.
  const kt = new Date(now.getTime() + NPT_OFFSET_MIN * 60_000);
  return new Date(Date.UTC(kt.getUTCFullYear(), kt.getUTCMonth(), kt.getUTCDate(), h, m) - NPT_OFFSET_MIN * 60_000);
}

function fmtTime(d: Date, zone: string | undefined, isEn: boolean): string {
  try {
    const s = new Intl.DateTimeFormat(isEn ? "en-GB" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      ...(zone ? { timeZone: zone } : {}),
    }).format(d);
    return isEn ? s : toNeDigits(s).replace("am", "बिहान").replace("pm", "दिउँसो");
  } catch {
    return "—";
  }
}

export function CountryPanel() {
  const locale = useLocale();
  const isEn = locale === "en";
  const n = (v: string | number) => (isEn ? String(v) : toNeDigits(v));
  const { profile, ready, update } = useSsfProfile();
  const selected = countryByCode(profile.country) ?? null;
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const rows = useMemo(
    () =>
      [1, 2, 3].map((k) => {
        const base = MIN_BASIC_REMUNERATION * k;
        const r = calculateForeignEmployment({ base, periodMonths: 1 }, FOREIGN_EMPLOYMENT_RULE_V1);
        return { k, base, monthly: r.monthlyTotal, schemes: r.schemes };
      }),
    [],
  );

  function pick(c: MigrantCountry) {
    update({ country: c.code, role: profile.role ?? "foreign" });
    trackEvent("calculator_result", { tool: "foreign_country", country: c.code });
  }

  const npr = (v: number) => `${isEn ? "Rs" : "रु."} ${n(v.toLocaleString("en-IN"))}`;
  const fx = (nprAmount: number, c: MigrantCountry) => {
    const rate = INDICATIVE_FX[c.currency];
    const v = nprAmount / rate;
    const s = v.toLocaleString("en-US", {
      minimumFractionDigits: c.noDecimals ? 0 : 2,
      maximumFractionDigits: c.noDecimals ? 0 : 2,
    });
    return `${c.currency} ${n(s)}`;
  };

  const nowNepal = now ? fmtTime(now, KATHMANDU, isEn) : "—";
  const openLocal = now && selected ? fmtTime(nptToInstant(now, OFFICE_OPEN.h, OFFICE_OPEN.m), selected.zone, isEn) : null;
  const nepalDayForClose = now ? new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: KATHMANDU }).format(now) : "";
  const closeToday = nepalDayForClose === "Friday" ? OFFICE_CLOSE_FRIDAY : OFFICE_CLOSE;
  const closeLocal = now && selected ? fmtTime(nptToInstant(now, closeToday.h, closeToday.m), selected.zone, isEn) : null;
  const nowLocal = now && selected ? fmtTime(now, selected.zone, isEn) : null;
  const nepalDay = now ? new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: KATHMANDU }).format(now) : "";
  const officeOpenNow = (() => {
    if (!now) return false;
    if (nepalDay === "Saturday") return false;
    const o = nptToInstant(now, OFFICE_OPEN.h, OFFICE_OPEN.m).getTime();
    const c = nptToInstant(now, closeToday.h, closeToday.m).getTime();
    return now.getTime() >= o && now.getTime() < c;
  })();

  return (
    <div className="card p-5 md:p-6">
      <p className="text-sm font-medium text-ink-700">{isEn ? "Where do you work?" : "तपाईं कुन देशमा काम गर्नुहुन्छ?"}</p>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={isEn ? "Country" : "देश"}>
        {MIGRANT_COUNTRIES.map((c) => {
          const active = ready && selected?.code === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => pick(c)}
              className={`chip ${active ? "chip-active" : ""}`}
              aria-pressed={active}
            >
              {isEn ? c.nameEn : c.nameNe}
            </button>
          );
        })}
      </div>

      {/* Contribution table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink-200">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-600">
              <th className="px-4 py-2.5">{isEn ? "Base" : "आधार"}</th>
              <th className="px-4 py-2.5">{isEn ? "Base amount" : "आधार रकम"}</th>
              <th className="px-4 py-2.5">{isEn ? `Monthly (${FOREIGN_EMPLOYMENT_RULE_V1.minPct}%)` : `मासिक (${n(FOREIGN_EMPLOYMENT_RULE_V1.minPct)}%)`}</th>
              <th className="px-4 py-2.5">{selected ? (isEn ? `In ${selected.currency}` : `${selected.currency} मा`) : isEn ? "In your currency" : "तपाईंको मुद्रामा"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className={`border-t border-ink-100 ${r.k === 1 ? "bg-primary-50/40" : ""}`}>
                <td className="px-4 py-3 font-semibold text-ink-900">
                  {n(r.k)}×{r.k === 1 && <span className="badge-primary ml-2">{isEn ? "minimum" : "न्यूनतम"}</span>}
                </td>
                <td className="px-4 py-3 text-ink-700">{npr(r.base)}</td>
                <td className="px-4 py-3 font-display text-lg font-bold text-primary-700">{npr(r.monthly)}</td>
                <td className="px-4 py-3 font-semibold text-ink-900">{selected ? fx(r.monthly, selected) : <span className="text-ink-400">{isEn ? "select a country" : "देश छान्नुहोस्"}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-2 text-xs text-ink-500">
        <p>
          {isEn
            ? `Allocation: ${FOREIGN_EMPLOYMENT_RULE_V1.allocation.protection}% protection (medical + accident + dependent family) + ${FOREIGN_EMPLOYMENT_RULE_V1.allocation.oldAge}% old age. Base from Rs ${MIN_BASIC_REMUNERATION.toLocaleString("en-IN")} up to 3×.`
            : `बाँडफाँट: ${n(FOREIGN_EMPLOYMENT_RULE_V1.allocation.protection)}% सुरक्षा (उपचार + दुर्घटना + आश्रित परिवार) + ${n(FOREIGN_EMPLOYMENT_RULE_V1.allocation.oldAge)}% वृद्ध अवस्था। आधार रु. ${n(MIN_BASIC_REMUNERATION.toLocaleString("en-IN"))} देखि ३ गुणासम्म।`}
        </p>
        {selected && (
          <p className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-800">
            <Icon name="alert" size={12} />
            {isEn
              ? `Indicative rate · ${FX_AS_OF} · 1 ${selected.currency} ≈ Rs ${INDICATIVE_FX[selected.currency]} · check your remit rate`
              : `सांकेतिक दर · ${n(FX_AS_OF)} · १ ${selected.currency} ≈ रु. ${n(INDICATIVE_FX[selected.currency])} · आफ्नो remit दर हेर्नुहोस्`}
          </p>
        )}
      </div>

      {/* Time panel */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-ink-200 bg-ink-50 p-4">
          <p className="flex items-center gap-1.5 text-xs text-ink-500">
            <Icon name="clock" size={14} />
            {isEn ? "Time in Nepal now" : "अहिले नेपालमा समय"}
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink-900" suppressHydrationWarning>
            {nowNepal}
          </p>
          <p className="mt-0.5 text-xs text-ink-500">
            {now ? (officeOpenNow ? (isEn ? "SSF office open now" : "SSF कार्यालय अहिले खुला") : isEn ? "SSF office closed now" : "SSF कार्यालय अहिले बन्द") : ""}
          </p>
        </div>
        <div className="rounded-xl border border-ink-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-xs text-ink-500">
            <Icon name="landmark" size={14} />
            {isEn ? "SSF office hours (Nepal)" : "SSF कार्यालय समय (नेपाल)"}
          </p>
          <p className="mt-1 font-semibold text-ink-900">{isEn ? "Sun–Thu 10:00–17:00 · Fri 10:00–15:00" : "आइत–बिहि १०:००–१७:०० · शुक्र १०:००–१५:००"}</p>
          <p className="mt-0.5 text-xs text-ink-500">{isEn ? "General government office hours · hotline 1116 (toll-free in Nepal)" : "सामान्य सरकारी कार्यालय समय · हटलाइन १११६ (नेपालभित्र टोल फ्री)"}</p>
        </div>
        <div className="rounded-xl border border-ink-200 bg-white p-4">
          <p className="flex items-center gap-1.5 text-xs text-ink-500">
            <Icon name="globe" size={14} />
            {selected ? (isEn ? `Same hours in ${selected.nameEn}` : `${selected.nameNe}को समयमा`) : isEn ? "In your local time" : "तपाईंको स्थानीय समयमा"}
          </p>
          {selected && openLocal && closeLocal ? (
            <>
              <p className="mt-1 font-semibold text-ink-900">
                {openLocal} – {closeLocal}
              </p>
              <p className="mt-0.5 text-xs text-ink-500" suppressHydrationWarning>
                {isEn ? "Local time now" : "अहिले त्यहाँ"}: {nowLocal}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-ink-400">{isEn ? "Select your country above." : "माथि देश छान्नुहोस्।"}</p>
          )}
        </div>
      </div>
    </div>
  );
}
