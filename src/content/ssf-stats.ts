/**
 * Headline SSF figures — transcribed from the Fund's "दैनिक संक्षेप रिपोर्ट"
 * image published at ssf.gov.np/summary-report (report dated वि.सं. २०८३ असोज ३०).
 * Update when the Fund publishes a newer report; keep the date fields in sync.
 */

export const SSF_STATS_AS_OF_BS = "२०८३ असोज ३०";
export const SSF_STATS_AS_OF_ISO = "2026-10-16";
export const SSF_STATS_SOURCE_URL = "https://ssf.gov.np/summary-report";

export const ssfStats = {
  employers: 23_807,
  contributors: {
    formal: 790_083,
    foreign: 2_450_958,
    informal: 1_168,
    selfEmployed: 1_492,
    total: 3_243_701,
  },
  /** NPR, total contribution collected to date (१२९ अर्ब ६४ करोड) */
  collectionNpr: 129_64_00_00_000,
  claims: {
    /** number of contributors who have claimed */
    claimants: 327_779,
    /** number of claims paid */
    paid: 1_477_361,
    /** NPR paid out (२२ अर्ब ९० करोड) */
    paidNpr: 22_90_00_00_000,
  },
  formalByProvince: {
    koshi: { employers: 2_703, contributors: 92_405 },
    madhesh: { employers: 1_321, contributors: 38_308 },
    bagmati: { employers: 15_551, contributors: 571_179 },
    gandaki: { employers: 1_428, contributors: 37_324 },
    lumbini: { employers: 2_110, contributors: 40_491 },
    karnali: { employers: 314, contributors: 4_332 },
    sudurpashchim: { employers: 380, contributors: 6_044 },
  },
} as const;

const NE_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

/** 3243701 → "३२.४ लाख" / "32.4 lakh" */
export function formatLakh(n: number, isEn: boolean): string {
  const lakh = n / 100_000;
  const s = lakh >= 100 ? Math.round(lakh).toString() : lakh.toFixed(1).replace(/\.0$/, "");
  return isEn ? `${s} lakh` : `${toNe(s)} लाख`;
}

/** 12964e7 → "रु. १२९.६४ अर्ब" / "Rs 129.64 arab" */
export function formatArab(npr: number, isEn: boolean): string {
  const arab = npr / 1_00_00_00_000;
  const s = arab.toFixed(2).replace(/\.?0+$/, "");
  return isEn ? `Rs ${s} arab` : `रु. ${toNe(s)} अर्ब`;
}

export function formatCount(n: number, isEn: boolean): string {
  const s = n.toLocaleString("en-IN");
  return isEn ? s : toNe(s);
}

export function toNe(s: string): string {
  return s.replace(/[0-9]/g, (d) => NE_DIGITS[Number(d)]);
}
